import type { CSSProperties } from "react"
import { TextFieldProps, TextFieldSize } from "./text-field.type"
import { Padding } from "../../../interfaces/sizes"
import { spacings } from "../../../constants"

const paddingProperties: Record<TextFieldSize, Pick<Padding, "paddingVertical" | "paddingHorizontal">> = {
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

export const getTextFieldStyles = (props: TextFieldProps): CSSProperties => {

    const sizeProperty = paddingProperties[props.size || "giant"]

    return {
        font: "inherit",
        appearance: "none",
        lineHeight: "normal",
        outline: "none !important",
        border: "1px solid white",
        borderRadius: 6,
        fontSize: "100%",
        paddingTop: sizeProperty.paddingHorizontal,
        paddingBottom: sizeProperty.paddingHorizontal,
        paddingLeft: sizeProperty.paddingVertical,
        paddingRight: sizeProperty.paddingVertical,
    }
}