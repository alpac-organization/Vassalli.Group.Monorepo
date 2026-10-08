import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { SupplierType } from "@app/core/enums/supplier-type.enum";
import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import type { CreateSupplierProductPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateSupplierRequest extends BaseRequest {
   supplier_id: string;
   suppliers_legal_name?: string;
   commercial_name?: string | null;
   identification_number?: string | null;
   constitution_type?: number | string;
   identification_type?: number | string | null;
   supplier_type?: SupplierType;
   payment_methods?: PaymentMethodType[];
   supplier_details?: Partial<SupplierDetailsInformation>;
   products?: CreateSupplierProductPayload[];
}
