import type { SupplierBankAccount } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import type { SupplierLinkedProduct } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type {
  GetSuppliersResponse,
  SupplierUserInformation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export type SupplierProductsPage = PaginateBaseResponse<
  SupplierLinkedProduct[]
>;

export interface GetSupplierDetailsResponse extends GetSuppliersResponse {
  supplier_details: SupplierDetailsInformation;
  bank_accounts?: SupplierBankAccount[];
  user_information: SupplierUserInformation;
  products?: SupplierProductsPage;
}
