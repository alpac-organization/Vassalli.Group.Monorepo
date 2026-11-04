import type { FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import type { FaultStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";

/**
 * Referencia compacta al catálogo de falta (listados y detalles).
 *
 * @property {string} fault_catalog_id - Identificador del catálogo.
 * @property {string} code - Código de la falta (ej. `FL-ALP-01`).
 * @property {string} name - Nombre de la falta.
 */
export interface FaultCatalogRefDto {
  fault_catalog_id: string;
  code: string;
  name: string;
}

/**
 * Fila de falta disciplinaria en listados paginados.
 *
 * Los enums (`severity`, `source`, `status`) llegan como clave de {@link FaultSeverityEnumMap} / {@link FaultSourceEnumMap} / {@link FaultStatusEnumMap}.
 *
 * @property {string} fault_id - Identificador de la falta.
 * @property {string} collaborator_id - Identificador del colaborador.
 * @property {string} collaborator_name - Nombre completo del colaborador.
 * @property {FaultCatalogRefDto} fault_catalog - Referencia al tipo de falta.
 * @property {string} occurrence_date - Fecha de ocurrencia (`YYYY-MM-DD`).
 * @property {FaultSeverityEnumMap} severity - Severidad: `Minor` | `Serious` | `VerySerious`.
 * @property {FaultSourceEnumMap} source - Origen: `Manual` | `SystemEscalation` | `BiometricClock`.
 * @property {FaultStatusEnumMap} status - Estado: `Open` | `SanctionApplied` | `Prescribed`.
 *
 * @example
 * ```ts
 * const row: FaultDto = {
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 *   collaborator_id: "ee702059-9d26-4464-9900-c95b616d55c9",
 *   collaborator_name: "Juan Perez Gomez",
 *   fault_catalog: {
 *     fault_catalog_id: "...",
 *     code: "FL-ALP-01",
 *     name: "Llegada tarde",
 *   },
 *   occurrence_date: "2026-10-15",
 *   severity: "Minor",
 *   source: "Manual",
 *   status: "Open",
 * };
 * ```
 */
export interface FaultDto {
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  fault_catalog: FaultCatalogRefDto;
  occurrence_date: string;
  severity: FaultSeverityEnumMap;
  source: FaultSourceEnumMap;
  status: FaultStatusEnumMap;
}

/**
 * Respuesta paginada de faltas disciplinarias.
 *
 * @property {FaultDto[]} data - Lista de faltas.
 * @property {number} page_number - Página actual.
 * @property {number} page_size - Tamaño de página.
 * @property {number} total - Total de registros filtrados.
 */
export interface GetFaultsResponse {
  data: FaultDto[];
  page_number: number;
  page_size: number;
  total: number;
}
