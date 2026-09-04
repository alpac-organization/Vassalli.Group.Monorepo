import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PalletType } from "@app/modules/warehouse/domain/enums/warehouse-managua/pallet-type";

/**
 * Solicitud para iniciar el proceso de descarga de una asignación.
 */
export interface StartUnloadingRequest extends BaseRequest {
   assignment_id: string;
   start_date?: string | null;
   start_time?: string | null;
   merchandise_type: number;
   pallets: StartUnloadingPalletItem[];
   supplies: StartUnloadingSupplyItem[];
}

/**
 * Pallet informado al iniciar una descarga.
 */
export interface StartUnloadingPalletItem {
   type: PalletType["value"];
   quantity: number;
   length_metres?: number | null;
   width_metres?: number | null;
}

/**
 * Insumo informado al iniciar una descarga.
 */
export interface StartUnloadingSupplyItem {
   supplies_id: string;
   quantity: number;
}
