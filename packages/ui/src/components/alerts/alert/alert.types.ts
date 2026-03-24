export type AlertProps = {
    title?: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    icon?: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    onClose?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}