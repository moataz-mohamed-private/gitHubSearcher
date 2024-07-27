import { createListenerMiddleware } from "@reduxjs/toolkit";
import { listenToGitHubSearch } from "./gitHubSearch/gitHubSearch.listener";

export const listenerMiddleware = createListenerMiddleware();

listenToGitHubSearch();