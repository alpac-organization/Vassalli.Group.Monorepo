import { Fragment } from "react"
import type { ButtonProps } from "./ButtonProps"
import { getButtonStyles } from "./Button.styles"

export const Button = function ({
    label,
    type,
    variant,
    onClick,
}: ButtonProps) {

    const styles = getButtonStyles(variant)
    return (
        <Fragment>
            <button type={type} style={styles} onClick={onClick}>
                {label}
            </button>
        </Fragment>
    )
}