export type ButtonVariant =  "primary" | "secondary" | "danger";

export type ButtonProps = {
    label: string,
    type: "button" | "submit" | "reset",
    variant: ButtonVariant
    onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}