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
import { addAndRemoveFromCache } from "./gitHubSearch.utils";
import { AppDispatch, RootState, listenerMiddleware } from "..";
import {
  fetchData,
  isCached,
  retriveFromCache,
  shouldStartFetching,
} from "./gitHubSearch.utils";

export interface gitHubSearchState {
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

export const {
  searchQueryUpdated,
  filterTypeUpdated,
  searchResultUpdated,
  searchReset,
  cachedDataUpdated,
} = gitHubSearchSlice.actions;

export const gitHubSearchSliceReducer = gitHubSearchSlice.reducer;
