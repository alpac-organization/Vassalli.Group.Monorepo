import type { GetCollaboratorsListResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborators.response";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import type { CollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator-profile.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { AddCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/add-collaborator.request";
import type { UpdateCollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/update-collaborator-request";
import type { GetCollaboratorProfileGeneratedDocumentParams } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";
import type { DeactivateCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/deactivate-collaborator.request";
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

  /**
   * @method GetCollaboratorProfileDetails
   * @description Obtiene los detalles del perfil de colaboradores.
   * @param {CollaboratorDetailsRequest} payload Datos de obtencion para la solicitud.
   * @returns {Promise<GetCollaboratorProfileDetailsResponse>} Promesa con los detalles de perfil de  colaborador.
   * @throws {Error} Si hay un error en la solicitud.
   */
  GetCollaboratorProfileDetails(
    payload: CollaboratorProfileDetailsRequest,
  ): Promise<GetCollaboratorProfileDetailsResponse>;

  /**
   * @method UpdateCollaboratorProfileDetails
   * @description Actualiza los detalles del perfil de colaboradores.
   * @param {UpdateCollaboratorProfileDetailsRequest} payload Datos de actualizacion para la solicitud.
   * @returns {Promise<void>} Promesa que indica que la operación se completó exitosamente.
   * @throws {Error} Si hay un error en la solicitud.
   */
  UpdateCollaboratorProfileDetails(
    paylod: UpdateCollaboratorProfileDetailsRequest,
  ): Promise<void>;

  GenerateCollaboratorProfileDocument(
    payload: GetCollaboratorProfileGeneratedDocumentParams,
  ): Promise<Blob>;


  DeactivateCollaborator(payload: DeactivateCollaboratorRequest): Promise<void>;
}
