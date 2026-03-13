import { Fragment } from "react"
import type { InputTextProps } from "./InputTextProps"

export const InputText = function ({
    id,
    type,
    ...props
}: InputTextProps) {
    return (
        <Fragment>
            <input id={id} type={type} {...props} />
        </Fragment>
    )
}