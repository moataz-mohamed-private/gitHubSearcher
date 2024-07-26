import { FC } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import classes from "./styles.module.scss";
import * as Select from "@radix-ui/react-select";

export type Option = {
  label: string;
  value: string;
};

export type SelectDropdownProps = {
  placeholder?: string;
  ariaLabel?: string;
  options: Option[];
  defaultValue: string;
  onValueChange: (value: string) => void;
};

export const SelectDropdown: FC<SelectDropdownProps> = ({
  options,
  placeholder,
  ariaLabel,
  ...props
}) => {
  return (
    <Select.Root {...props}>
      <Select.Trigger className={classes.SelectTrigger} aria-label={ariaLabel}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={classes.SelectIcon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={classes.SelectContent}>
          <Select.ScrollUpButton className={classes.SelectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={classes.SelectViewport}>
            <Select.Group>
              {options?.map(({ value, label }) => {
                return (
                  <Select.Item
                    key={value}
                    value={value}
                    className={classes.SelectItem}
                  >
                    <Select.ItemText className={classes.SelectLabel}>
                      {label}
                    </Select.ItemText>
                    <Select.ItemIndicator
                      className={classes.SelectItemIndicator}
                    />
                  </Select.Item>
                );
              })}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className={classes.SelectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
