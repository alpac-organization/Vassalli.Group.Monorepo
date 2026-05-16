export interface Option {
   label: string;
   value: string | number;
}

export type DropdownAppearance = "default" | "dark";

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
   isRequired?: boolean;
   valueClassName?: string;
   /** Dark panel surface (#272b34); matches dark modals. */
   appearance?: DropdownAppearance;
}