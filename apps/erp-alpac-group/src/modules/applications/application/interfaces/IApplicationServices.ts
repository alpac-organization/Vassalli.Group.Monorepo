import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationListResponse, GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

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
   GetApplications(payload: ApplicationRequest): Promise<GetApplicationListResponse>;

   /**
    * Aprueba y rechaza una solicitud
    * @param payload - Objeto con los parámetros de la solicitud
    * @returns Promesa con la solicitud aprobada o rechazada
    */
   ProcessApplication(payload: any): Promise<void>;

   /**
    * Obtiene el detalle de una solicitud
    * @param payload - Objeto con los parámetros de la solicitud
    * @returns Promesa con el detalle de la solicitud
    */
   GetApplicationDetail(payload: ApplicationRequest): Promise<GetApplicationsResponse>;
}