export type PurchaseRequestImageUploaderProps = {
	value: string[];
	onChange: (images: string[]) => void;
	maxFiles?: number;
	error?: string;
};
