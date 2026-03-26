import type { ModulesAvailableResponse } from "../../domain/ApiContract/Responses/modules-available.response";

/**
 * Contrato de servicios para la gestión de módulos dentro del ecosistema ERP.
 * Define las operaciones necesarias para consultar la disponibilidad y estados de los módulos.
 * @interface IModuleServices
 */
export interface IModuleServices {
    /**
     * Recupera el listado de módulos que se encuentran activos para una empresa específica.
     * * @param {number} company_id - Identificador único de la empresa (Tenant ID).
     * * @returns {Promise<ModulesAvailableResponse[]>} Promesa que resuelve con la lista de módulos disponibles y su configuración.
     * * @throws {Error} Si el servidor no responde o si el company_id no es válido.
     * * @example
     * const modules = await service.ObtainActiveModulesByCompanyId(1);
     */
    ObtainActiveModulesByCompanyId(company_id: string): Promise<ModulesAvailableResponse[]>
}