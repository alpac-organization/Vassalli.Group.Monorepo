/**
 * @description Esta interfaz representa la estructura de la solicitud de creación de un subsidio.
 */
export interface CreateSubsidyRequest {
   /**
    * @property {string} company_id - Identificador de la empresa.
    */
   company_id: string;

   /**
    * @property {string} module_code - Código del módulo.
    */
   module_code: string;

   /**
    * @property {string} collaborator_id - Identificador del colaborador.
    */
   collaborator_id: string;

   /**
    * @property {string} subsidy_type - Tipo de subsidio.
    */
   subsidy_type: string;

   /**
    * @property {string | null} start_date - Fecha de inicio del subsidio.
    */
   start_date: string | null;

   /**
    * @property {string | null} end_date - Fecha de fin del subsidio.
    */
   end_date: string | null;

   /**
    * @property {string} boleta_number - Número de la boleta.
    */
   boleta_number: string;

   /**
    * @property {string} observations - Observaciones del subsidio.
    */
   observations: string;
}