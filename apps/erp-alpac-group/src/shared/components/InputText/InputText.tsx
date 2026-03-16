import { Fragment, type CSSProperties } from "react"
import type { InputTextProps } from "./InputTextProps"

export const InputText = function ({
    id,
    type,
    ...props
}: InputTextProps) {

    const styles: CSSProperties = {
        font: "inherit",
        appearance: "none",
        lineHeight: "normal",
        outline: "none !important",
        border: "1px solid white",
        borderRadius: 6,
        padding: 10,
        fontSize: "100%"
    };

    return (
        <Fragment>
            <input id={id} type={type} style={styles} {...props} />
        </Fragment>
    )
}