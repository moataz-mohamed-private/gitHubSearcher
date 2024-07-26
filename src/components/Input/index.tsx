import classes from "./styles.module.scss";

type InputProps = {
  type: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  onChange,
}) => {
  return (
    <div className={classes.input}>
      <input placeholder={placeholder} onChange={onChange} type={type} />
    </div>
  );
};
