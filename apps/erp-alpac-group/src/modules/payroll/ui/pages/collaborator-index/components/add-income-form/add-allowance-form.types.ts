export interface AddAllowanceFormProps {
   identificationNumber: string;
   onSuccess?: (message?: string) => void;
   onError?: (message?: string) => void;
}