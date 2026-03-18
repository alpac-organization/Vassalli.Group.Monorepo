import { forwardRef } from "react";
import type { TextFieldProps, TextFieldSize } from "./text-field.type"
import { getTextFieldStyles } from "./text-field.styles";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(props, ref) {

    const {
        name,
        type = "text",
        placeholder = "Enter your placeholder here!",
        disabled = false,
        styles,
        size,
        ...rest
    } = props

    const mergedStyles = {
        ...styles,
        ...getTextFieldStyles(props)
    }

    return (
        <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            style={mergedStyles}
            {...rest}
        />
    )
})