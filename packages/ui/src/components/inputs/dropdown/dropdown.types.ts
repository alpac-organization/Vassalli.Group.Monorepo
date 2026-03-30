export interface Option {
   label: string;
   value: string | number;
}

export interface DropdownProps {
   label?: string;
   options: Option[];
   placeholder?: string;
   error?: string;
   name?: string;
   onChange?: (value: any) => void;
   value?: any;
   className?: string;
   labelClassName?: string;
   valueClassName?: string;
}