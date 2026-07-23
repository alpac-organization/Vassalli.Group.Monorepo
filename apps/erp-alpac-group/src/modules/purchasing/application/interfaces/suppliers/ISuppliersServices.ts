import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/suppliers/requests/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/suppliers/requests/get-suppliers-request";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/suppliers/responses/get-suppliers-response";

export interface ISupplierServices {

  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;

  CreateSupplier(payload: CreateSupplierRequest): Promise<void>;

  UpdateSupplier(payload: any): Promise<void>;
}
