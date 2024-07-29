import { FC } from "react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
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
          <img src={item.avatar_url} alt="user avatar" />
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
