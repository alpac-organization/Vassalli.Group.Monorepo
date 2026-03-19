import { companyTokens } from "../../../constants";
import type { ButtonProps, ButtonSize } from "./button.type";
import type { Company } from "../../../types/company";

const backgroundProperties: Record<Company, string> = {
    ALPAC: `bg-[${companyTokens.ALPAC.primary.base500}]! dark:bg-[${companyTokens.ALPAC.primary.base700}]!`,
    AMINSA: `bg-[${companyTokens.AMINSA.primary.base500}]! dark:bg-[${companyTokens.AMINSA.primary.base900}]!`,
    AVASA: `bg-[${companyTokens.AVASA.primary.base500}]! dark:bg-[${companyTokens.AVASA.primary.base700}]!`,
    VIGEMSA: `bg-[${companyTokens.VIGEMSA.primary.base500}]! dark:bg-[${companyTokens.VIGEMSA.primary.base700}]!`,
    TMN: `bg-[${companyTokens.TMN.primary.base500}]! dark:bg-[${companyTokens.TMN.primary.base700}]!`,
}

const sizes: Record<ButtonSize, string> = {
    giant: "px-8! py-3.5! text-lg! leading-7! rounded-xl!",
    medium: "px-6! py-[0.5rem]! text-base! leading-6! rounded-lg!",
    small: "px-4! py-[0.625rem]! text-sm! leading-5! rounded-md!",
}

export const getButtonStyles = (props: ButtonProps): string => {
    const sizeClasses = sizes[props.size || "small"];
    const backgroundClasses = backgroundProperties[props.company || "ALPAC"];

    console.log(backgroundClasses);

    const baseClasses = `
        rounded-md 
        text-white 
        font-normal 
        text-[14px]! 
        shadow-sm
        transition-all 
        active:scale-95
        bg-[#004f9e]! dark:bg-[#2B3D89]!
    `.trim();

    const widthClasses = props.isDynamic ? "w-full" : "w-auto";
    const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";
    const all = `${baseClasses} ${backgroundClasses} ${sizeClasses} ${widthClasses} ${disabledClasses}`;
    return all;
};