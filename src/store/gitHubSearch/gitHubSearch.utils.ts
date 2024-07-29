import { getRepos, getUsers } from "@/api/githubApi";
import { gitHubSearchState } from "./gitHubSearch.reducer";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";

export const shouldStartListining = (
  currentState: gitHubSearchState<Repos | Users>,
  previousState: gitHubSearchState<Repos | Users>
) => {
  return (
    currentState.searchQuery !== previousState.searchQuery ||
    currentState.filterType !== previousState.filterType
  );
};

export const shouldStartIncrementingResults = (
  currentState: gitHubSearchState<Repos | Users>,
  previousState: gitHubSearchState<Repos | Users>
) => {
  return (
    currentState.page !== previousState.page &&
    currentState.filterType === previousState.filterType &&
    currentState.searchQuery === previousState.searchQuery
  );
};

export const isCached = (state: gitHubSearchState<Repos | Users>) => {
  if (state.cachedResults[state.filterType][state.searchQuery]) {
    return true;
  }
  return false;
};

export const retriveFromCache = (state: gitHubSearchState<Repos | Users>) => {
  return state.cachedResults[state.filterType][state.searchQuery];
};

export const fetchData = async (
  state: gitHubSearchState<Repos | Users>,
  page = 1
) => {
  let resp;
  if (state.filterType === "repos") {
    resp = await getRepos(state.searchQuery, { page });
    return resp.data;
  } else if (state.filterType === "users") {
    resp = await getUsers(state.searchQuery, { page });
    return resp.data;
  }
};

export const addAndRemoveFromCache = (
  state: gitHubSearchState<Repos | Users>,
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
