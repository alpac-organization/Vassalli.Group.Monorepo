import type { InputTextType } from "../InputText/InputTextProps";

export type InputFieldProps = {
    label: string;
    name: string;
    placeholder: string,
    type: InputTextType,
    error?: string;
};
