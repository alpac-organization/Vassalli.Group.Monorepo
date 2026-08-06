export const isValidateValue = (value?: string | number | null): boolean =>
	value !== undefined && value !== null && Number(value) !== 0;
