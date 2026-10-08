import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { SupplierType } from "@app/core/enums/supplier-type.enum";
import type { CreateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import type { CreateSupplierProductPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateSupplierRequest extends BaseRequest {
	suppliers_legal_name: string;
	commercial_name?: string | null;
	identification_number?: string | null;
	constitution_type?: number | string;
	identification_type?: number | string;
	supplier_type: SupplierType;
	supplier_details: SupplierDetailsInformation;
	payment_methods?: PaymentMethodType[];
	bank_accounts?: CreateSupplierBankAccountPayload[];
	products?: CreateSupplierProductPayload[];
}
