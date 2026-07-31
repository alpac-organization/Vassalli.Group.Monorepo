import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/suppliers/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/suppliers/get-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/suppliers/create-supplier-response";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/suppliers/get-suppliers-response";

export interface ISupplierServices {

  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;

  CreateSupplier(payload: CreateSupplierRequest): Promise<CreateSupplierResponse>;

  UpdateSupplier(payload: any): Promise<void>;
}
