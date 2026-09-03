interface BaseUnloadingCrewRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  entrance_ducat_id: string | null; // null cuando DocumentType === CustomsDeclaration
  is_outsourced: boolean;
}

/** Cuadrilla interna: is_outsourced === false */
export interface InternalUnloadingCrewRequest extends BaseUnloadingCrewRequest {
  is_outsourced: false;
  collaborator_ids: string[]; // GUIDs de empleados seleccionados — obligatorio
}

/** Cuadrilla tercerizada: is_outsourced === true */
export interface OutsourcedUnloadingCrewRequest extends BaseUnloadingCrewRequest {
  is_outsourced: true;
  person_count: number;     // obligatorio, > 0
  provider_name: string;    // obligatorio
  invoice_number?: string;  // opcional
}

export type CreateUnloadingCrewRequest =
  | InternalUnloadingCrewRequest
  | OutsourcedUnloadingCrewRequest;

