export type AlertType = "success" | "error" | "warning" | "info";

export type AlertProps = {
    title?: string;
    message: string;
    type: AlertType;
    icon?: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    onClose?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}