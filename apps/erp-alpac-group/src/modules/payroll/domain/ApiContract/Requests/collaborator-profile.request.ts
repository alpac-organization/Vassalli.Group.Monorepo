/**
 * @interfacse CollaboratorProfileRequest
 * @description Define la estructura para las solicitud de detalles de colaboradores
 * este contrato asegura que los datos enviados al backend cumplan con los requisitos del servidor
 */

export interface CollaboratorProfileDetailsRequest {
  /**
   * Puede ser cedula nicaraguense, cedula de residencia o pasaporte
   * @example "001-120395-0000X"
   * @optional
   */
  identification?: string;

  /**
   * Cargo que desempeña el colaborador
   * @example "Contador"
   * @optional
   */
  position?: string;

  /**
   * Area a la que pertenece el colaborador
   * @example "Tecnología"
   * @optional
   */
  area?: string;

  /**
   * Estado del colaborador
   * @example "Activo"
   * @optional
   */
  status?: string;

  /**
   * Id de la empresa
   * @example "123e4567-e89b-12d3-a456-426614174000"
   * @required
   */
  company_id: string;

  /**
   * Codigo del modulo de Nomina, Contabilidad, Facturacion, Inventario, etc
   * @required
   */
  module_code: string;
}
