import type { KardexTypeEnum } from "@app/core/enums/kardex-type.enum";
import type { KardexMovementTypeEnum } from "@app/core/enums/kardex-movement-type.enum";

import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Parámetros de consulta para obtener los movimientos del Kardex.
 *
 * Extiende {@link BaseRequest} y permite filtrar por categoría, producto,
 * tipo de Kardex y tipo de movimiento, con soporte de paginación.
 *
 * @interface KardexMovementsRequest
 * @extends BaseRequest
 */
export interface KardexMovementsRequest extends BaseRequest
{
    /**
     * Identificador de la categoría de productos por la cual filtrar.
     * Si se omite, no se aplica filtro por categoría.
     */
    category_id?:   string;

    /**
     * Código del producto por el cual filtrar.
     * Si se omite, se consideran todos los productos.
     */
    product_code?:  string;

    /**
     * Tipo de Kardex a consultar.
     * @see KardexTypeEnum
     */
    kardex_type?:   KardexTypeEnum;

    /**
     * Tipo de movimiento a filtrar (por ejemplo: entrada, salida, ajuste).
     * @see KardexMovementTypeEnum
     */
    movement_type?: KardexMovementTypeEnum;

    /**
     * Cantidad de registros por página.
     */
    page_size:      number;

    /**
     * Número de página a consultar (según el criterio de indexación del
     * backend, normalmente iniciando en 1).
     */
    page_number:    number
}