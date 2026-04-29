/**
 * Interface que define el cuerpo de la petición para registrar un ingreso
 */
export interface CreateIncomeRequest {

   /**
    * Recibe el id de la empresa
    */
   company_id: string;

   /**
    * Recibe el código del módulo
    */
   module_code: string;

   /**
    * Recibe el guid del tipo de ingreso
    */
   type_income_id: string;

   /**
    * Recibe el número de identificación del colaborador
    */
   identification_number: string;


   /**
    * Recibe el monto del ingreso
    */
   income_amount: number;

   /**
    * Descripción breve del concepto
    */
   description: string;
}