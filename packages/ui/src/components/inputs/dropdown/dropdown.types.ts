import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";

export interface Option {
  label: string;
  value: string | number;
}

export type MenuPositionDropdown = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
};


export type HandleDropdownKeyDownProps = {
  disabled: boolean;
  isOpen: boolean;
  activeIndex: number;
  filteredOptions: Option[];
  handleSelect: (optionValue: string | number) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setActiveIndex: Dispatch<SetStateAction<number>>;
};

export type DropdownMenuProps = {
  isOpen: boolean;
  menuPosition: MenuPositionDropdown | null;
  menuRef: RefObject<HTMLDivElement | null>;
  listRef: RefObject<HTMLUListElement | null>;
  filteredOptions: Option[];
  value?: unknown;
  activeIndex: number;
  isDarkSurface: boolean;
  menuSurface: string;
  itemBase: string;
  itemSelected: string;
  checkIconClass: string;
  onSelect: (optionValue: string | number) => void;
  renderOptionAction: (option: Option) => ReactNode;
};

export type DropdownAppearance = "default" | "dark";

export type ErrorVariant = "text" | "tooltip";

export interface DropdownProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  errorVariant?: ErrorVariant;
  name?: string;
  onChange?: (value: any) => void;
  value?: any;
  className?: string;
  labelClassName?: string;
  isRequired?: boolean;
  optional?: boolean;
  valueClassName?: string;
  appearance?: DropdownAppearance;
  disabled?: boolean;
  renderOptionAction?: (option: Option) => ReactNode;
  onEditOption?: (option: Option) => void;
}