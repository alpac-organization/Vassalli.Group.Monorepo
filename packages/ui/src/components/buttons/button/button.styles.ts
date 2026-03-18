import { spacings } from "../../../constants/spacing";
import { companyTokens, neutralTokens } from "../../../constants";
import type { ButtonProps, ButtonSize, Company } from "./button.type";
import type { CSSProperties } from "react";
import { Padding } from "../../../interfaces/sizes";

const paddingProperties: Record<ButtonSize, Pick<Padding, "paddingVertical" | "paddingHorizontal">> = {
    giant: {
        paddingHorizontal: spacings.md,
        paddingVertical: spacings.lg
    },
    medium: {
        paddingHorizontal: spacings.xs,
        paddingVertical: spacings.md
    },
    small: {
        paddingHorizontal: spacings.xs,
        paddingVertical: spacings.sm
    }
}

const backgroundProperties: Record<Company, string> = {
    ALPAC: companyTokens.ALPAC.primary.base500,
    AMINSA: companyTokens.AMINSA.primary.base500,
    AVASA: companyTokens.AVASA.primary.base500,
    VIGEMSA: companyTokens.VIGEMSA.primary.base500,
    TMN: companyTokens.TMN.primary.base500
}

export const getButtonStyles = (props: ButtonProps): CSSProperties => {

    const sizeProperty = paddingProperties[props.size || "giant"]
    const backgroundProperty = backgroundProperties[props.company || "ALPAC"]

    return {
        border: "none",
        outline: "none",
        borderRadius: "6px",
        fontSize: "100%",

        paddingTop: sizeProperty.paddingHorizontal,
        paddingBottom: sizeProperty.paddingHorizontal,
        paddingLeft: sizeProperty.paddingVertical,
        paddingRight: sizeProperty.paddingVertical,

        width: props.isDynamic ? "100%" : "150px",

        backgroundColor: props.disabled ? neutralTokens.base100 : backgroundProperty,
        cursor: props.disabled ? "not-allowed" : "pointer",

        color: neutralTokens.base100,
    };
};