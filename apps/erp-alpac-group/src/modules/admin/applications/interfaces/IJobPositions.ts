import type { CreateJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/create-job-positions";
import type { DeleteJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/delete-job-positions";
import type { GetJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/get-job-positions";
import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";
export interface IJobPositions {
  registerJobPosition(payload: CreateJobPositionsRequest): Promise<void>;
  deleteJobPosition: (payload: DeleteJobPositionsRequest) => Promise<void>;
  getJobPositions: (
    payload: GetJobPositionsRequest,
  ) => Promise<GetJobPositionsResponse[] | undefined>;
}
