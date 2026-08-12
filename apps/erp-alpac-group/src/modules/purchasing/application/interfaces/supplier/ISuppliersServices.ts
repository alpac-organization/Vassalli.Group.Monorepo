import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSupplierDetailsRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-supplier-details-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import type { GetSupplierDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-supplier-details-response";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export interface ISupplierServices {

  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;

  GetSupplierDetails(payload: GetSupplierDetailsRequest): Promise<GetSupplierDetailsResponse>;

  CreateSupplier(payload: CreateSupplierRequest): Promise<CreateSupplierResponse>;

  UpdateSupplier(payload: UpdateSupplierRequest): Promise<void>;
}