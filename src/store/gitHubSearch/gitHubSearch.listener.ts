import { AppDispatch, RootState } from "..";
import { listenerMiddleware } from "../listenerMiddleware";
import { cachedDataUpdated, searchResultUpdated } from "./gitHubSearch.reducer";
import {
  fetchData,
  isCached,
  retriveFromCache,
  shouldStartFetching,
} from "./gitHubSearch.utils";

export const listenToGitHubSearch = () => {
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
    predicate: (_action, currentState, previousState) => {
      return shouldStartFetching(currentState, previousState);
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
};
