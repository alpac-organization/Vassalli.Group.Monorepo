import type { PagedResponse } from "@app/core/interfaces/PagedResponse";
import type { PendingAssignment } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-pending-assignments.response";
import type { PendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-pending-assignments.request";
import type { GetAssignmentDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-assignment-details.request";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-assignment-details.response";
import type { StartUnloadingRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/start-unloading-process.request";

/**
 * Contrato que define los servicios relacionados con la descarga de mercancía.
 */
export interface IMerchandiseUnloadingServices {

    /**
     * Obtiene las asignaciones de descarga que se encuentran pendientes.
     *
     * @remarks
     * Retorna aquellas asignaciones que aún no han sido procesadas o
     * completadas, permitiendo su consulta para su posterior gestión
     * (asignación a operarios, inicio de descarga, etc.).
     *
     * @param payload - Parámetros de la solicitud ({@link PendingAssignmentsRequest}),
     * incluyendo identificadores (compañía, módulo, recepción) y filtros
     * de paginación.
     *
     * @returns Una {@link Promise} que resuelve con la lista paginada
     * ({@link PagedResponse}) de asignaciones pendientes
     * ({@link PendingAssignment}).
     *
     * @example
     * ```typescript
     * const pendientes = await merchandiseUnloadingService.GetPendingAssignmentsAsync({
     *     company_id: "e8147b2f-fa20-484d-bad8-ebdc2b11c75f",
     *     module_code: "WAREHOUSE",
     *     reception_id: "9e394400-4450-49a3-8070-9b62626870f2",
     * });
     * console.log(pendientes.data);
     * ```
     */
    GetPendingAssignmentsAsync(payload: PendingAssignmentsRequest): Promise<PagedResponse<PendingAssignment>>;

    /**
     * Obtiene el detalle de una asignación de descarga.
     *
     * @remarks
     * Consulta la información completa de una asignación específica
     * (bodega, estado, bodeguero, maquinaria y cuadrilla) para su
     * visualización o para iniciar el proceso de descarga.
     *
     * @param payload - Parámetros de la solicitud ({@link GetAssignmentDetailsRequest}),
     * incluyendo identificadores (compañía, módulo y asignación).
     *
     * @returns Una {@link Promise} que resuelve con el detalle de la asignación
     * ({@link GetAssignmentDetailsResponse}).
     *
     * @example
     * ```typescript
     * const detalle = await merchandiseUnloadingService.GetUnloadingAssignmentDetails({
     *     company_id: "e8147b2f-fa20-484d-bad8-ebdc2b11c75f",
     *     module_code: "WAREHOUSE",
     *     assignment_id: "9e394400-4450-49a3-8070-9b62626870f2",
     * });
     * console.log(detalle.assignment_id);
     * ```
     */
    GetUnloadingAssignmentDetails(payload: GetAssignmentDetailsRequest): Promise<GetAssignmentDetailsResponse>;

    /**
     * Inicia el proceso de descarga de una asignación.
     *
     * @remarks
     * Marca la asignación como en proceso de descarga y registra la fecha/hora
     * de inicio, el tipo de mercancía, los pallets y los insumos asociados.
     *
     * @param payload - Parámetros de la solicitud ({@link StartUnloadingRequest}),
     * incluyendo identificadores (compañía, módulo, asignación), tipo de
     * mercancía, pallets e insumos.
     *
     * @returns Una {@link Promise} que se resuelve cuando la descarga ha iniciado.
     *
     * @example
     * ```typescript
     * await merchandiseUnloadingService.StartUnloading({
     *     company_id: "e8147b2f-fa20-484d-bad8-ebdc2b11c75f",
     *     module_code: "WAREHOUSE",
     *     assignment_id: "9e394400-4450-49a3-8070-9b62626870f2",
     *     merchandise_type: 1,
     *     pallets: [],
     *     supplies: [],
     * });
     * ```
     */
    StartUnloading(payload: StartUnloadingRequest): Promise<void>;
}