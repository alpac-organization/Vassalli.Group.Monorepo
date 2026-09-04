import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { PagedResponse } from "@app/core/interfaces/PagedResponse";
import type { PendingAssignment } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-pending-assignments.response";
import type { PendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-pending-assignments.request";
import type { GetAssignmentDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-assignment-details.request";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-assignment-details.response";
import type { StartUnloadingRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/start-unloading-process.request";
import type { IMerchandiseUnloadingServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/merchandise-unloading/IMerchandiseUnloadingServices";

export class MerchandiseUnloadingServices implements IMerchandiseUnloadingServices {

    private readonly apiHandler: IHttpHandler;

    constructor(httpHandler: IHttpHandler) {
        this.apiHandler = httpHandler;
    }

    public async GetPendingAssignmentsAsync(payload: PendingAssignmentsRequest): Promise<PagedResponse<PendingAssignment>> {
        const { company_id, module_code, ...rest } = payload;

        return await this.apiHandler.get<PagedResponse<PendingAssignment>>(
            `companies/${company_id}/modules/${module_code}/unloading/assignment-queue`,
            { params: cleanParams(rest) },
        );
    }

    public async GetUnloadingAssignmentDetails(payload: GetAssignmentDetailsRequest): Promise<GetAssignmentDetailsResponse> {
        const { company_id, module_code, assignment_id } = payload;        
        return await this.apiHandler.get<GetAssignmentDetailsResponse>(
            `companies/${company_id}/modules/${module_code}/unloading/assignment-queue/${assignment_id}`,
        );
    }

    public async StartUnloading(payload: StartUnloadingRequest): Promise<void> {
        const { company_id, module_code, assignment_id, ...rest } = payload;

        await this.apiHandler.post(
            `companies/${company_id}/modules/${module_code}/unloading/assignment-queue/${assignment_id}/start`,
            rest,
        );
    }
}
