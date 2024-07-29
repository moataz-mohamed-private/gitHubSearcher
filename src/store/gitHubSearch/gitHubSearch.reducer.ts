import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";
import { filterType } from "@/types/common";
import { addAndRemoveFromCache } from "./gitHubSearch.utils";

export interface gitHubSearchState<T> {
  searchQuery: string;
  isLoading: boolean;
  searchResult: T;
  page: number;
  lastPageReached: boolean;
  filterType: filterType;
  cachedResults: {
    repos: { [key: string]: Repos };
    users: { [key: string]: Users };
  };
}

const initialState: gitHubSearchState<Repos | Users> = {
  searchQuery: "",
  isLoading: false,
  page: 1,
  lastPageReached: false,
  searchResult: {} as Repos | Users,
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
      state.page = 1;
      state.lastPageReached = false;
    },
    filterTypeUpdated: (state, action: PayloadAction<filterType>) => {
      state.filterType = action.payload;
      state.page = 1;
      (state.searchQuery =
        state.searchQuery.length >= 3 ? "" : state.searchQuery),
        (state.lastPageReached = false);
    },
    searchReset: (state) => {
      state.searchQuery = "";
    },
    resetSearchResult: (state) => {
      state.searchResult = {} as Repos | Users;
    },
    resetPage: (state) => {
      state.page = 1;
      state.lastPageReached = false;
    },
    cachedResultsReset: (state) => {
      state.cachedResults = { repos: {}, users: {} };
    },
    searchResultUpdated: (state, action: PayloadAction<Repos | Users>) => {
      state.searchResult = action.payload;
    },
    pageUpdated: (state) => {
      state.page = state.page + 1;
    },

    lastPageReached: (state) => {
      state.lastPageReached = true;
    },
    isLoadingUpdated: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    cachedDataUpdated: (state, action: PayloadAction<Repos | Users>) => {
      state.cachedResults = addAndRemoveFromCache(state, action.payload);
      state.page = 1;
    },
  },
});

export const {
  searchQueryUpdated,
  filterTypeUpdated,
  searchResultUpdated,
  isLoadingUpdated,
  searchReset,
  cachedDataUpdated,
  resetSearchResult,
  resetPage,
  pageUpdated,
  lastPageReached,
  cachedResultsReset,
} = gitHubSearchSlice.actions;

export const gitHubSearchSliceReducer = gitHubSearchSlice.reducer;
