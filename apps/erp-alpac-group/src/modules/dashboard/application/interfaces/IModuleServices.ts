import type { ModuleAccessValidateResponse } from "../../domain/ApiContract/Responses/module-access-validate.response";
import type { ModulesAvailableResponse } from "../../domain/ApiContract/Responses/modules-available.response";

/**
 * Contrato de servicios para la gestión de módulos dentro del ecosistema ERP.
 * Define las operaciones necesarias para consultar la disponibilidad y estados de los módulos.
 * @interface IModuleServices
 */
export interface IModuleServices {
  /**
   * Recupera el listado de módulos que se encuentran activos para una empresa específica.
   * @param {number} company_id - Identificador único de la empresa (Tenant ID).
   * @returns {Promise<ModulesAvailableResponse[]>} Promesa que resuelve con la lista de módulos disponibles.
   * @throws {Error} Si el servidor no responde o si el company_id no es válido.
   */
  ObtainActiveModulesByCompanyId(
    company_id: number,
  ): Promise<ModulesAvailableResponse[]>;

  /**
   * @param {{ company_id: number, module_code: string }} payload
   * @returns {Promise<ModuleAccessValidateResponse>}
   * @throws {Error} Si ocurre un problema de red o de validación en el servidor.
   * @example
   * const access = await service.VerifyAccessToModule({ company_id: 1, module_code: "NOM-UGML" });
   */
  VerifyAccessToModule(payload: {
    company_id: number;
    module_code: string;
  }): Promise<ModuleAccessValidateResponse>;
}
