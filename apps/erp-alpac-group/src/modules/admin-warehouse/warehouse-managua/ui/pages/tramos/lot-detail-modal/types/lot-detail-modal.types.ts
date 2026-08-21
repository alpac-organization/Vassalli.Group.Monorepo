import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";

export type LotDetailModalProps = {
  isOpen: boolean;
  lot?: LotDetailResponse | null;
  isLoading: boolean;
  onClose: () => void;
};
