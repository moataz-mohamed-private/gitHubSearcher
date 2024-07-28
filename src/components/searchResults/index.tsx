import {
  useFilterType,
  useSearchResult,
} from "@/store/gitHubSearch/gitHubSearch.selectors";
import { FC } from "react";
import { CardFactory } from "../cardFactory";
import classes from "./styles.module.scss";

const SearchResults: FC = () => {
  const searchResults = useSearchResult();
  const filterType = useFilterType();
  return (
    <div className={classes.CardsGrid}>
      {searchResults?.items?.map((item) => (
        <CardFactory type={filterType} item={item} />
      ))}
    </div>
  );
};

export default SearchResults;
