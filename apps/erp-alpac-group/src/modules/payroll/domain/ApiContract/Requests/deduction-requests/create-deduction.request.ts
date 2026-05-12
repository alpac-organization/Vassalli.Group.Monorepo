/**
 * @description Esta interfaz representa la estructura de la solicitud de creación de una deducción.
 */
export interface CreateDeductionRequest {
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
    * @property {string} deduction_type - Tipo de deducción.
    */
   deduction_type: string;

   /**
    * @property {string} observations - Observaciones de la deducción.
    */
   observations: string;
}