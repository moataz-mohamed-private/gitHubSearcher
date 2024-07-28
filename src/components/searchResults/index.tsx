import {
  useFilterType,
  useIsLoading,
  useSearchQuery,
  useSearchResult,
} from "@/store/gitHubSearch/gitHubSearch.selectors";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { CardFactory } from "../cardFactory";
import classes from "./styles.module.scss";
import { getRepos } from "@/api/githubApi";
import { useDispatch } from "react-redux";
import { searchResultUpdated } from "@/store/gitHubSearch/gitHubSearch.reducer";

const SearchResults: FC = () => {
  const [page, setPage] = useState(1);
  const searchResults = useSearchResult();
  const searchQuery = useSearchQuery();
  const filterType = useFilterType();
  const isLoading = useIsLoading();
  const dispatch = useDispatch();
  const observer = useRef() as any;

  useEffect(() => {
    const getResultsUpdateState = async () => {
      let data;
      if (filterType === "repos") {
        data = await getRepos(searchQuery, { page });
      } else data = await getRepos(searchQuery, { page });

      dispatch(
        searchResultUpdated({
          ...searchResults,
          items: [...searchResults.items, ...data.data.items] as any,
        })
      );
    };
    getResultsUpdateState();
  }, [page]);

  const lastPostElementRef = useCallback(
    (node: Node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1); // trigger loading of new posts by chaging page no
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading]
  ) as any;

  return (
    <div className={classes.CardsGrid}>
      {searchResults?.items?.map((item, i) => (
        <div
          ref={
            searchResults?.items?.length === i + 1 ? lastPostElementRef : null
          }
        >
          <CardFactory type={filterType} item={item} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
