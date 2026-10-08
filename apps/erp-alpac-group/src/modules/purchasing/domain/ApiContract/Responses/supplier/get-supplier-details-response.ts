import type { SupplierBankAccount } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import type { SupplierLinkedProduct } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import type {
  GetSuppliersResponse,
  SupplierUserInformation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export type SupplierProductsPage = {
  items: SupplierLinkedProduct[];
  page_number: number;
  page_size: number;
  total_count: number;
};

export interface GetSupplierDetailsResponse extends GetSuppliersResponse {
  supplier_details: SupplierDetailsInformation;
  bank_accounts?: SupplierBankAccount[];
  user_information: SupplierUserInformation;
  products?: SupplierProductsPage;
}
