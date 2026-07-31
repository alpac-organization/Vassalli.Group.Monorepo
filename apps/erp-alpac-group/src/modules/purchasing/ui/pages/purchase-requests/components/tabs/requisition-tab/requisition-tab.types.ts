export interface RequisitionTabProps {
   currentBranchId: string;   
   onRequestError: (message?: string | undefined) => void;
   onRequestSuccess: (message: string) => void;
}