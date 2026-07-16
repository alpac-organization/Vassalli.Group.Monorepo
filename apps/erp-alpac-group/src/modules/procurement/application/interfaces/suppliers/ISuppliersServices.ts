import type { GetSuppliersRequest } from "@app/modules/procurement/domain/suppliers/requests/get-suppliers";
import type { GetSuppliersResponseList } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers";
export interface ISuppliersServices {
  getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList>;
}
