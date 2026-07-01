/**
 * @interface DeactivateCollaboratorRequest
 * @description Define la estructura para la desactivacion de un colaborador
 */

export interface DeactivateCollaboratorRequest {
    /**
    * Id de la empresa
    * @example "123e4567-e89b-12d3-a456-426614174000"
    * @required
    */
   company_id: string;

   /**
    * Codigo del modulo de Nomina, Contabilidad, Facturacion, Inventario, etc
    * @required
    */
   module_code: string;

   /**
    * Puede ser cedula nicaraguense, cedula de residencia o pasaporte
    * @example "0011203950000X"
    * @required
    */
   identification_number: string;
}
