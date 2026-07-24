import type { IHttpHandler } from "@app/core/ports";
import type { IAccessControl } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/access-control/IAccessControl";
import type { CreateAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { GetAccessControlResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export class AccessControlServices implements IAccessControl {
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
        date,
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
            date,
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
  public async createAccessControl(
    payload: CreateAccessControlRequest,
  ): Promise<void> {
    try {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/reception-entrances`;
      const response = await this.httpHandler.post<void>(url, rest);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
