import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/suppliers/requests/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/suppliers/requests/get-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/suppliers/responses/create-supplier-response";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/suppliers/responses/get-suppliers-response";

export interface ISupplierServices {

  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;

  CreateSupplier(payload: CreateSupplierRequest): Promise<CreateSupplierResponse>;

  UpdateSupplier(payload: any): Promise<void>;
}
