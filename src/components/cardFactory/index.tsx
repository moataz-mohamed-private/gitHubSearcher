import { filterType } from "@/types/common";
import { RepoItem } from "@/types/repos";
import { UserItem } from "@/types/users";
import { FC, ReactElement } from "react";
import { RepoCard } from "./repoCard/repo-card";
import { UserCard } from "./userCard/user-card";

type CardFactoryProps = {
  type: filterType;
  item: UserItem | RepoItem;
};

type CardMap = {
  [key in filterType]: ReactElement;
};

export const CardFactory: FC<CardFactoryProps> = ({ type, item }) => {
  const cardMap: CardMap = {
    users: <UserCard item={item as UserItem} />,
    repos: <RepoCard item={item as RepoItem} />,
  };
  return cardMap[type];
};
