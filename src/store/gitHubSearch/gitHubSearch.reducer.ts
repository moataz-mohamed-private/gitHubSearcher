import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";
import { filterType } from "@/types/common";
import { addAndRemoveFromCache } from "./gitHubSearch.utils";

export interface gitHubSearchState {
  searchQuery: string;
  isLoading: boolean;
  searchResult: Repos | Users;
  page: number;
  lastPageReached: boolean;
  filterType: filterType;
  cachedResults: {
    repos: { [key: string]: Repos };
    users: { [key: string]: Users };
  };
}

const initialState: gitHubSearchState = {
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
    },
    filterTypeUpdated: (state, action: PayloadAction<filterType>) => {
      state.filterType = action.payload;
      state.page = 1;
    },
    searchReset: (state) => {
      state.searchQuery = "";
    },
    resetSearchResult: (state) => {
      state.searchResult = {} as Repos | Users;
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
  pageUpdated,
  lastPageReached,
} = gitHubSearchSlice.actions;

export const gitHubSearchSliceReducer = gitHubSearchSlice.reducer;
