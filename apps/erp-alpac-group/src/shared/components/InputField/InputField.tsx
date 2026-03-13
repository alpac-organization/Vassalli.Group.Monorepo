import type { InputFieldProps } from "./InputFieldProps"
import { InputText } from "../InputText/InputText";
import type { CSSProperties } from "react";

export const InputField = function ({
    label, name, type, error, ...props
}: InputFieldProps) {

    const styles: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    }

    return (
        <div style={styles}>
            <label htmlFor={name}>{label}</label>
            <InputText id={name} type={type} {...props} />
            {error && <span>{error}</span>}
        </div>
    );
}