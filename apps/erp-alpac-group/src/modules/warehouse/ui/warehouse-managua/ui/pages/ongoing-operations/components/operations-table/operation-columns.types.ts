import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";

export interface GetOperationsColumnsProps {
   onViewDetail: (order: OperationalOrderListItem) => void;
   onUpdateInfo: (order: OperationalOrderListItem) => void;
}