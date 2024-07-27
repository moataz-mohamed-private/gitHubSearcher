import { getRepos, getUsers } from "@/api/githubApi";
import { gitHubSearchState } from "./gitHubSearch.reducer";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";

export const shouldStartListining = (
  currentState: gitHubSearchState,
  previousState: gitHubSearchState
) => {
  return (
    currentState.searchQuery !== previousState.searchQuery ||
    currentState.filterType !== previousState.filterType
  );
};

export const isCached = (state: gitHubSearchState) => {
  if (state.cachedResults[state.filterType][state.searchQuery]) {
    return true;
  }
  return false;
};

export const retriveFromCache = (state: gitHubSearchState) => {
  return state.cachedResults[state.filterType][state.searchQuery];
};

export const fetchData = async (state: gitHubSearchState) => {
  let resp;
  if (state.filterType === "repos") {
    resp = await getRepos(state.searchQuery);
    return resp.data;
  } else if (state.filterType === "users") {
    resp = await getUsers(state.searchQuery);
    return resp.data;
  }
};

export const addAndRemoveFromCache = (
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
