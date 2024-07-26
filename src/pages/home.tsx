import { Input } from "@/components/Input";
import { searchQueryUpdated, useSearchQuery, filterTypeUpdated } from "@/store";
import { useDispatch } from "react-redux";
import { FC } from "react";
import { Option, filterType } from "@/types/common";
import { SelectDropdown } from "@/components/selectDropdown";
export const HomePage: FC = () => {
  const dispatch = useDispatch();
  const options: Option[] = [
    { value: "users", label: "Users" },
    { value: "repos", label: "Repositories" },
  ];
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
          defaultValue="repo"
        />
      </div>
    </section>
  );
};
