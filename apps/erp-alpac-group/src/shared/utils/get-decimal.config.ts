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

const isValueEmpty = (value: unknown): boolean =>
  value === undefined || value === null || value === "" || Number.isNaN(value);

export const getDecimalFieldConfig = (requiredMessage: string, allowZero: boolean = false) => ({

	required: requiredMessage,

	validate: {
		validatePositive: (value: unknown) => isValueEmpty(value) || validatePositiveNumber(value as number, allowZero),
		validateDecimal: (value: unknown) => isValueEmpty(value) || validateDecimalNumber(value as number),
	},

	setValueAs: parseDecimal,

	onChange: (evt: React.ChangeEvent<HTMLInputElement>) => evt.target.value = formatAmount(evt.target.value, 10, 2)
});
