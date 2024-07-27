import { FC } from "react";
import classes from "./styles.module.scss";

export type chipsProps = {
  options: string[];
  onClick: (value: string) => void;
};

const Chips: FC<chipsProps> = ({ options, onClick }) => {
  return (
    <div className={classes.chipContainer}>
      {options.map((option) => (
        <button
          onClick={() => onClick(option)}
          className={classes.chip}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Chips;
