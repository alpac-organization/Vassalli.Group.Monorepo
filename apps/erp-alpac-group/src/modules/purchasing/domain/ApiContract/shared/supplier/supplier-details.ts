export interface SupplierDetailsInformation {
	address?: string | null;
	email_support?: string | null;
	contact_name?: string | null;
	contact_email?: string | null;
	contact_phone_number?: string | null;
	credit_days: number;
	has_credit: boolean;
	is_exclusive?: boolean;
	exclusive_brands_or_parts?: string | null;
	credit_limit?: number | null;
	credit_currency?: string | null;
	alert_days_before_due?: number;
	preferred_payment_method?: string | number | null;
	apply_ir_retention?: boolean;
	apply_municipal_retention?: boolean;
	is_tax_exempt?: boolean;
}