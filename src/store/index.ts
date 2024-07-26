import {
  configureStore,
  createSlice,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector } from "react-redux";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";
import { filterType } from "@/types/common";
import { getRepos, getUsers } from "@/api/githubApi";

interface gitHubSearchState {
  searchQuery: string;
  searchResult: Repos | Users;
  filterType: filterType;
  cachedResults: {
    repo: { [key: string]: Repos };
    user: { [key: string]: Users };
  };
}

const initialState: gitHubSearchState = {
  searchQuery: "",
  searchResult: {} as Repos,
  filterType: "repo",
  cachedResults: {
    repo: {},
    user: {},
  },
};

export const gitHubSearchSlice = createSlice({
  name: "gitHubSearch",
  initialState,
  reducers: {
    searchQueryUpdated: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    filterTypeUpdated: (state, action: PayloadAction<filterType>) => {
      state.filterType = action.payload;
    },
    searchReset: (state) => {
      state.searchQuery = "";
    },
    searchResultUpdated: (state, action: PayloadAction<Repos | Users>) => {
      state.searchResult = action.payload;
    },
  },
});

const gitHubSearchSliceReducer = gitHubSearchSlice.reducer;

export const {
  searchQueryUpdated,
  filterTypeUpdated,
  searchResultUpdated,
  searchReset,
} = gitHubSearchSlice.actions;

const listenerMiddleware = createListenerMiddleware();

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    whitelist: ["cachedResults"],
  },
  combineReducers({ gitHubSearch: gitHubSearchSliceReducer })
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useSearchQuery = () =>
  useAppSelector((state) => state.gitHubSearch.searchQuery);
export const useSearchResult = () =>
  useAppSelector((state) => state.gitHubSearch.searchResult);

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_action, currentState, previousState) => {
    return (
      currentState.gitHubSearch.searchQuery !==
        previousState.gitHubSearch.searchQuery ||
      (currentState.gitHubSearch.filterType !==
        previousState.gitHubSearch.filterType &&
        currentState.gitHubSearch.searchQuery.length > 3)
    );
  },
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(500);

    const data = await fetchOrRetriveData(listenerApi.getState() as any);
    listenerApi.dispatch(searchResultUpdated(data));
  },
});

const fetchOrRetriveData = async (state: gitHubSearchState) => {
  let resp;
  if (state.cachedResults[state.filterType][state.searchQuery]) {
    return state.cachedResults[state.filterType][state.searchQuery];
  }
  if (state.filterType === "repo") {
    resp = await getRepos(state.searchQuery);
    return resp.data;
  } else if (state.filterType === "user") {
    resp = await getUsers(state.searchQuery);
    return resp.data;
  }
};
