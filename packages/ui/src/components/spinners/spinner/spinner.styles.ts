import { SpinnerProps, SpinnerSize } from "./spinner.type";

const sizes: Record<SpinnerSize, string> = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
};

export const getSpinnerStyles = (props: SpinnerProps): string => {
    const sizeClasses = sizes[props.size as SpinnerSize || "small"];
    return `animate-spin ${sizeClasses} text-alpac-primary-700 ${props.className || ""}`.trim();
};
