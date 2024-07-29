import { AppDispatch, RootState } from "..";
import { listenerMiddleware } from "../listenerMiddleware";
import {
  cachedDataUpdated,
  searchResultUpdated,
  resetSearchResult,
  isLoadingUpdated,
  lastPageReached,
} from "./gitHubSearch.reducer";
import {
  fetchData,
  isCached,
  retriveFromCache,
  shouldStartListining,
} from "./gitHubSearch.utils";

export const listenToGitHubSearch = () => {
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (_action, currentState, previousState) => {
      return shouldStartListining(
        currentState.gitHubSearch,
        previousState.gitHubSearch
      );
    },
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      await listenerApi.delay(700);

      const gitHubSearchState = listenerApi.getState().gitHubSearch;
      if (gitHubSearchState.searchQuery.length < 3) {
        listenerApi.dispatch(resetSearchResult());
      } else {
        let data;
        if (isCached(gitHubSearchState)) {
          data = retriveFromCache(gitHubSearchState);
        } else {
          listenerApi.dispatch(isLoadingUpdated(true));
          data = await fetchData(gitHubSearchState);
          if (data) listenerApi.dispatch(cachedDataUpdated(data));
          listenerApi.dispatch(isLoadingUpdated(false));
        }

        if (data) listenerApi.dispatch(searchResultUpdated(data));
      }
    },
  });
};

export const listenToGitHubSearchPageChange = () => {
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (_action, currentState, previousState) => {
      return (
        currentState.gitHubSearch.page !== previousState.gitHubSearch.page &&
        currentState.gitHubSearch.filterType ===
          previousState.gitHubSearch.filterType
      );
    },
    effect: async (_action, listenerApi) => {
      const gitHubSearchState = listenerApi.getState().gitHubSearch;
      listenerApi.dispatch(isLoadingUpdated(true));
      let data = await fetchData(gitHubSearchState, gitHubSearchState.page);

      const searchResults = gitHubSearchState.searchResult;
      if (data && data.items.length > 0) {
        listenerApi.dispatch(
          searchResultUpdated({
            ...searchResults,
            items: [...searchResults.items, ...data.items] as any,
          })
        );
      } else if (data && data.items.length === 0) {
        listenerApi.dispatch(lastPageReached());
      }

      listenerApi.dispatch(isLoadingUpdated(false));
    },
  });
};
