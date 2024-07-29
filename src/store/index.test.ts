import { expect, test } from "vitest";
import { store } from "./index";
import { searchQueryUpdated } from "./gitHubSearch/gitHubSearch.reducer";

test("sets the search string", async () => {
  await store.dispatch(searchQueryUpdated("javascript"));

  // Wait for the debounce to finish
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const state = store.getState();
  expect(state.gitHubSearch.searchResult.items[0].id).toContain("javascript");
  expect(state.gitHubSearch.searchResult.items.length).toBeGreaterThanOrEqual(
    1
  );
});
