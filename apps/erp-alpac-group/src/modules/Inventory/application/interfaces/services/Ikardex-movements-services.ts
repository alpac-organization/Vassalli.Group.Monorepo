import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { KardexMovementsRequest } from "@app/modules/Inventory/domain/api-contract/requests/kardex-movements.request";
import type { KardexMovementsResponse } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

/**
 * Contrato del servicio de movimientos de Kardex.
 *
 * Define las operaciones disponibles para consultar el historial de
 * movimientos de inventario registrados en el Kardex, con soporte de
 * filtrado y paginación.
 *
 * @interface IKardexMovementsServices
 */
export interface IKardexMovementsServices {
    /**
     * Obtiene una página de movimientos de Kardex que coinciden con los
     * filtros indicados.
     *
     * @param {KardexMovementsRequest} payload - Criterios de consulta:
     * categoría, código de producto, tipo de Kardex, tipo de movimiento y
     * parámetros de paginación (`page_size` y `page_number`).
     *
     * @returns {Promise<PaginateBaseResponse<KardexMovementsResponse>>}
     * Promesa que se resuelve con la respuesta paginada que contiene los
     * movimientos encontrados junto con la información de paginación.
     *
     * @throws {Error} Si el payload es inválido o si ocurre un error al
     * comunicarse con el origen de datos.
     *
     * @example
     * const result = await kardexService.GetKardexMovements({
     *   product_code: "PROD-001",
     *   movement_type: KardexMovementTypeEnum.Input,
     *   page_size: 20,
     *   page_number: 1
     * });
     */
    GetKardexMovements(payload: KardexMovementsRequest): Promise<PaginateBaseResponse<KardexMovementsResponse>>;
}