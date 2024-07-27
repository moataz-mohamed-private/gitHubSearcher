import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector } from "react-redux";
import { getPersistConfig } from "redux-deep-persist";
import { gitHubSearchSliceReducer } from "./gitHubSearch/gitHubSearch.reducer";
import { listenerMiddleware } from "./listenerMiddleware";

const config = getPersistConfig({
  key: "root",
  storage,
  whitelist: ["gitHubSearch.cachedResults"],
  rootReducer: combineReducers({ gitHubSearch: gitHubSearchSliceReducer }),
});

const persistedReducer = persistReducer(
  config,
  combineReducers({ gitHubSearch: gitHubSearchSliceReducer })
);
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend(
      listenerMiddleware.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
