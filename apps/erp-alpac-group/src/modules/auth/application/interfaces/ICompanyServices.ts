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
}