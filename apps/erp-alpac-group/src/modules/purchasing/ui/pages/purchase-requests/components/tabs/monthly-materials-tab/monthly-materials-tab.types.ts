export interface MonthlyMaterialTabProps {
   currentBranchId: string;   
   onRequestError: (message?: string | undefined) => void;
   onRequestSuccess: (message: string) => void;
}