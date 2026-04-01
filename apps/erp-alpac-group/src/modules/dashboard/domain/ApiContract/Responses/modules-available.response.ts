/**
 * Respuesta del servidor que detalla los módulos disponibles para una empresa.
 * Se utiliza para mapear la oferta de servicios contratados en el frontend.
 * * @interface ModulesAvailableResponse
 */
export interface ModulesAvailableResponse {
  /**
   * Identificador único del módulo en la base de datos.
   * @example 101
   */
  module_id: number;

  /**
   * Nombre comercial o descriptivo del módulo.
   * @example "Nómina"
   */
  module_name: string;

  /**
   * Identificador único de la empresa (Tenant).
   * Nota: Si el sistema soporta UUID, asegúrate de que el tipo coincida con la implementación.
   * @example 550
   */
  company_id: number;

  /**
   * Breve explicación de las funcionalidades incluidas en el módulo.
   * Ideal para componentes de UI como Tooltips o Cards informativas.
   * @example "Gestión integral de salarios, prestaciones y seguridad social."
   */
  description: string;

  /**
   * Código interno alfanumérico para validaciones de permisos o lógica de negocio.
   * @example "XXX-XXXX"
   */
  module_code: string;

  /**
   * Ruta de redirección del módulo.
   * @example "/payroll/collaborators"
   */
  path_redirect: string;

  /**
   * Ruta de la imagen del módulo.
   * @example "/payroll/collaborators"
   */
  image_url: string;
}
