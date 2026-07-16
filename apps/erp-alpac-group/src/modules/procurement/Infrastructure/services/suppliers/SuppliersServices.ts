import type { IHttpHandler } from "@app/core/ports";
import type { ISuppliersServices } from "@app/modules/procurement/application/interfaces/suppliers/ISuppliersServices";
import type { GetSuppliersRequest } from "@app/modules/procurement/domain/suppliers/requests/get-suppliers";
import type { GetSuppliersResponseList } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers";
import { cleanParams } from "@app/shared/utils/object.utils";

export class SuppliersServices implements ISuppliersServices {
  private readonly httpHandler: IHttpHandler;
  constructor(htttpHandler: IHttpHandler) {
    this.httpHandler = htttpHandler;
  }
  async getSuppliers(
    payload: GetSuppliersRequest,
  ): Promise<GetSuppliersResponseList> {
    try {
      const { companie_id, module_code, ...rest } = payload;
      const url = `/companies/${companie_id}/modules/${module_code}/suppliers`;
      const response = await this.httpHandler.get<GetSuppliersResponseList>(
        url,
        { params: cleanParams(rest) },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
