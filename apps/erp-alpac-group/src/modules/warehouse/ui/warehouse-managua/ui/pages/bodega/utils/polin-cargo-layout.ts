import type { ProcessedRack3D, ProcessedTramo3D } from "../hooks/use-warehouse-3d-data";
import type { ProcessedPosition3D } from "../types/warehouse-3d.types";
import { resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";

export type PolinMeshInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  position?: ProcessedPosition3D;
  positionId?: string;
};

export type CargoBoxInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  position?: ProcessedPosition3D;
  positionId?: string;
};

export type StatusMarkerInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  status: "UnderMaintenance" | "Blocked" | "Reserved";
  position?: ProcessedPosition3D;
  positionId?: string;
};

export type PolinCargoBuild = {
  polines: PolinMeshInstance[];
  boxes: CargoBoxInstance[];
  statusMarkers: StatusMarkerInstance[];
};

const PALLET_H = 0.14;
const PALLET_W = 1.0;
const PALLET_D = 1.2;

const BOX_W = 0.85;
const BOX_D = 0.85;
const BOX_H = 0.85;

export function buildDynamicWarehouseCargo(
  racks: ProcessedRack3D[] = [],
  tramos: ProcessedTramo3D[] = [],
): PolinCargoBuild {
  const polines: PolinMeshInstance[] = [];
  const boxes: CargoBoxInstance[] = [];
  const statusMarkers: StatusMarkerInstance[] = [];

  // 1. Carga y estados en estructuras de Racks
  (racks ?? []).forEach((rack) => {
    const { isRotated90, levels } = rack;
    const numLevels = Math.max(levels?.length ?? 0, 1);

    for (let l = 0; l < numLevels; l++) {
      const levelData = levels[l];

      if (levelData?.positions && levelData.positions.length > 0) {
        levelData.positions.forEach((pos) => {
          const resolvedPos = resolveRackStatus(pos.status);
          const posKey = resolvedPos?.textValue ?? (pos.isOccupied ? "Occupied" : "Available");
          const pw = isRotated90 ? PALLET_D : PALLET_W;
          const pd = isRotated90 ? PALLET_W : PALLET_D;
          const bw = isRotated90 ? BOX_D : BOX_W;
          const bd = isRotated90 ? BOX_W : BOX_D;

          if (posKey === "Occupied" || (pos.isOccupied && posKey !== "Reserved")) {
            polines.push({
              x: pos.worldX,
              y: pos.worldY + PALLET_H / 2,
              z: pos.worldZ,
              w: pw,
              h: PALLET_H,
              d: pd,
              position: pos,
              positionId: pos.positionId,
            });

            boxes.push({
              x: pos.worldX,
              y: pos.worldY + PALLET_H + BOX_H / 2,
              z: pos.worldZ,
              w: bw,
              h: BOX_H,
              d: bd,
              position: pos,
              positionId: pos.positionId,
            });
          } else if (
            posKey === "UnderMaintenance" ||
            posKey === "Blocked" ||
            posKey === "Reserved"
          ) {
            statusMarkers.push({
              x: pos.worldX,
              y: posKey === "Reserved" ? pos.worldY + PALLET_H + 0.18 : pos.worldY + 0.25,
              z: pos.worldZ,
              w: posKey === "Reserved" ? pw * 0.35 : pw * 0.92,
              h: posKey === "Reserved" ? 0.18 : 0.5,
              d: posKey === "Reserved" ? pd * 0.35 : pd * 0.92,
              status: posKey as "UnderMaintenance" | "Blocked" | "Reserved",
              position: pos,
              positionId: pos.positionId,
            });
          }
        });
      }
    }
  });

  // 2. Carga y estados en Tramos (Lots a nivel de suelo)
  (tramos ?? []).forEach((tramo) => {
    if (tramo.positions && tramo.positions.length > 0) {
      tramo.positions.forEach((pos) => {
        const resolvedPos = resolveRackStatus(pos.status);
        const posKey =
          resolvedPos?.textValue ??
          (pos.isOccupied ? "Occupied" : "Available");

        const pw = Math.max(pos.width || PALLET_W, 0.8);
        const pd = Math.max(pos.depth || PALLET_D, 0.8);
        const bw = Math.min(pw * 0.85, BOX_W);
        const bd = Math.min(pd * 0.85, BOX_D);

        if (posKey === "Occupied" || (pos.isOccupied && posKey !== "Reserved")) {
          polines.push({
            x: pos.worldX,
            y: pos.worldY + PALLET_H / 2,
            z: pos.worldZ,
            w: pw * 0.9,
            h: PALLET_H,
            d: pd * 0.9,
            position: pos,
            positionId: pos.positionId,
          });

          boxes.push({
            x: pos.worldX,
            y: pos.worldY + PALLET_H + BOX_H / 2,
            z: pos.worldZ,
            w: bw,
            h: BOX_H,
            d: bd,
            position: pos,
            positionId: pos.positionId,
          });
        } else if (
          posKey === "UnderMaintenance" ||
          posKey === "Blocked" ||
          posKey === "Reserved"
        ) {
          statusMarkers.push({
            x: pos.worldX,
            y: posKey === "Reserved" ? pos.worldY + PALLET_H + 0.18 : pos.worldY + 0.3,
            z: pos.worldZ,
            w: posKey === "Reserved" ? pw * 0.35 : pw * 0.9,
            h: posKey === "Reserved" ? 0.18 : 0.55,
            d: posKey === "Reserved" ? pd * 0.35 : pd * 0.9,
            status: posKey as "UnderMaintenance" | "Blocked" | "Reserved",
            position: pos,
            positionId: pos.positionId,
          });
        }
      });
    }
  });

  return { polines, boxes, statusMarkers };
}

export const buildDynamicRacksPolinCargo = (
  racks: ProcessedRack3D[],
  tramos: ProcessedTramo3D[] = [],
): PolinCargoBuild => buildDynamicWarehouseCargo(racks, tramos);
