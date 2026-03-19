import { companyTokens } from "../../../constants";
import { TextFieldProps, TextFieldSize } from "./text-field.type"

const sizes: Record<TextFieldSize, string> = {
    giant: "px-5! py-3.5! text-lg! leading-7! rounded-xl!",
    medium: "px-4! py-[0.5rem]! text-base! leading-6! rounded-lg!",
    small: "px-4! py-[0.625rem]! text-sm! leading-5! rounded-md!",
}

export const getTextFieldStyles = (props: TextFieldProps): string => {

    const sizeClasses = sizes[props.size || "small"];
    const focusClasses = `focus:outline-1 focus:-outline-offset-1 focus:outline-[${companyTokens.ALPAC.primary.base700}]!`;
    const baseClasses = `
            bg-gray-50
            text-gray-900 
            border-none
            placeholder:text-gray-500 
            dark:bg-[#2e2e2e]
            dark:text-white
            dark:placeholder:text-zinc-400
            transition-all
        `.trim();

    const widthClasses = props.isDynamic ? "w-full" : "w-[300px]";
    const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : "";

    return `${baseClasses} ${focusClasses} ${sizeClasses} ${widthClasses} ${disabledClasses}`;
}