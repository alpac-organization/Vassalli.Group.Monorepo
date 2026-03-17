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
        onChange,
        onBlur
    } = props;

    const styles = getInputGroupStyles()
    const labelStyles = getLabelStyles()
    const errorStyles = getErrorStyles()

    return (
        <div style={styles}>
            <label htmlFor={name} style={labelStyles}>{label}</label>
            <TextField
                name={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <span style={errorStyles}>{error}</span>}
        </div>
    );
}) 
