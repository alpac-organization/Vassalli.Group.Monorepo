/**
 * Representa una asignación de descarga de mercancía en cola.
 */
export interface PendingAssignment {

    /**
     * Identificador único de la asignación.
     */
    assignment_id: string;

    /**
     * Identificador del registro de ingreso (entrada) asociado a la asignación.
     */
    record_entrance_id: string;

    /**
     * Número de ducado (documento) asociado a la asignación.
     *
     * @remarks
     * Puede ser `null` cuando aún no ha sido asignado o generado.
     */
    ducat_number: string | null;

    /**
     * Código de la orden de servicio asociada a la asignación.
     *
     * @remarks
     * Puede ser `null` cuando aún no ha sido asignado o generado.
     */
    service_order_code: string | null;

    /**
     * Identificador de la bodega donde se realizará la descarga.
     */
    warehouse_id: string;

    /**
     * Nombre descriptivo de la bodega donde se realizará la descarga.
     */
    warehouse_name: string;

    /**
     * Estado actual de la descarga de mercancía.
     *
     * @remarks
     * Debe mantenerse sincronizado con el enum `UnloadingStatus` del backend.
     */
    unloading_status: string;
}