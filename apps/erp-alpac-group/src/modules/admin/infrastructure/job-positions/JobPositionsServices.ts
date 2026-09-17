import type { IHttpHandler } from "@app/core/ports";
import type { IJobPositions } from "@app/modules/admin/applications/interfaces/IJobPositions";
import type { GetJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/get-job-positions";
import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";
import type { CreateJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/create-job-positions";
import type { DeleteJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/delete-job-positions";

export class JobPositionServices implements IJobPositions {

  	private apiHandler: IHttpHandler;

	public constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	public async registerJobPosition(payload: CreateJobPositionsRequest): Promise<void> {
		try {
			const { company_id, module_code, job_position_name, description } = payload;

			const body = {
				job_position_name,
				description: description?.trim() || null,
			};

			await this.apiHandler.post<void>(`/companies/${company_id}/modules/${module_code}/job-positions`, body);
			
			//✅Registro Exitoso!
		} 
		catch (error) {
			throw error;
		}
	}

	public async deleteJobPosition(payload: DeleteJobPositionsRequest): Promise<void> {
		try {
			const { company_id, module_code, job_position_id } = payload;

			await this.apiHandler.delete<void>(`/companies/${company_id}/modules/${module_code}/job-positions/${job_position_id}`);

			//✅Eliminación exitosa!
		} 
		catch (error) {
			throw error;
		}
	}

	public async getJobPositions(payload: GetJobPositionsRequest): Promise<GetJobPositionsResponse[] | undefined> {
		try {
			const { company_id, module_code } = payload;

			const jobPositions = await this.apiHandler.get<GetJobPositionsResponse[]>(`/companies/${company_id}/modules/${module_code}/job-positions`);
			
			return jobPositions;
		} 
		catch (error) {
			throw error;
		}
	}
}
