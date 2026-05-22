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
    * @property {string} payroll_id - Código de la nómina
    */
   payroll_id: string;

   /**
    * @property {string} collaborator_id - Identificador del colaborador.
    */
   collaborator_id: string;

   /**
    * TypeSubsidyId
    * @property {string} type_subsidy_id - Tipo de subsidio.
   */
   type_subsidy_id: string;

   /**
    * ReferenceNumber
    * @property {string} reference_number - Número de la boleta.
    */
   reference_number: string;

   /**
    * @property {string | null} start_date - Fecha de inicio del subsidio.
    */
   start_date: string | null;

   /**
    * @property {string | null} end_date - Fecha de fin del subsidio.
    */
   end_date: string | null;


   /**
    * @property {string} observations - Observaciones del subsidio.
    */
   observations: string;   
}