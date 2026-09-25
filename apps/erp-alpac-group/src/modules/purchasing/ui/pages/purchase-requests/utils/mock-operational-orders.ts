import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";
import { ServiceOrderStatusEnum } from "@app/modules/service-order/domain/enums/service-order-status.enum";

export interface OperationalOrder {
	id: string;
	code: string;
	clientCode: string;
}

export const mockOperationalOrders: OperationalOrder[] = [
	{ id: "op-001", code: "OP-2026-001", clientCode: "CLI-001" },
	{ id: "op-002", code: "OP-2026-002", clientCode: "CLI-002" },
	{ id: "op-003", code: "OP-2026-003", clientCode: "CLI-003" },
	{ id: "op-004", code: "OP-2026-004", clientCode: "CLI-004" },
];

export const mockServiceOrdersByOp: Record<string, GetServiceOrdersResponse[]> = {
	"op-001": [
		{
			service_order_id: "os-001-1",
			code: "OS-2026-001-A",
			status: ServiceOrderStatusEnum.Pending.textValue,
			observations: "Mantenimiento preventivo",
			customer: {
				customer_id: "cus-001",
				cif: "J0310000000001",
				legal_name: "Cliente Uno S.A.",
				picture_url: null,
				identification_number: "ID-001",
				identification_type: 1,
			},
		},
		{
			service_order_id: "os-001-2",
			code: "OS-2026-001-B",
			status: ServiceOrderStatusEnum.Pending.textValue,
			observations: "Reparación de equipo",
			customer: {
				customer_id: "cus-001",
				cif: "J0310000000001",
				legal_name: "Cliente Uno S.A.",
				picture_url: null,
				identification_number: "ID-001",
				identification_type: 1,
			},
		},
	],
	"op-002": [
		{
			service_order_id: "os-002-1",
			code: "OS-2026-002-A",
			status: ServiceOrderStatusEnum.Pending.textValue,
			observations: "Instalación nueva",
			customer: {
				customer_id: "cus-002",
				cif: "J0310000000002",
				legal_name: "Cliente Dos Ltda.",
				picture_url: null,
				identification_number: "ID-002",
				identification_type: 1,
			},
		},
	],
	"op-003": [
		{
			service_order_id: "os-003-1",
			code: "OS-2026-003-A",
			status: ServiceOrderStatusEnum.Pending.textValue,
			observations: "Soporte técnico",
			customer: {
				customer_id: "cus-003",
				cif: "J0310000000003",
				legal_name: "Cliente Tres y Cia.",
				picture_url: null,
				identification_number: "ID-003",
				identification_type: 1,
			},
		},
	],
	"op-004": [],
};