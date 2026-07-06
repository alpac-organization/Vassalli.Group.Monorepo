/**
 * @interfacse SubsidyHistoryRequest
 * @description Define la estructura para el historial de subsidio
 */

export interface GetSubsidyHistoryRequest {
  /**
   * Id de la empresa
   * @required
   */
  companie_id: string;

  /**
   * Codigo del modulo de Nomina, Contabilidad, Facturacion, Inventario, etc
   * @required
   */
  module_code: string;

  /**
   * Código del colaborador
   * @example "VIGEMSA-00100"
   * @optional
   */
  collaborator_code?: string;

  /**
   * Id de la sucursal
   * @optional
   */
  branch_id?: string;

  /**
   * Id del area
   * @optional
   */
  area_id?: string;

  /**
   * Numero de la pagina
   * @optional
   */
  page_number?: number;

  /**
   * Tamaño de la pagina
   * @optional
   */
  page_size?: number;
}
