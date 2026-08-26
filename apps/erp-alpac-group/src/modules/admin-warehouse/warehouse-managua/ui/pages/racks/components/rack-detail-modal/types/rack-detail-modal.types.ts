import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";

export type RackDetailModalProps = {
  isOpen: boolean;
  rack?: RackListItemResponse | null;
  onClose: () => void;
};
