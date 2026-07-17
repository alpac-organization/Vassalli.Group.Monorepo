import type { CreateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/procurement/domain/suppliers/requests/get-supplier-request";
import type { GetSuppliersResponseList } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers";

export interface ISupplierServices {

  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;

  CreateSupplier(payload: CreateSupplierRequest): Promise<void>;

  UpdateSupplier(payload: any): Promise<void>;
}
