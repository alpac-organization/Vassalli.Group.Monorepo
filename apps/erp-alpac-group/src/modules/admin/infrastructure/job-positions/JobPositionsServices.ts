import type { IJobPositions } from "@app/modules/admin/applications/interfaces/IJobPositions";
import type { IHttpHandler } from "@app/core/ports";
import type { GetJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/get-job-positions";
import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";
import type { CreateJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/create-job-positions";
import type { DeleteJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/delete-job-positions";
export class JobPositionServices implements IJobPositions {
  private apiHandler: IHttpHandler;
  public constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }
  public async registerJobPosition(
    payload: CreateJobPositionsRequest,
  ): Promise<void> {
    try {
      const { company_id, job_position_name, description } = payload;
      const body = {
        job_position_name,
        ...(description?.trim() ? { description: description.trim() } : {}),
      };
      await this.apiHandler.post<void>(
        `/companies/${company_id}/job-positions`,
        body,
      );
    } catch (error) {
      throw error;
    }
  }
  public async deleteJobPosition(
    payload: DeleteJobPositionsRequest,
  ): Promise<void> {
    try {
      const { company_id, job_position_id } = payload;
      await this.apiHandler.delete<void>(
        `/companies/${company_id}/job-positions/${job_position_id}`,
      );
    } catch (error) {
      throw error;
    }
  }
  public async getJobPositions(
    payload: GetJobPositionsRequest,
  ): Promise<GetJobPositionsResponse[] | undefined> {
    try {
      const { company_id } = payload;
      const jobPositions = await this.apiHandler.get<GetJobPositionsResponse[]>(
        `/companies/${company_id}/job-positions`,
      );
      return jobPositions;
    } catch (error) {
      throw error;
    }
  }
}
