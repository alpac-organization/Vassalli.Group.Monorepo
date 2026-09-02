import type { Baseparams } from "@app/core/interfaces/api/BaseParams";

export interface PendingAssignmentsRequest extends Baseparams, PendingAssignmentsQueries { 
    //your other properties here
}


/**
 * Parámetros de consulta (query params) para filtrar la lista de
 * asignaciones de descarga de mercancía pendientes.
 */
export interface PendingAssignmentsQueries {

    /**
     * Código de la orden de servicio por el cual filtrar.
     */
    service_order_code?: string;

    /**
     * Número de ducado (documento) por el cual filtrar.
     */
    ducat_number?: string;

    /**
     * Estado de la descarga por el cual filtrar.
     */
    unloading_status?: number;

    /**
     * Número de página a consultar (paginación).
     */
    page_number?: number;

    /**
     * Tamaño de página a consultar (paginación).
     */
    page_size?: number;
}