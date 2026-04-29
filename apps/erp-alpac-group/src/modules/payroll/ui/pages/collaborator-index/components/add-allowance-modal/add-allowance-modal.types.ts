import type { Allowance } from "../add-income-form/add-allowance-form.types";

export type AddAllowanceModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSubmit?: (data: Allowance[]) => void;
};