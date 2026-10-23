import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { ReasonsInventoryRemovalRequest } from "../../domain/api-contract/requests/reasons-inventory-removal.request";
import type { ReasonsInventoryRemovalResponse } from "../../domain/api-contract/responses/reasons-inventory-removal.reponse";
import type { IReasonsInventoryRemovalServices } from "../../application/interfaces/services/IReasons-inventory-removal-services";

export class ReasonsInventoryRemovalServices implements IReasonsInventoryRemovalServices {
	private readonly httpClient: IHttpHandler;
	
	constructor(httpClient: IHttpHandler) {
		this.httpClient = httpClient;
	}

	// All services here
	async GetReasonsInventoryRemoval(payload: ReasonsInventoryRemovalRequest): Promise<PaginateBaseResponse<ReasonsInventoryRemovalResponse>> {
		try{
			const { company_id, module_code, ...rest } = payload;
	
			return this.httpClient.get<PaginateBaseResponse<ReasonsInventoryRemovalResponse>>(`/companies/${company_id}/modules/${module_code}/inventory/reasons-removals`, {
				params: cleanParams(rest),
			});
		}
		catch(error: unknown)
		{
			throw error;
		}
	}

}