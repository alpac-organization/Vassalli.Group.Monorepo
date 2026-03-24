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
    giant: "px-4! md:px-8! py-2.5! md:py-2.5! text-lg! leading-7! rounded-xl!",
    medium: "px-2! md:px-6! py-1.5! md:py-1.5! text-base! leading-6! rounded-lg!",
    small: "px-1! md:px-4! py-1! md:py-1! text-sm! leading-5! rounded-md!",
}


export const getButtonStyles = (props: ButtonProps): string => {
    const sizeClasses = sizes[props.size || "small"];
    const backgroundClasses = backgroundProperties[props.company || "ALPAC"];

    const baseClasses = `
        flex
        items-center
        justify-center
        gap-2
        rounded-md 
        text-white 
        font-normal 
        text-[14px]! md:text-[16px]
        shadow-sm
        transition-all 
        active:scale-95
    `.trim();

    const widthClasses = props.isDynamic ? "w-full" : "w-auto";
    const disabledClasses = props.disabled ? "opacity-20 cursor-not-allowed pointer-events-none" : "";
    return `${baseClasses} ${backgroundClasses} ${sizeClasses} ${widthClasses} ${disabledClasses}`;
};