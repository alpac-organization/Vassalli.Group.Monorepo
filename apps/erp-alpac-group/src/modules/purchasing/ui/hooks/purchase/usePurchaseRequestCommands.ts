import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PurchaseRequestMainPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { GetPurchaseRequestDocumentRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-document-request";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import type { UpdatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/update-purchase-request-payload";
import type { PurchaseRequestDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-document-response";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import {
	invalidatePurchaseRequestDetail,
	invalidatePurchaseRequestList,
	purchaseQueryKeys,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

export const usePurchaseRequestCommands = () => {
	const queryClient = useQueryClient();

	const CreatePurchaseRequest = useMutation<
		void,
		ApiErrorResponse,
		PurchaseRequestMainPayload
	>({
		mutationKey: ["create-purchase-request"],
		mutationFn: (payload) => purchaseServices.CreatePurchaseRequest(payload),
		onSuccess() {
			void invalidatePurchaseRequestList(queryClient);
		},
		retry: 1,
	});

	const UpdatePurchaseRequest = useMutation<
		void,
		ApiErrorResponse,
		UpdatePurchaseRequestPayload
	>({
		mutationKey: ["update-purchase-request"],
		mutationFn: (payload) => purchaseServices.UpdatePurchaseRequest(payload),
		onSuccess() {
			void invalidatePurchaseRequestList(queryClient);
			void invalidatePurchaseRequestDetail(queryClient);
		},
		retry: 1,
	});

	const ProcessPurchaseRequest = useMutation<
		void,
		ApiErrorResponse,
		ProcessPurchaseRequestPayload
	>({
		mutationKey: ["process-purchase-request"],
		mutationFn: (payload) =>
			purchaseServices.ProcesssPurchaseRequest(payload),
		onSuccess() {
			void invalidatePurchaseRequestList(queryClient);
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.requestDetails],
			});
		},
		retry: 1,
	});

	const GetPurchaseRequestDocument = useMutation<
		PurchaseRequestDocumentResponse,
		ApiErrorResponse,
		GetPurchaseRequestDocumentRequest
	>({
		mutationKey: ["get-purchase-request-document"],
		mutationFn: (payload) =>
			purchaseServices.GetPurchaseRequestDocument(payload),
		retry: 1,
	});

	return {
		CreatePurchaseRequest,
		UpdatePurchaseRequest,
		ProcessPurchaseRequest,
		GetPurchaseRequestDocument,
	};
};
