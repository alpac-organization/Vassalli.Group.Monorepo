import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";

export type RackDetailModalProps = {
  isOpen: boolean;
  warehouseId: string;
  sectionId: string;
  rackId?: string | null;
  rackSummary?: RackDto | null;
  onClose: () => void;
};
