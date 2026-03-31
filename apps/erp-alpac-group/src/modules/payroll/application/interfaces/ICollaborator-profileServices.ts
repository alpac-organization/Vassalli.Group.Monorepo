import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-profile.request";

/**
 * @interface ICollaboratorServices
 * @description Define el contrato para el servicio de colaborador-profile-detalles.
 * Este puerto abstrae la lógica de colaborador-profile, permitiendo que el dominio no dependa
 * directamente de la implementación (Axios, Fetch, o Mocks).
 */
export interface ICollaboratorProfileServices {
  /**
   * @method GetCollaboratorProfileDetails
   * @description Obtiene los detalles del perfil de colaboradores.
   * @param {CollaboratorProfileDetailsRequest} payload Datos de obtencion para la solicitud.
   * @returns {Promise<GetCollaboratorProfileDetailsResponse[]>} Promesa con los detalles de perfil de  colaborador.
   * @throws {Error} Si hay un error en la solicitud.
   */
  GetCollaboratorProfileDetails(
    payload: CollaboratorProfileDetailsRequest,
  ): Promise<GetCollaboratorProfileDetailsResponse[]>;
}
