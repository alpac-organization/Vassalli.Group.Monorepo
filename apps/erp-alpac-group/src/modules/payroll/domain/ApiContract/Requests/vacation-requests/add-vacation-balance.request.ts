/**
 * @description
 * Interface que define la estructura de props para el componente AddVacationBalanceRequest
 */
export interface AddVacationBalanceRequest {
   /**
    * Id de las vacaciones
    */
   vacation_id: string;

   /**
    * Identificador único de la empresa
    */
   company_id: string;

   /**
    * Codigo del modulo de vacaciones
    */
   module_code: string;

   /**
    * Numero de identificacion del colaborador
    */
   identification_number: string;

   /**
    * Saldo de vacaciones
    */
   vacation_balance: number;
}