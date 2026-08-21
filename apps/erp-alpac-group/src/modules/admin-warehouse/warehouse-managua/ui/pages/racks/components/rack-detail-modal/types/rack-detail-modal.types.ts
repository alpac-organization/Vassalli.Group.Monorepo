import type { GetRackDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-detail";

export type RackDetailModalProps = {
  isOpen: boolean;
  rack?: GetRackDetailResponse | null;
  isLoading: boolean;
  onClose: () => void;
};
