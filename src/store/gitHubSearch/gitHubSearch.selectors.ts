import { useAppSelector } from "..";

export const useSearchQuery = () =>
  useAppSelector((state) => state.gitHubSearch.searchQuery);
export const useSearchResult = () =>
  useAppSelector((state) => state.gitHubSearch.searchResult);
export const useFilterType = () =>
  useAppSelector((state) => state.gitHubSearch.filterType);
export const useCachedResult = () =>
  useAppSelector((state) => state.gitHubSearch.cachedResults);
export const useIsLoading = () =>
  useAppSelector((state) => state.gitHubSearch.isLoading);
export const useLastPageReached = () =>
  useAppSelector((state) => state.gitHubSearch.lastPageReached);
