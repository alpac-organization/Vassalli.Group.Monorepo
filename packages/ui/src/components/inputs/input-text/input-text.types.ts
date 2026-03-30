export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?:  React.ReactNode;
  isPassword?: boolean;
  labelClassName?: string;
}