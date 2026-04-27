export interface CancelPermissionRequest {
   /**
    * Identificador único de la empresa
    */
   company_id: string;
   /**
    * Codigo del modulo de vacaciones
    */
   module_code: string;
   /**
    * Identificador único de la solicitud de permiso
    */
   permit_application_id: string;
}
