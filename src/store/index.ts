import {
  configureStore,
  createSlice,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector } from "react-redux";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";
import { filterType } from "@/types/common";
import { getRepos, getUsers } from "@/api/githubApi";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { getPersistConfig } from "redux-deep-persist";

interface gitHubSearchState {
  searchQuery: string;
  searchResult: Repos | Users;
  filterType: filterType;
  cachedResults: {
    repos: { [key: string]: Repos };
    users: { [key: string]: Users };
  };
}

const initialState: gitHubSearchState = {
  searchQuery: "",
  searchResult: {} as Repos,
  filterType: "repos",
  cachedResults: {
    repos: {},
    users: {},
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
    cachedDataUpdated: (state, action: PayloadAction<Repos | Users>) => {
      state.cachedResults = addAndRemoveFromCache(state, action.payload);
    },
  },
});

const gitHubSearchSliceReducer = gitHubSearchSlice.reducer;

export const {
  searchQueryUpdated,
  filterTypeUpdated,
  searchResultUpdated,
  searchReset,
  cachedDataUpdated,
} = gitHubSearchSlice.actions;

const listenerMiddleware = createListenerMiddleware();

const config = getPersistConfig({
  key: "root",
  storage,
  whitelist: ["gitHubSearch.cachedResults"],
  rootReducer: combineReducers({ gitHubSearch: gitHubSearchSliceReducer }),
}) as any;

const persistedReducer = persistReducer(
  config,
  combineReducers({ gitHubSearch: gitHubSearchSliceReducer })
);
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend(
      listenerMiddleware.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useSearchQuery = () =>
  useAppSelector((state) => state.gitHubSearch.searchQuery);
export const useSearchResult = () =>
  useAppSelector((state) => state.gitHubSearch.searchResult);
export const useFilterType = () =>
  useAppSelector((state) => state.gitHubSearch.filterType);
export const useCachedResult = () =>
  useAppSelector((state) => state.gitHubSearch.cachedResults);

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

    let data;
    if (isCached(listenerApi.getState())) {
      data = retriveFromCache(listenerApi.getState());
    } else {
      data = await fetchData(listenerApi.getState());
      if (data) listenerApi.dispatch(cachedDataUpdated(data));
    }

    if (data) listenerApi.dispatch(searchResultUpdated(data));
  },
});

type presistedStateListner = {
  gitHubSearch: gitHubSearchState;
} & PersistPartial;

const isCached = (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
  if (
    gitHubSearchState.cachedResults[gitHubSearchState.filterType][
      gitHubSearchState.searchQuery
    ]
  ) {
    return true;
  }
  return false;
};

const retriveFromCache = (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
  return gitHubSearchState.cachedResults[gitHubSearchState.filterType][
    gitHubSearchState.searchQuery
  ];
};

const fetchData = async (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
  let resp;
  if (gitHubSearchState.filterType === "repos") {
    resp = await getRepos(gitHubSearchState.searchQuery);
    return resp.data;
  } else if (gitHubSearchState.filterType === "users") {
    resp = await getUsers(gitHubSearchState.searchQuery);
    return resp.data;
  }
};

const addAndRemoveFromCache = (
  state: gitHubSearchState,
  newData: Repos | Users
) => {
  const cacheMaxSize = 10;
  const cachedFilterState = state.cachedResults[state.filterType];
  const cachedQueryKeys = Object.keys(cachedFilterState);

  if (cachedQueryKeys.length > cacheMaxSize) {
    delete cachedFilterState[cachedQueryKeys[0]];
  }
  cachedFilterState[state.searchQuery] = newData;
  return {
    [state.filterType]: cachedFilterState,
    ...state.cachedResults,
  };
};

const cacheFetchedData = (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
};
// const fetchOrRetriveData = async (state: gitHubSearchState) => {
//   let resp;
//   if (state.cachedResults[state.filterType][state.searchQuery]) {
//     return state.cachedResults[state.filterType][state.searchQuery];
//   }
//   if (state.filterType === "repo") {
//     resp = await getRepos(state.searchQuery);
//     return resp.data;
//   } else if (state.filterType === "user") {
//     resp = await getUsers(state.searchQuery);
//     return resp.data;
//   }
// };
