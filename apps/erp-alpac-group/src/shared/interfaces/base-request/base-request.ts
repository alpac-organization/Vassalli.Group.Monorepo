/**
 * Propiedades base para peticiones al ERP.
 *
 * Identifica la empresa y el módulo sobre el que se opera.
 * Casi todos los contratos de request del frontend extienden esta interface
 * para armar rutas del estilo:
 * `/companies/{company_id}/modules/{module_code}/...`
 *
 * @property {string} company_id - Identificador único (GUID) de la empresa.
 * @property {string} module_code - Código del módulo dentro del sistema ERP (ej. nómina / payroll).
 *
 * @example
 * ```ts
 * const payload: BaseRequest = {
 *   company_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   module_code: "PAYROLL",
 * };
 * ```
 */
export interface BaseRequest {
  company_id: string;
  module_code: string;
}
