import type { CreateLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

export interface LotModalProps {
  isOpen: boolean;
  sectionId: string;
  onClose: () => void;
  onSubmit?: (data: CreateLotsRequest) => void;
}
