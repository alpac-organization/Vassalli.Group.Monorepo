import type { HTMLInputTypeAttribute } from "react"
import { Company } from "../../../types/company"

export type TextFieldSize = "giant" | "medium" | "small"

export type TextFieldProps = {
    name?: string,
    type?: HTMLInputTypeAttribute,
    placeholder?: string,
    disabled?: boolean,
    styles?: React.CSSProperties,
    size?: TextFieldSize,
    value?: string,
    company?: Company,
    isDynamic?: boolean,
    ref?: React.Ref<HTMLInputElement>,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
}