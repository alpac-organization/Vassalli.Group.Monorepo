import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";

export interface RackModalProps {
  isOpen: boolean;
  sectionId: string;
  onClose: () => void;
  onSubmit?: (data: CreateRacksRequest) => void;
}
