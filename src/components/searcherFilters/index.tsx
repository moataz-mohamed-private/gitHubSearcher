import { Input } from "@/components/Input";
import { useDispatch } from "react-redux";
import { FC } from "react";
import { Option, filterType } from "@/types/common";
import { SelectDropdown } from "@/components/selectDropdown";
import {
  useCachedResult,
  useFilterType,
  useSearchQuery,
} from "@/store/gitHubSearch/gitHubSearch.selectors";
import {
  cachedResultsReset,
  filterTypeUpdated,
  searchQueryUpdated,
} from "@/store/gitHubSearch/gitHubSearch.reducer";
import classes from "./styles.module.scss";
import Chips from "../chips";

export const SearchFilters: FC = () => {
  const dispatch = useDispatch();
  const searchQuery = useSearchQuery();
  const cachedData = useCachedResult();
  const filterType = useFilterType();
  const options: Option[] = [
    { value: "users", label: "Users" },
    { value: "repos", label: "Repositories" },
  ];

  const checkSearchHistory = (): string => {
    if (Object.keys(cachedData?.[filterType]).length > 0)
      return "Lastest Searches:";
    return "No Search History";
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
          defaultValue={filterType}
        />
        <button
          className={classes.resetButton}
          onClick={() => dispatch(cachedResultsReset())}
        >
          reset history
        </button>
      </div>
      <div>
        <Chips
          placeholder={checkSearchHistory()}
          options={Object.keys(cachedData?.[filterType]) || []}
          onClick={(option) => dispatch(searchQueryUpdated(option))}
        />
      </div>
    </section>
  );
};
