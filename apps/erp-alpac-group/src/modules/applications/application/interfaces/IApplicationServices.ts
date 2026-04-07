import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsListResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

/**
 * @interface IApplicationServices
 * @description Define la interfaz para los servicios de solicitudes
 */
export interface IApplicationServices {

   /**
    * Obtiene el listado de solicitudes
    * @param payload - Objeto con los parámetros de la solicitud
    * @returns Promesa con el listado de solicitudes
    */
   GetApplications(payload: ApplicationRequest): Promise<GetApplicationsListResponse>;
}