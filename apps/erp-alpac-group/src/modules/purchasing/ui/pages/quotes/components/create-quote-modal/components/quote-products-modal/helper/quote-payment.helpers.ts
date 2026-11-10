import { PaymentMethodEnum } from "@app/core/enums/payment-method.enum";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { SupplierPaymentMethod } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

const paymentMethodEntries = Object.values(PaymentMethodEnum);

export const normalizePaymentMethodType = (
	raw: unknown,
): PaymentMethodType | undefined => {
	if (raw == null || raw === "") return undefined;

	if (typeof raw === "number") {
		return paymentMethodEntries.find((e) => e.value === raw)?.stringValue;
	}

	if (typeof raw === "string") {
		const byString = paymentMethodEntries.find(
			(e) =>
				e.stringValue === raw ||
				e.stringValue.toLowerCase() === raw.toLowerCase(),
		);
		if (byString) return byString.stringValue;

		const asNumber = Number(raw);
		if (!Number.isNaN(asNumber)) {
			return paymentMethodEntries.find((e) => e.value === asNumber)?.stringValue;
		}
	}

	return undefined;
};

export const resolvePaymentMethodLabel = (
	method?: PaymentMethodType | number | null,
): string => {
	if (method == null) return "—";
	const normalized = normalizePaymentMethodType(method);
	if (!normalized) return String(method);
	const entry = paymentMethodEntries.find((e) => e.stringValue === normalized);
	return entry?.label ?? normalized;
};

const getMethodValue = (
	method?: SupplierPaymentMethod | Record<string, unknown>,
): PaymentMethodType | undefined => {
	if (!method) return undefined;
	const raw = method as Record<string, unknown>;
	return normalizePaymentMethodType(
		raw.payment_method_type ??
			raw.payment_method ??
			raw.paymentmethodtype ??
			raw.paymentMethodType ??
			raw.PaymentMethodType,
	);
};

const isPaymentMethodActive = (
	method?: SupplierPaymentMethod | Record<string, unknown>,
): boolean => {
	if (!method) return false;
	const raw = method as Record<string, unknown>;
	if (raw.is_active === false || raw.isActive === false) return false;
	return true;
};

export const normalizePaymentMethods = (
	methods?: unknown,
): SupplierPaymentMethod[] => {
	if (!Array.isArray(methods)) return [];

	return methods
		.map((item): SupplierPaymentMethod | null => {
			const raw = (item ?? {}) as Record<string, unknown>;
			const payment_method_type = getMethodValue(raw);
			if (!payment_method_type) return null;

			const normalized: SupplierPaymentMethod = {
				is_active: isPaymentMethodActive(raw),
				payment_method_type,
			};

			if (typeof raw.notes === "string") {
				normalized.notes = raw.notes;
			}

			return normalized;
		})
		.filter((item): item is SupplierPaymentMethod => item != null);
};

export const getActivePaymentMethods = (methods?: SupplierPaymentMethod[]) =>
	normalizePaymentMethods(methods).filter(
		(m) => m.is_active !== false && m.payment_method_type != null,
	);

export const buildPaymentMethodOptions = (methods: SupplierPaymentMethod[]) =>
	getActivePaymentMethods(methods).map((m) => ({
		value: m.payment_method_type!,
		label: resolvePaymentMethodLabel(m.payment_method_type),
	}));
