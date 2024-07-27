import { getRepos, getUsers } from "@/api/githubApi";
import { gitHubSearchState } from "./gitHubSearch.reducer";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { Repos } from "@/types/repos";
import { Users } from "@/types/users";

type presistedStateListner = {
  gitHubSearch: gitHubSearchState;
} & PersistPartial;

export const shouldStartFetching = (
  currentState: presistedStateListner,
  previousState: presistedStateListner
) => {
  return (
    currentState.gitHubSearch.searchQuery !==
      previousState.gitHubSearch.searchQuery ||
    (currentState.gitHubSearch.filterType !==
      previousState.gitHubSearch.filterType &&
      currentState.gitHubSearch.searchQuery.length > 3)
  );
};

export const isCached = (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
  if (
    gitHubSearchState.cachedResults[gitHubSearchState.filterType][
      gitHubSearchState.searchQuery
    ]
  ) {
    return true;
  }
  return false;
};

export const retriveFromCache = (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
  return gitHubSearchState.cachedResults[gitHubSearchState.filterType][
    gitHubSearchState.searchQuery
  ];
};

export const fetchData = async (state: presistedStateListner) => {
  const gitHubSearchState = state.gitHubSearch;
  let resp;
  if (gitHubSearchState.filterType === "repos") {
    resp = await getRepos(gitHubSearchState.searchQuery);
    return resp.data;
  } else if (gitHubSearchState.filterType === "users") {
    resp = await getUsers(gitHubSearchState.searchQuery);
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
