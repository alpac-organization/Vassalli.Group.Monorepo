/**
 * Entidad base para respuestas paginadas.
 *
 * Representa el resultado de una consulta paginada, incluyendo los datos
 * de la página actual junto con la información necesaria para gestionar
 * la paginación (número de página, tamaño de página y total de registros).
 *
 * @typeParam TEntity - Tipo de los elementos contenidos en la página de datos.
 *
 * @example
 * ```typescript
 * const response: PagedResponse<PendingAssignment> = {
 *   data: [...],
 *   pageNumber: 1,
 *   pageSize: 10,
 *   total: 42
 * };
 * ```
 */
export interface PagedResponse<T> {

    /**
     * Colección de elementos correspondientes a la página actual.
     */
    data: T[];

    /**
     * Número de la página actual (basado en el criterio de paginación utilizado).
     */
    pageNumber: number;

    /**
     * Cantidad de elementos solicitados por página.
     */
    pageSize: number;

    /**
     * Cantidad total de registros disponibles, sin considerar la paginación.
     *
     * @defaultValue 0
     */
    total: number;
}