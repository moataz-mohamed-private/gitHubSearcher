import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  listenToGitHubSearch,
  listenToGitHubSearchPageChange,
} from "./gitHubSearch/gitHubSearch.listener";

export const listenerMiddleware = createListenerMiddleware();

listenToGitHubSearch();
listenToGitHubSearchPageChange();
