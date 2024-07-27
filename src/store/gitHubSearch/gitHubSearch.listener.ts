import { AppDispatch, RootState } from "..";
import { listenerMiddleware } from "../listenerMiddleware";
import {
  cachedDataUpdated,
  searchResultUpdated,
  resetSearchResult,
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
      await listenerApi.delay(500);

      const gitHubSearchState = listenerApi.getState().gitHubSearch;
      if (gitHubSearchState.searchQuery.length < 3) {
        listenerApi.dispatch(resetSearchResult());
      } else {
        let data;
        if (isCached(gitHubSearchState)) {
          data = retriveFromCache(gitHubSearchState);
        } else {
          data = await fetchData(gitHubSearchState);
          if (data) listenerApi.dispatch(cachedDataUpdated(data));
        }

        if (data) listenerApi.dispatch(searchResultUpdated(data));
      }
    },
  });
};
