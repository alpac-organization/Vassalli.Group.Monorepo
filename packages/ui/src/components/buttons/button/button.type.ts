import type { Company } from "../../../types/company";

export type ButtonSize = "giant" | "medium" | "small";

export type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  company?: Company;
  disabled?: boolean;
  isDynamic?: boolean;
  styles?: React.CSSProperties;
  className?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
};
