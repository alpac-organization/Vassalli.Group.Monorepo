import type { ButtonProps, ButtonSize } from "./button.type";
import type { Company } from "../../../types/company";

const backgroundProperties: Record<Company, string> = {
    ALPAC: `bg-alpac-primary-500! dark:bg-alpac-primary-700!`,
    AMINSA: `bg-aminsa-primary-500! dark:bg-aminsa-primary-900!`,
    AVASA: `bg-avasa-primary-500! dark:bg-avasa-primary-700!`,
    VIGEMSA: `bg-vigemsa-primary-500! dark:bg-vigemsa-primary-700!`,
    TMN: `bg-tmn-primary-500! dark:bg-tmn-primary-700!`,
}

const sizes: Record<ButtonSize, string> = {
    giant: "px-8! py-3.5! text-lg! leading-7! rounded-xl!",
    medium: "px-6! py-[0.5rem]! text-base! leading-6! rounded-lg!",
    small: "px-4! py-[0.625rem]! text-sm! leading-5! rounded-md!",
}

export const getButtonStyles = (props: ButtonProps): string => {
    const sizeClasses = sizes[props.size || "small"];
    const backgroundClasses = backgroundProperties[props.company || "ALPAC"];

    const baseClasses = `
        rounded-md 
        text-white 
        font-normal 
        text-[14px]! 
        shadow-sm
        transition-all 
        active:scale-95
    `.trim();

    const widthClasses = props.isDynamic ? "w-full" : "w-auto";
    const disabledClasses = props.disabled ? "opacity-20 cursor-not-allowed pointer-events-none" : "";
    return `${baseClasses} ${backgroundClasses} ${sizeClasses} ${widthClasses} ${disabledClasses}`;
};