import { forwardRef } from "react";
import type { TextFieldProps } from "./text-field.type"
import { getTextFieldStyles } from "./text-field.styles";

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(props, ref) {

    const {
        name,
        type = "text",
        placeholder = "Enter your placeholder here!",
        disabled = false,
        styles,
        size,
        company,
        isDynamic,
        ...rest
    } = props

    const classes = getTextFieldStyles(props);

    return (
        <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={classes}
            style={styles}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            {...rest}
        />
    )
})