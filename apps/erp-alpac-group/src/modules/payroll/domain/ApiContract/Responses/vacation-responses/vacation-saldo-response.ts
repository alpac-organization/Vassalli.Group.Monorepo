export interface GetVacationSaldoResponse {

   /**
    * Id de las vacaciones
    */
   vacation_id: string;

   /**
    * Nombre completo del colaborador
    */
   full_name: string;

   /**
    * Vacaciones disponibles
    */
   available_vacations: number;

   /**
    * Vacaciones generadas
    */
   genered_vacation: number;

   /**
    * Vacaciones disfrutadas
    */
   enjoyed_vacation: number;
}
