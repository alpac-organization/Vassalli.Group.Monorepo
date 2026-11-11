import type { InventoryOutputDetailDto, InventoryOutputDto } from "@app/modules/Inventory/domain/api-contract/responses/inventory-outputs.response";

export interface SalidasDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  detailData?: InventoryOutputDetailDto;
  selectedOutput?: InventoryOutputDto | null;
  requestType?: string | null;
}