export interface GetAssignmentDetailRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  /**
   * GUID de la DUCA. Se envía como query param sólo cuando el documento es de tipo DUCA.
   * Para CustomsDeclaration se omite (undefined) — cleanParams se encarga de excluirlo.
   */
  entrance_ducat_id?: string;
}

