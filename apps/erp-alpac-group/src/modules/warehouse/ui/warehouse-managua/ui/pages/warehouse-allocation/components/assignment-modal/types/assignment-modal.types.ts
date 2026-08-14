import type { PendingAssignmentItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";
import type { GetAvailableWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-available-warehouses";
import type { GetWarehouseMachineriesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-machineries";
import type { GetWarehouseStaffsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-staffs";
import type { CreateWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-warehouse-assignment";
import type { CreateUnloadingDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-details";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-machinery";
import type { CompleteWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/complete-warehouse-assignment";

export type AssignmentModalStep = 1 | 2 | 3 | 4;

export type AssignmentModalProps = {
  isOpen: boolean;
  item: PendingAssignmentItem | null;
  companyId: string;
  moduleCode: string;
  step: AssignmentModalStep;
  warehouses: GetAvailableWarehousesResponse;
  machineries: GetWarehouseMachineriesResponse;
  staffs: GetWarehouseStaffsResponse;
  isLoadingWarehouses?: boolean;
  isCreating?: boolean;
  isCompleting?: boolean;
  onStepChange: (step: AssignmentModalStep) => void;
  onRequestPositions: (payload: {
    rack_id?: string;
    lot_id?: string;
  }) => void;
  onCreateAssignment: (
    payload: CreateWarehouseAssignmentRequest,
  ) => void;
  onCreateUnloadingDetails: (
    payload: CreateUnloadingDetailsRequest,
  ) => void;
  onCreateUnloadingCrew: (payload: CreateUnloadingCrewRequest) => void;
  onCreateUnloadingMachinery: (
    payload: CreateUnloadingMachineryRequest,
  ) => void;
  onCompleteAssignment: (
    payload: CompleteWarehouseAssignmentRequest,
  ) => void;
  onClose: () => void;
};