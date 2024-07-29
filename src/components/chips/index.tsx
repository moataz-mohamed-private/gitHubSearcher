import { FC } from "react";
import classes from "./styles.module.scss";

export type ChipsProps = {
  placeholder?: string;
  options: string[];
  onClick: (value: string) => void;
};

const Chips: FC<ChipsProps> = ({ options, onClick, placeholder }) => {
  return (
    <div>
      <small>{placeholder}</small>
      <div className={classes.chipContainer}>
        {options.map((option) => (
          <button
            onClick={() => onClick(option)}
            className={classes.chip}
            type="button"
            key={option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chips;
