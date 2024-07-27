import classes from "./styles.module.scss";
import { FC } from "react";

type InputProps = {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: FC<InputProps> = ({
  type,
  placeholder,
  onChange,
  value,
}) => {
  return (
    <div className={classes.input}>
      <input
        placeholder={placeholder}
        onChange={onChange}
        type={type}
        value={value}
      />
    </div>
  );
};
