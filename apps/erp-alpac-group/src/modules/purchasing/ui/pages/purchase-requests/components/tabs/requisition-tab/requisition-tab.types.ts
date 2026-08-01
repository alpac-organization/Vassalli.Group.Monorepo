export interface RequisitionTabProps {
   currentBranchId: string;   
   onRequestError: (message?: string) => void;
   onRequestSuccess: (message: string) => void;
}