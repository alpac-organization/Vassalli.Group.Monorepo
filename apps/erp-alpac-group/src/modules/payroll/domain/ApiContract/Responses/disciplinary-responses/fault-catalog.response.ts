/**
 * Tipo de falta del catálogo disciplinario de la empresa.
 *
 * Usado al listar `fault-catalogs` (selector al registrar faltas).
 *
 * @property {string} fault_catalog_id - Identificador del ítem de catálogo.
 * @property {string} [company_id] - Empresa dueña del catálogo.
 * @property {string} code - Código de la falta (ej. `FL-ALP-01`).
 * @property {string} name - Nombre corto de la falta.
 * @property {string|null} [description] - Descripción opcional / detalle normativo.
 * @property {boolean} [is_active] - Indica si el tipo está activo para nuevos registros.
 * @property {string} [fault_severity] - Severidad como texto enum: `Minor` | `Serious` | `VerySerious`.
 *
 * @example
 * ```ts
 * const item: FaultCatalogDto = {
 *   fault_catalog_id: "7708d447-1b6a-4194-a877-7e6f49cd80b4",
 *   company_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   code: "FL-ALP-01",
 *   name: "Llegada tarde",
 *   description: "Incumplimiento del horario de ingreso",
 *   is_active: true,
 *   fault_severity: "Minor",
 * };
 * ```
 */
export interface FaultCatalogDto {
  fault_catalog_id: string;
  company_id?: string;
  code: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  fault_severity?: string;
}

/**
 * Respuesta paginada del catálogo de faltas.
 *
 * @property {FaultCatalogDto[]} data - Lista de tipos de falta del catálogo.
 * @property {number} page_number - Página actual.
 * @property {number} page_size - Tamaño de página aplicado.
 * @property {number} total - Total de registros que cumplen el filtro.
 *
 * @example
 * ```ts
 * const response: GetFaultCatalogResponse = {
 *   data: [],
 *   page_number: 1,
 *   page_size: 10,
 *   total: 25,
 * };
 * ```
 */
export interface GetFaultCatalogResponse {
  data: FaultCatalogDto[];
  page_number: number;
  page_size: number;
  total: number;
}
