import type { InputGroupProps } from "./input-group.type";
import { TextField } from "../text-field/text-field";
import { getErrorStyles, getInputGroupStyles, getLabelStyles } from "./input-group.styles";
import { forwardRef } from "react";

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(function InputGroup(props, ref) {
    const {
        name,
        label,
        type,
        placeholder,
        disabled,
        error,
        value,
        isDynamic,
        className,
        onChange,
        onBlur
    } = props;

    const inputGroupStyles = getInputGroupStyles() + " " + className
    const labelStyles = getLabelStyles()
    const errorStyles = getErrorStyles()

    return (
        <div className={inputGroupStyles}>
            <label htmlFor={name} className={labelStyles}>{label}</label>
            <TextField
                name={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                isDynamic={isDynamic}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                hasError={!!error}
            />
            {error && <span className={errorStyles}>{error}</span>}
        </div>
    );
}) 
