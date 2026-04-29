/**
 * 
 * type_income_id: Identificador único del tipo de ingreso
 * income_title: Título o nombre del tipo de ingreso
 * income_description: Descripción breve del concepto
 * 
 */
export interface IncomesTypesResponse {
   /**
    * Identificador único del tipo de ingreso
    */
   type_income_id: string;

   /**
    * Título o nombre del tipo de ingreso
    */
   income_title: string;

   /**
    * Descripción breve del concepto
    */
   income_description: string;

   /**
    * Código único del tipo de ingreso
    */
   income_code: string;
}