import {
  useFilterType,
  useIsLoading,
  useSearchResult,
  useLastPageReached,
} from "@/store/gitHubSearch/gitHubSearch.selectors";
import { FC, useCallback, useRef } from "react";
import { CardFactory } from "../cardFactory";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { pageUpdated } from "@/store/gitHubSearch/gitHubSearch.reducer";
import { CardLoader } from "../cardLoader";

const SearchResults: FC = () => {
  const searchResults = useSearchResult();
  const filterType = useFilterType();
  const isLoading = useIsLoading();
  const lastPageReached = useLastPageReached();
  const dispatch = useDispatch();
  const observer = useRef() as any;

  const lastCardElementRef = useCallback(
    (node: Node) => {
      if (isLoading || lastPageReached) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (!isLoading) dispatch(pageUpdated());
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading]
  ) as any;

  return (
    <div>
      <div className={classes.CardsGrid}>
        {searchResults?.items?.map((item, i) => (
          <div
            ref={
              searchResults?.items?.length === i + 1 ? lastCardElementRef : null
            }
            key={item.id}
          >
            <CardFactory type={filterType} item={item} />
          </div>
        ))}
      </div>
      {isLoading && <CardLoader count={40} width="400px" height="300px" />}
    </div>
  );
};

export default SearchResults;
