import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";

export interface SectionModalProps {
  isOpen: boolean;
  warehouseId: string;
  onClose: () => void;
  onSubmit?: (data: CreateSectionRequest) => void;
}
