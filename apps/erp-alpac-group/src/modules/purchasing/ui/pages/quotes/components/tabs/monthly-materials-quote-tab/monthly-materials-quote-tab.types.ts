export type MonthlyMaterialsQuoteTabProps = {
	currentBranchId: string;
	onRequestError: (message?: string) => void;
	onRequestSuccess: (message: string) => void;
};