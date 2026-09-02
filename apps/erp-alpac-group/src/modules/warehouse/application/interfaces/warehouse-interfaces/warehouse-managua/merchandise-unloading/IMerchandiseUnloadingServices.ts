import type { PagedResponse } from "@app/core/interfaces/PagedResponse";
import type { PendingAssignment } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading-responses/get-pending-assignments.response";
import type { PendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-pending-assignments.request";

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
}