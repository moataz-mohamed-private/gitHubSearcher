import { FC } from "react";
import { FaStar, FaCircle } from "@radix-ui/react-icons/fa";
import { BiGitRepoForked } from "@radix-ui/react-icons/bi";
import { BsEye } from "@radix-ui/react-icons/bs";
import { RepoItem } from "@/types/repos";
import {
  StarIcon,
  EyeOpenIcon,
  CommitIcon,
  CodeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { UserItem } from "@/types/users";
import classes from "../styles.module.scss";

type CardProps = {
  item: UserItem;
};

export const UserCard: FC<CardProps> = ({ item }) => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };
  return (
    <div
      className={classes.userCard}
      onClick={() => openInNewTab(item.html_url)}
    >
      <div className={classes.card}>
        <div className={classes.cardImage}>
          <img
            src={item.avatar_url}
            alt="An orange painted blue, cut in half laying on a blue background"
          />
        </div>
        <div className={classes.cardHeader}>
          <h3 className={classes.name}>{item.login}</h3>
        </div>
        <div className={classes.cardFooter}>
          <div className={classes.cardMeta}>
            <EyeOpenIcon />
            {item.type}
          </div>
        </div>
      </div>
    </div>
  );
};
