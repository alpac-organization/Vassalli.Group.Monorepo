import { Fragment, type CSSProperties } from "react"
import type { InputTextProps } from "./InputTextProps"

export const InputText = function ({
    id,
    type,
    ...props
}: InputTextProps) {

    const styles: CSSProperties = {
        outline: "none",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    };

    return (
        <Fragment>
            <input id={id} type={type} style={styles} {...props} />
        </Fragment>
    )
}