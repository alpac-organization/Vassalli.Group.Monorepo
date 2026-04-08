/**
 * @interface ApplicationRequest
 * @description Define la estructura para las solicitudes de filtro
 * este contrato asegura que los datos enviados al backend cumplan con los requisitos del servidor
 */
export interface ApplicationRequest {

   /**
    * Identificador de la empresa
    * @required
    */

   company_id: string;
   /**
    * Codigo del modulo de Nomina, Contabilidad, Facturacion, Inventario, etc
    * @required
    */
   module_code: string;

   /**
    * Identificación del colaborador
    * @optional
    */
   identification_number?: string;

   /**
    * Identificador del tipo de solicitud
    * @optional
    */
   permit_application_type_id?: number;

   /**
    * Identificador del estado de la solicitud
    * @optional
    */
   permit_application_status_id?: number;
}