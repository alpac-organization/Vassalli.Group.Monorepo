export interface AlertProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: (evt?: React.MouseEvent<HTMLButtonElement>) => void;
}
