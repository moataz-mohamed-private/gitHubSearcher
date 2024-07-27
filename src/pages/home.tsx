import { Input } from "@/components/Input";
import {
  searchQueryUpdated,
  useSearchQuery,
  filterTypeUpdated,
  useSearchResult,
  useCachedResult,
  useFilterType,
} from "@/store";
import { useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { Option, filterType } from "@/types/common";
import { SelectDropdown } from "@/components/selectDropdown";
export const HomePage: FC = () => {
  const dispatch = useDispatch();
  const searcResult = useSearchResult();
  const cachedData = useCachedResult();
  const filterType = useFilterType();
  const options: Option[] = [
    { value: "users", label: "Users" },
    { value: "repos", label: "Repositories" },
  ];

  useEffect(() => {
    console.log(cachedData);
  }, []);
  return (
    <section>
      aaaa aaa
      <div>
        <Input
          placeholder="type to start searching..."
          onChange={(e) => dispatch(searchQueryUpdated(e.target.value))}
          type={"string"}
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
        {searcResult?.items?.map((item) => (
          <span style={{ margin: "5px" }}>{item.url}</span>
        ))}
      </div>
      <div>
        {Object.keys(cachedData?.[filterType])?.map((item) => (
          <span style={{ margin: "5px" }}>{item}</span>
        ))}
      </div>
    </section>
  );
};
