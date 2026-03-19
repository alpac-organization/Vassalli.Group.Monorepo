import { TextFieldProps, TextFieldSize } from "./text-field.type"

const sizes: Record<TextFieldSize, string> = {
    giant: "px-5 py-3.5 text-lg leading-7 rounded-xl",
    medium: "px-4 py-2.5 text-base leading-6 rounded-lg",
    small: "px-3 py-2 text-sm leading-5 rounded-md",
}

export const getTextFieldStyles = (props: TextFieldProps): string => {

    const sizeClasses = sizes[props.size || "small"];

    const baseClasses = `
            bg-gray-50
            text-gray-900 
            border-none
            placeholder:text-gray-500 
            focus:outline-1 
            focus:-outline-offset-1
            focus:outline-indigo-600
            dark:bg-[#2e2e2e]
            dark:text-white
            dark:placeholder:text-zinc-400
            transition-all
        `.trim();

    const widthClasses = props.isDynamic ? "w-full" : "w-[300px]";
    const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800" : "";
    return `${baseClasses} ${sizeClasses} ${widthClasses} ${disabledClasses}`;
}