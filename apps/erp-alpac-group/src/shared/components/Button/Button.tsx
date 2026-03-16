import { Fragment } from "react"
import type { ButtonProps } from "./ButtonProps"
import { getButtonStyles } from "./Button.styles"

export const Button = function ({
    label,
    type,
    styles,
    variant,
    onClick,
}: ButtonProps) {

    const mergedStyles = {
        ...styles,
        ...getButtonStyles(variant)
    }

    console.log(mergedStyles)

    return (
        <Fragment>
            <button type={type} style={mergedStyles} onClick={onClick}>
                {label}
            </button>
        </Fragment>
    )
}