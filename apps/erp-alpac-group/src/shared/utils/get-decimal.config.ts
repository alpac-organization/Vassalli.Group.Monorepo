import {
	formatAmount,
	validateDecimalNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";

export const parseDecimal = (value: unknown): number | undefined => {
	const trimmed = String(value ?? "").trim();
	if (!trimmed) return undefined;
	const parsed = parseFloat(trimmed.replace(/,/g, ""));
	return Number.isNaN(parsed) ? undefined : parsed;
};

export const getDecimalFieldConfig = (requiredMessage: string, allowZero: boolean = false) => ({

	required: requiredMessage,

	validate: {
		validateDecimal: (value: unknown) => !value || validateDecimalNumber(value as number),
		validatePositive: (value: unknown) => !value || validatePositiveNumber(value as number, allowZero),
	},

	setValueAs: parseDecimal,

	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => evt.target.value = formatAmount(evt.target.value, 10, 2)
});
