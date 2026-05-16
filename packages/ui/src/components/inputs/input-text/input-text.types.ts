export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  editable?: boolean;
  isPassword?: boolean;
  isRequired?: boolean;
  missingLabel?: string;
  labelClassName?: string;
  errorVariant?: "text" | "tooltip";
}
