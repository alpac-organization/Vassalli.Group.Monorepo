import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export interface ISupplierServices {

  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;

  CreateSupplier(payload: CreateSupplierRequest): Promise<CreateSupplierResponse>;

  UpdateSupplier(payload: any): Promise<void>;
}
