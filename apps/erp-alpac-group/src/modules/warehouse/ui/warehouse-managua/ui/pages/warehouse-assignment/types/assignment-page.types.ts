import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";

export interface AssignmentPageFilters {
  code?: string;
  customer_cif?: string;
}

export interface SelectedOrderForAssignments {
  operationalOrderId: string;
  poCode?: string;
  order: OperationalOrderListItem;
}

export interface SelectedAssignmentForAction {
  assignment: AssignmentOperationalDto;
  operationalOrderId: string;
}
