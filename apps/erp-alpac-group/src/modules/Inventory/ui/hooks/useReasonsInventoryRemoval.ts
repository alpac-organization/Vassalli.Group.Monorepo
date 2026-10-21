import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { ReasonsInventoryRemovalServices } from "../../infrastructure/services/reasons-inventory-removal-services";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { useReasonsInventoryRemovalProps } from "../../application/interfaces/hooks/useReasonsInventoryRemovalProps";
import type { ReasonsInventoryRemovalResponse } from "../../domain/api-contract/responses/reasons-inventory-removal.reponse";

const reasonsInventoryRemovalServices = new ReasonsInventoryRemovalServices(warehouseHttpHandler);

export const useReasonsInventoryRemoval = function(props: useReasonsInventoryRemovalProps) {

	const { 
		payloadGetReasonsInventoryRemovalRequest
	} = props;

	//#region Obtener listado de conceptos de salidas de inventario

	const GetReasonsInventoryRemovalQuery = useQuery<PaginateBaseResponse<ReasonsInventoryRemovalResponse>, ApiErrorResponse>({
		queryKey: ["reasons-inventory-removal", payloadGetReasonsInventoryRemovalRequest],
		queryFn: () => reasonsInventoryRemovalServices.GetReasonsInventoryRemoval(payloadGetReasonsInventoryRemovalRequest),
		enabled: Boolean(payloadGetReasonsInventoryRemovalRequest),

		retry: 1,
		staleTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});

	//#endregion 

	return {
		GetReasonsInventoryRemovalQuery
	}
}