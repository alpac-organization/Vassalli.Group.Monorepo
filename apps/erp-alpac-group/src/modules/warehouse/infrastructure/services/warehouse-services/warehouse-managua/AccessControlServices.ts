import type { IHttpHandler } from "@app/core/ports";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { GetAccessControlResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export class AccessControlServices {
  private readonly httpHandler: IHttpHandler;
  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }
  public async getAccessControl(
    payload: GetAccessControlRequest,
  ): Promise<GetAccessControlResponse> {
    try {
      const {
        company_id,
        module_code,
        driver_name,
        plate_number,
        ducat_number,
        page_number,
        page_size,
      } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/reception-entrances`;
      const response = await this.httpHandler.get<GetAccessControlResponse>(
        url,
        {
          params: {
            company_id,
            module_code,
            driver_name,
            plate_number,
            ducat_number,
            page_number,
            page_size,
          },
        },
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
