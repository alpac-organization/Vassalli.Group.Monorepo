import type { PurchaseRequestMainPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { GetMonthlyPurchaseReportPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-monthly-purchase-report-payload";
import type { GetPurchaseOrderDetailsPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-details-payload";
import type { PurchaseOrderDocumentRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-request";
import type { GetPurchaseOrdersPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-orders-payload";
import type { GetPurchaseRequestDetailPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-details-payload";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { GetPurchaseRequestProductPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-product-payload";
import type { GetPurchaseRequestDocumentRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-document-request";
import type { ProcessPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/process-purchase-request-payload";
import type { SendPurchaseRequestToReviewPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/send-purchase-request-review-payload";
import type { UpdatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/update-purchase-request-payload";
import type { AnnulPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/annul-purchase-request-payload";
import type { GetMonthlyPurchaseReportResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseOrderDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-document-response";
import type { PurchaseRequestDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-document-response";
import type { GetPurchaseOrdersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import type {
	GetPurchaseRequestDetailResponse,
	PurchaseRequestProductInformationList,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetPurchaseRequestResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type {
	GetPurchaseOrderReportPayload,
	GetTransferRequestReportPayload,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-report-payload";
import type { PurchaseOrderTemplateDto } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-report-response";

export interface IPurchaseServices {
	GetPurchaseRequests(
		payload: GetPurchaseRequestPayload,
	): Promise<GetPurchaseRequestResponseList>;

	GetPurchaseRequestDetails(
		payload: GetPurchaseRequestDetailPayload,
	): Promise<GetPurchaseRequestDetailResponse>;

	GetPurchaseRequestProducts(
		payload: GetPurchaseRequestProductPayload,
	): Promise<PurchaseRequestProductInformationList>;

	GetMonthlyPurchaseReport(
		payload: GetMonthlyPurchaseReportPayload,
	): Promise<GetMonthlyPurchaseReportResponse>;

	CreatePurchaseRequest(payload: PurchaseRequestMainPayload): Promise<void>;

	UpdatePurchaseRequest(payload: UpdatePurchaseRequestPayload): Promise<void>;

	ProcesssPurchaseRequest(
		payload: ProcessPurchaseRequestPayload,
	): Promise<void>;

	DeletePurchaseRequest(payload: DeletePurchaseRequestPayload): Promise<void>;

	SendPurchaseRequestToReview(
		payload: SendPurchaseRequestToReviewPayload,
	): Promise<void>;

	GetPurchaseRequestDocument(
		params: GetPurchaseRequestDocumentRequest,
	): Promise<PurchaseRequestDocumentResponse>;

	GetPurchaseOrders(
		payload: GetPurchaseOrdersPayload,
	): Promise<GetPurchaseOrdersResponseList>;

	GetPurchaseOrderDetails(
		payload: GetPurchaseOrderDetailsPayload,
	): Promise<GetPurchaseOrderDetailsResponse>;

	GetPurchaseOrderDocument(
		payload: PurchaseOrderDocumentRequest,
	): Promise<PurchaseOrderDocumentResponse>;

	GetPurchaseOrderReport(
		payload: GetPurchaseOrderReportPayload,
	): Promise<PurchaseOrderTemplateDto>;

	GetTransferRequestReport(
		payload: GetTransferRequestReportPayload,
	): Promise<PurchaseOrderTemplateDto>;

	AnnulPurchaseRequest(payload: AnnulPurchaseRequestPayload): Promise<void>;
}
