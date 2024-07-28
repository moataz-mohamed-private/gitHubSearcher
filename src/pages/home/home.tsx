import { FC } from "react";
import { SearchFilters } from "@/components/searcherFilters";
import { GithubHeader } from "@/components/gitHubHeader";
import { useSearchQuery } from "@/store/gitHubSearch/gitHubSearch.selectors";
import classes from "./styles.module.scss";
import SearchResults from "@/components/searchResults";

export const HomePage: FC = () => {
  const searchQuery = useSearchQuery();

  const CenterOrAlign = () => {
    return searchQuery.length > 0
      ? classes.FilterContainerAligned
      : classes.FilterContainerCentred;
  };

  return (
    <section>
      <div className={classes.gitHubFilterCont + " " + CenterOrAlign()}>
        <GithubHeader />
        <SearchFilters />
      </div>
      <SearchResults />
    </section>
  );
};
