export type InputGroupProps = {
    label?: string;
    name?: string;
    placeholder?: string,
    type?: React.HTMLInputTypeAttribute,
    disabled?: boolean,
    error?: string,
    isDynamic?: boolean,
    value?: string,
    className?: string,
    ref?: React.Ref<HTMLInputElement>
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
};
