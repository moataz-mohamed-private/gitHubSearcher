import { Input } from "@/components/Input";
import { useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { Option, filterType } from "@/types/common";
import { SelectDropdown } from "@/components/selectDropdown";
import {
  useCachedResult,
  useFilterType,
  useSearchQuery,
  useSearchResult,
} from "@/store/gitHubSearch/gitHubSearch.selectors";
import {
  filterTypeUpdated,
  searchQueryUpdated,
} from "@/store/gitHubSearch/gitHubSearch.reducer";
import classes from "./styles.module.scss";
import Chips from "../chips";

export const SearchFilters: FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSearchQuery();
  const searcResult = useSearchResult();
  const cachedData = useCachedResult();
  const filterType = useFilterType();
  const options: Option[] = [
    { value: "users", label: "Users" },
    { value: "repos", label: "Repositories" },
  ];

  const checkSearchHistory = (): string => {
    if (Object.keys(cachedData?.[filterType]).length > 0)
      return "Your Lastest Searches:";
    return "There Is No Search History";
  };

  return (
    <section className={classes.filtersContainer}>
      <div className={classes.filters}>
        <Input
          placeholder="type to start searching..."
          onChange={(e) => dispatch(searchQueryUpdated(e.target.value))}
          type={"string"}
          value={searchQuery}
        />
        <SelectDropdown
          options={options}
          onValueChange={(value) =>
            dispatch(filterTypeUpdated(value as filterType))
          }
          defaultValue="repos"
        />
      </div>
      <div>
        <small>{checkSearchHistory()}</small>
        <Chips
          options={Object.keys(cachedData?.[filterType]) || []}
          onClick={(option) => dispatch(searchQueryUpdated(option))}
        />
      </div>
    </section>
  );
};
