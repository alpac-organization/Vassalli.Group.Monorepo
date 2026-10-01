import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotPosition } from "../lot-shape/lot-shape.types";

export interface LotViewerLot {
  lot: LotListItemResponse;
  /** Dimensiones en metros; 0 cuando el endpoint de capacidades no respondio. */
  width: number;
  length: number;
  /** Coordenadas confirmadas por el backend. */
  savedPosition: LotPosition | null;
  /** Coordenadas editadas localmente, pendientes de guardar. */
  draftPosition: LotPosition | null;
}

export interface LotViewerProps {
  className?: string;
  lots: LotViewerLot[];
  sectionWidth: number;
  sectionLength: number;
  sectionCode?: string | null;
  selectedLotId?: string | null;
  isLoading?: boolean;
  isSaving?: boolean;
  hasPendingChanges?: boolean;
  onSelectLot?: (lot: LotListItemResponse) => void;
  onPositionChange?: (lotId: string, position: LotPosition) => void;
  onRotateLot?: (lotId: string) => void;
  onSave?: () => void;
  onDiscard?: () => void;
}
