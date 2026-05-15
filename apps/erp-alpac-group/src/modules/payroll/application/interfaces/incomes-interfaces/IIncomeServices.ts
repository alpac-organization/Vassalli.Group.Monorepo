import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import type { GetIncomeTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/get-income-types.request";
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response";

/**
 * @interface IIncomesServices
 * @description Define el contrato para los servicios de ingresos.
 * Este puerto abstrae la lógica de ingresos, permitiendo que el dominio no dependa
 * directamente de la implementación (Axios, Fetch, o Mocks).
 */
export interface IIncomesServices {
   /**
    * @method GetIncomesTypes
    * @description Obtiene los tipos de ingresos.
    * @param {GetIncomeTypesRequest} payload Datos de filtro para la solicitud.
    * @returns {Promise<IncomesTypesResponse>} Promesa con los tipos de ingresos.
    * @throws {Error} Si hay un error en la solicitud.
    */
   GetIncomesTypes(payload: GetIncomeTypesRequest): Promise<IncomesTypesResponse[]>;

   /**
    * @method CreateIncome
    * @description Crea un nuevo ingreso.
    * @param {CreateIncomeRequest} payload Datos del ingreso a crear.
    * @returns {Promise<void>} Promesa que indica el éxito o fracaso de la operación.
    * @throws {Error} Si hay un error en la solicitud.
    */
   CreateIncome(payload: CreateIncomeRequest): Promise<void>;
}