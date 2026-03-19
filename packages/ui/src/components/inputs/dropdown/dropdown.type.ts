import { Company } from "../../../types/company";

export type DropdownSize = "giant" | "medium" | "small"

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
    isDynamic?: boolean;
    company?: Company;
    className?: string;
    size?: DropdownSize;
}
