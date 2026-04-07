import type { GetCollaboratorsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborators.response";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import type { AddCollaboratorRequest } from "../../domain/ApiContract/Requests/add-collaborator.request";

/**
 * @interface ICollaboratorServices
 * @description Define el contrato para los servicios de colaboradores.
 * Este puerto abstrae la lógica de colaboradores, permitiendo que el dominio no dependa
 * directamente de la implementación (Axios, Fetch, o Mocks).
 */
export interface ICollaboratorServices {
  /**
   * @method GetCollaborators
   * @description Obtiene el listado de colaboradores.
   * @param {CollaboratorRequest} payload Datos de filtro para la solicitud.
   * @returns {Promise<GetCollaboratorsListResponse>} Promesa con el listado de colaboradores.
   * @throws {Error} Si hay un error en la solicitud.
   */
  GetCollaborators(
    payload: CollaboratorRequest,
  ): Promise<GetCollaboratorsListResponse>;

  /**
   * @method PostCollaborator
   * @description Agrega un nuevo colaborador.
   * @param {AddCollaboratorRequest} payload Datos del nuevo colaborador.
   * @returns {Promise<void>} Promesa que indica que la operación se completó exitosamente.
   * @throws {Error} Si hay un error en la solicitud.
   */
  PostCollaborator(payload: AddCollaboratorRequest): Promise<void>;
}
