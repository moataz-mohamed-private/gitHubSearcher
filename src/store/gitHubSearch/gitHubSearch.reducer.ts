import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";
import { filterType } from "@/types/common";
import { addAndRemoveFromCache } from "./gitHubSearch.utils";

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
  resetSearchResult,
} = gitHubSearchSlice.actions;

export const gitHubSearchSliceReducer = gitHubSearchSlice.reducer;
