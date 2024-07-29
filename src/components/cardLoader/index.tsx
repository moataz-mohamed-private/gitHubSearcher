import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import classes from "./styles.module.scss";

export const CardLoader: React.FC<{
  count: number;
  width: string;
  height: string;
}> = ({ count, width, height }) => {
  return (
    <Skeleton
      style={{
        height,
        width,
        borderRadius: "10px",
        backgroundColor: "#ccc",
        color: "#000",
        fontSize: "16px",
        padding: "10px",
        margin: "10px",
      }}
      containerClassName={classes.cardLoader}
      count={count}
    />
  );
};
