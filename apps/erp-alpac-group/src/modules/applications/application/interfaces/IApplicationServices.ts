import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

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
   GetApplications(payload: ApplicationRequest): Promise<GetApplicationsResponse[]>;

   /**
    * Aprueba una solicitud
    * @param payload - Objeto con los parámetros de la solicitud
    * @returns Promesa con la solicitud aprobada
    */
   ApproveApplication(payload: any): Promise<void>;

   /**
    * Rechaza una solicitud
    * @param payload - Objeto con los parámetros de la solicitud
    * @returns Promesa con la solicitud rechazada
    */
   RejectApplication(payload: any): Promise<void>;
}