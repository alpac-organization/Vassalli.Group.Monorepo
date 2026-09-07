interface BaseUnloadingMachineryRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  entrance_ducat_id: string | null; // null cuando DocumentType === CustomsDeclaration
  is_outsourced: boolean;
  start_time?: string; // ISO 8601, ej: "2026-09-02T16:00:00Z"
}

/** Maquinaria propia/interna: is_outsourced === false */
export interface InternalUnloadingMachineryRequest
  extends BaseUnloadingMachineryRequest {
  is_outsourced: false;
  machinery_id: string;                  // GUID obtenido de /machinery-catalogs — obligatorio
  operator_collaborator_id?: string;     // GUID del operador — opcional
}

/** Maquinaria alquilada/tercerizada: is_outsourced === true */
export interface OutsourcedUnloadingMachineryRequest
  extends BaseUnloadingMachineryRequest {
  is_outsourced: true;
  provider_name: string;            // obligatorio
  invoice_number?: string;          // opcional
  machinery_description?: string;   // opcional
}

export type CreateUnloadingMachineryRequest =
  | InternalUnloadingMachineryRequest
  | OutsourcedUnloadingMachineryRequest;

