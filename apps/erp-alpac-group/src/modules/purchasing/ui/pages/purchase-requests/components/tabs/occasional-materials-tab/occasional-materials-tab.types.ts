export interface OccasionalMaterialTabProps {
   currentBranchId: string;   
   onRequestError: (message?: string | undefined) => void;
   onRequestSuccess: (message: string) => void;
}