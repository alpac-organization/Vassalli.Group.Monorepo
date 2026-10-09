import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { SupplierExclusiveStatus } from "@app/core/enums/supplier-exclusive-status.enum";
import type { SupplierType } from "@app/core/enums/supplier-type.enum";

export interface SupplierDetailsInformation {
  address?: string | null;
  email_support?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone_number?: string | null;
  credit_days: number;
  has_credit: boolean;
  exclusive_status?: SupplierExclusiveStatus;
  exclusive_status_comments?: string | null;
  exclusive_brands_or_parts?: string | null;
  supplier_type?: SupplierType;
  currency?: CurrencyCode | null;
  credit_limit?: number | null;
  credit_currency?: string | null;
  alert_days_before_due?: number;
  apply_ir_retention?: boolean;
  apply_municipal_retention?: boolean;
  is_tax_exempt?: boolean;
}
