import { colors } from "@alpac/theme/color";
import type { ButtonVariant } from "./ButtonProps";
import type { CSSProperties } from "react";

export const getButtonStyles = (variant: ButtonVariant = "primary"): CSSProperties => {
    const variants = {
        primary: colors.primary,
        secondary: colors.secondary,
        danger: colors.danger,
    };

    return {
        backgroundColor: variants[variant],
        color: colors.white,
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
    };
};