import { FC } from "react";
// import { FaStar, FaCircle } from "react-icons/fa";
// import { BiGitRepoForked } from "react-icons/bi";
// import { BsEye } from "react-icons/bs";
import {
  StarIcon,
  EyeOpenIcon,
  CommitIcon,
  CodeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { BiGitRepoForked } from "@radix-ui/react-icons/bi";
import { BsEye } from "@radix-ui/react-icons/bs";
import { RepoItem } from "@/types/repos";
import classes from "../styles.module.scss";
import { Link } from "react-router-dom";

type CardProps = {
  item: RepoItem;
};

export const RepoCard: FC<CardProps> = ({ item }) => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };
  return (
    <div
      className={classes.repoCard}
      onClick={() => openInNewTab(item.html_url)}
    >
      <article className={classes.card}>
        <p className={classes.description}>{item.description}</p>
        <div className={classes.cardHeader}>
          <h3 className={classes.name}>{item.name}</h3>
          <div>
            <button className={classes.iconButton}>
              <StarIcon />
            </button>
            <div className={classes.StarsCount}>{item.stargazers_count}</div>
          </div>
        </div>
        <div className={classes.cardFooter}>
          <div className={classes.cardMeta}>
            <EyeOpenIcon />
            {item.watchers_count}
          </div>
          <div className={classes.cardMeta}>
            <CommitIcon />
            {item.forks_count}
          </div>
          <div className={classes.cardMeta}>
            <CodeIcon />
            {item.language}
          </div>
          <div className={classes.cardMeta}>
            <PersonIcon />
            {item.owner.login}
          </div>
        </div>
      </article>
    </div>
  );
};
