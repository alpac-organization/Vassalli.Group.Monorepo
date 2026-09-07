import type { GetPendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { CreateWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-warehouse-assignment";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/create-unloading-machinery";
import type { CompleteAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/complete-assignment";
import type { GetAssignmentDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { GetAssignmentsHistoryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignments-history";
import type { GetPendingAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { WarehouseAssignmentDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { GetMachineryCatalogsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-machinery-catalogs";

export interface IWarehouseAssignmentServices {
  /** PASO 1 — GET /warehouse-assignments/pending */
  getPendingAssignments(
    payload: GetPendingAssignmentsRequest,
  ): Promise<GetPendingAssignmentsResponse>;

  /** PASO 3 — POST /receptions/{reception_id}/warehouse-assignment */
  createWarehouseAssignment(
    payload: CreateWarehouseAssignmentRequest,
  ): Promise<boolean>;

  /** PASO 4 — POST /receptions/{reception_id}/unloading-crew */
  createUnloadingCrew(payload: CreateUnloadingCrewRequest): Promise<boolean>;

  /** PASO 5 — POST /receptions/{reception_id}/unloading-machinery */
  createUnloadingMachinery(
    payload: CreateUnloadingMachineryRequest,
  ): Promise<boolean>;

  /** PASO 6 — POST /receptions/{reception_id}/complete-assignment */
  completeAssignment(payload: CompleteAssignmentRequest): Promise<boolean>;

  /** PASO 7 — GET /warehouse-assignments/{reception_id} */
  getAssignmentDetail(
    payload: GetAssignmentDetailRequest,
  ): Promise<WarehouseAssignmentDetailResponse>;

  /** PASO 8 — GET /warehouse-assignments */
  getAssignmentsHistory(
    payload: GetAssignmentsHistoryRequest,
  ): Promise<GetPendingAssignmentsResponse>;

  /** PASO 2B — GET /machinery-catalogs */
  getMachineryCatalogs(payload: {
    company_id: string;
    module_code: string;
  }): Promise<GetMachineryCatalogsResponse>;
}

