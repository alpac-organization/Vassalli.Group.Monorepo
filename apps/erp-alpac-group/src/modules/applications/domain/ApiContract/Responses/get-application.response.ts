export interface GetApplicationsResponse {
   /**
    * Id del permiso
    * @example "01bb0621-6af0-414e-a681-07787ca3bc26"
    * @required
    */
   permit_apllication_id: string;

   /**
    * Id del colaborador
    * @example "224d9214-e7ef-4776-af9a-fedacd64722b"
    * @required
    */
   collaborator_id: string;

   /**
    * Codigo del colaborador
    * @example "BXX-FUWU"
    * @required
    */
   collaborator_code: string;

   /**
    * Fecha de fin del permiso
    * @example "2026-05-08T00:00:00Z"
    * @required
    */
   end_date: string;

   /**
    * Fecha de inicio del permiso
    * @example "2026-05-03T00:00:00Z"
    * @required
    */
   start_date: string;

   /**
    * Descripcion del permiso
    * @example "permiso"
    * @required
    */
   description: string;

   /**
    * Nombre del colaborador que solicito el permiso
    * @example "Roberto  Castellon"
    * @required
    */
   requested_by: string;

   /**
    * Nombre del colaborador que aprobo el permiso
    * @example "Roberto  Castellon"
    * @optional
    */
   approved_by?: string;

   /**
    * Nombre del colaborador que rechazo el permiso
    * @example "Roberto  Castellon"
    * @optional
    */
   rejected_by?: string;

   /**
    * Fecha de creacion del permiso
    * @example "2026-04-07T20:17:40.347476Z"
    * @required
    */
   created_at: string;

   /**
    * Hora de inicio del permiso
    * @example "10:00"
    * @optional
    */
   start_time?: string;

   /**
    * Hora de fin del permiso
    * @example "12:00"
    * @optional
    */
   end_time?: string;

   /**
    * Estado del permiso
    * @example "Pending"
    * @required
    */
   status: string;

   /**
    * Tipo de permiso
    * @example "UnpaidLeave"
    * @required
    */
   type: string;
}

/**
 * @interface GetApplicationsListResponse
 * @description Envuelve la respuesta paginada del listado de permisos
 */
export interface GetApplicationsListResponse {
   /**
    * Lista de permisos
    * @required
    */
   data: GetApplicationsResponse[];
}