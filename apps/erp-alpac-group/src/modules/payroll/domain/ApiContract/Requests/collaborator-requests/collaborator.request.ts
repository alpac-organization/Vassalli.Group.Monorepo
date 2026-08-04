import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * @interfacse CollaboratorRequest
 * @description Define la estructura para las solicitudes de filtro de colaboradores
 * este contrato asegura que los datos enviados al backend cumplan con los requisitos del servidor
 */
export interface CollaboratorRequest extends BaseRequest {
   /**
    * Numero de identificación del colaborador
    * @example "001-120395-0000X"
    * @optional
    */
   identification_number?: string;

  /**
   * Id de la sucursal
   * @required
   */
  branch_id: number;

  /**
   * Id del area
   */
  area_id: string;

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

  /**
   * Estado del colaborador
   * @example "Activo"
   * @optional
   */
  status?: string;
}
