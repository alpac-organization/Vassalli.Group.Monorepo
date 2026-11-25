import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

export interface KardexDetailModalProps {
   isOpen: boolean;
   movement: KardexMovementsData | null;
   onClose: () => void;
}
