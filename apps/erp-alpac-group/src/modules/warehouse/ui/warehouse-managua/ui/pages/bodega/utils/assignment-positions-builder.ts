import type {
  AssignPositionsBody,
  SectionPositionsPayload,
  TramoPositionPayload,
  RackPositionPayload,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assign-positions";
import type { ProcessedPosition3D } from "../types/warehouse-3d.types";

/**
 * Agrupa las posiciones 3D seleccionadas por section_id, y dentro de cada sección
 * divide entre tramos y racks con sus respectivos block_id y position_ids,
 * construyendo el cuerpo exacto requerido por el endpoint assignment-positions.
 */
export function buildAssignPositionsPayload(
  positions: ProcessedPosition3D[],
): AssignPositionsBody {
  const sectionMap = new Map<
    string,
    {
      tramosMap: Map<string, string[]>;
      racksMap: Map<string, string[]>;
    }
  >();

  for (const pos of positions) {
    if (!pos.sectionId || !pos.blockId || !pos.positionId) continue;

    let secEntry = sectionMap.get(pos.sectionId);
    if (!secEntry) {
      secEntry = {
        tramosMap: new Map<string, string[]>(),
        racksMap: new Map<string, string[]>(),
      };
      sectionMap.set(pos.sectionId, secEntry);
    }

    if (pos.structureType === "tramo") {
      const existing = secEntry.tramosMap.get(pos.blockId) ?? [];
      if (!existing.includes(pos.positionId)) {
        existing.push(pos.positionId);
      }
      secEntry.tramosMap.set(pos.blockId, existing);
    } else {
      const existing = secEntry.racksMap.get(pos.blockId) ?? [];
      if (!existing.includes(pos.positionId)) {
        existing.push(pos.positionId);
      }
      secEntry.racksMap.set(pos.blockId, existing);
    }
  }

  const sections: SectionPositionsPayload[] = [];
  for (const [sectionId, data] of sectionMap.entries()) {
    const tramos: TramoPositionPayload[] = [];
    for (const [blockId, positionIds] of data.tramosMap.entries()) {
      tramos.push({
        block_id: blockId,
        position_ids: positionIds,
      });
    }

    const racks: RackPositionPayload[] = [];
    for (const [blockId, positionIds] of data.racksMap.entries()) {
      racks.push({
        block_id: blockId,
        position_ids: positionIds,
      });
    }

    if (tramos.length > 0) {
      sections.push({
        section_id: sectionId,
        tramos,
        racks: [],
      });
    }

    if (racks.length > 0) {
      sections.push({
        section_id: sectionId,
        tramos: [],
        racks,
      });
    }
  }

  return { sections };
}

