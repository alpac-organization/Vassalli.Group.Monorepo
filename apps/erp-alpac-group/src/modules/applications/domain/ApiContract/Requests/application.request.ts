/**
 * @interface ApplicationRequest
 * @description Define la estructura para las solicitudes de filtro
 * este contrato asegura que los datos enviados al backend cumplan con los requisitos del servidor
 */
export interface ApplicationRequest {

   /**
    * Codigo del modulo de Nomina, Contabilidad, Facturacion, Inventario, etc
    * @required
    */
   module_code: string;
}