export interface Allowance {
   type_income_id: string;
   income_amount: number;
}

export interface Allowances {
   allowances: Allowance[];
}

export interface AddAllowanceFormProps {
   onSuccess: (data: Allowances) => void;
}