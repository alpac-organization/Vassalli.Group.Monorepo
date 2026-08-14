import type { GetWarehouseAssignmentDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignment-detail";
import type { GetWarehouseMachineriesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-machineries";
import type { GetWarehouseStaffsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-staffs";
import type { CreateUnloadingCrewRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-crew";
import type { CreateUnloadingMachineryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/create-unloading-machinery";
import type { CompleteWarehouseAssignmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-allocation/complete-warehouse-assignment";

export type AssignmentDetailModalProps = {
  isOpen: boolean;
  detail: GetWarehouseAssignmentDetailResponse | null;
  companyId: string;
  moduleCode: string;
  machineries: GetWarehouseMachineriesResponse;
  staffs: GetWarehouseStaffsResponse;
  isDetailLoading?: boolean;
  isCreating?: boolean;
  isCompleting?: boolean;
  onCreateUnloadingCrew: (payload: CreateUnloadingCrewRequest) => void;
  onCreateUnloadingMachinery: (
    payload: CreateUnloadingMachineryRequest,
  ) => void;
  onCompleteAssignment: (payload: CompleteWarehouseAssignmentRequest) => void;
  onClose: () => void;
};