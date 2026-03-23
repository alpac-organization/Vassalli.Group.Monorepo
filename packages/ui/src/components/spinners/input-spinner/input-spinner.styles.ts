import { InputSpinnerProps, InputSpinnerSize } from "./input-spinner.type";

const sizes: Record<InputSpinnerSize, string> = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
};

export const getInputSpinnerStyles = (props: InputSpinnerProps): string => {
    const sizeClasses = sizes[props.size || "small"];
    return `animate-spin ${sizeClasses} text-alpac-primary-700 ${props.className || ""}`.trim();
};
