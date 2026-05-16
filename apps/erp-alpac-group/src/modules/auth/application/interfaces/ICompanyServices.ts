import type { BranchesRequest } from "../../domain/ApiContract/Requests/branches.request";
import type { GetCompaniesResponse } from "../../domain/ApiContract/Responses/get-companies.response";

/**
 * Interfaz que define los servicios relacionados con la gestión y consulta de empresas.
 */
export interface ICompanyServices {
   /**
   * Obtiene la lista de todas las empresas que se encuentran disponibles en el sistema.
   * 
   * @returns {Promise<GetCompaniesResponse[]>} Una promesa que resuelve a un arreglo de objetos 
   * con la información de las empresas disponibles.
   */
   GetCompaniesAvailable(): Promise<GetCompaniesResponse[]>;

   /**
    * Obtiene la lista de sucursales de una empresa disponible en el sistema.
    * 
    * @param request Objeto que contiene el id de la empresa.
    * @returns Una promesa que resuelve a un arreglo de objetos con la información de las sucursales disponibles.
    */
   GetBranchesAvailable(request: BranchesRequest): Promise<any>;
}