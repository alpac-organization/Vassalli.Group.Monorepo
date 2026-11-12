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
    const {
      cx,
      cy,
      cz,
      renderWidth,
      renderDepth,
      renderHeight,
      levels,
      occupiedPositions,
      isRotated90,
    } = rack;

    const numLevels = Math.max(levels.length, 1);
    const tierH = rack.tierHeight || renderHeight / (numLevels + 1);
    const lengthSpan = isRotated90 ? renderDepth : renderWidth;

    for (let l = 0; l < numLevels; l++) {
      const shelfY = cy + (l + 1) * tierH + 0.04;
      const levelData = levels[l];

      const palletsPerLevel = Math.max(
        levelData?.maxPulleys ||
          levelData?.totalPositions ||
          rack.maxPulleys ||
          rack.totalPositions ||
          2,
        1,
      );

      const levelOccupied =
        levelData != null
          ? levelData.occupiedPositions
          : Math.max(
              0,
              Math.min(palletsPerLevel, occupiedPositions - l * palletsPerLevel),
            );

      const resolved = resolveRackStatus(levelData?.status || rack.status);
      const statusKey = resolved?.textValue ?? (levelOccupied > 0 ? "Occupied" : "Available");
      const step = (lengthSpan * 0.92) / palletsPerLevel;

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
      } else {
        for (let p = 0; p < palletsPerLevel; p++) {
          const offset =
            palletsPerLevel === 1
              ? 0
              : -((palletsPerLevel - 1) * step) / 2 + p * step;

          const posX = isRotated90 ? cx : cx + offset;
          const posZ = isRotated90 ? cz + offset : cz;
          const posY = shelfY + PALLET_H / 2;

          const pw = isRotated90 ? PALLET_D : PALLET_W;
          const pd = isRotated90 ? PALLET_W : PALLET_D;
          const bw = isRotated90 ? BOX_D : BOX_W;
          const bd = isRotated90 ? BOX_W : BOX_D;

          const effectivePosStatus =
            statusKey === "Occupied"
              ? p < levelOccupied
                ? "Occupied"
                : "Available"
              : statusKey;

          if (effectivePosStatus === "Occupied") {
            polines.push({
              x: posX,
              y: posY,
              z: posZ,
              w: pw,
              h: PALLET_H,
              d: pd,
            });

            boxes.push({
              x: posX,
              y: posY + PALLET_H / 2 + BOX_H / 2,
              z: posZ,
              w: bw,
              h: BOX_H,
              d: bd,
            });
          } else if (
            effectivePosStatus === "UnderMaintenance" ||
            effectivePosStatus === "Blocked" ||
            effectivePosStatus === "Reserved"
          ) {
            statusMarkers.push({
              x: posX,
              y: effectivePosStatus === "Reserved" ? shelfY + PALLET_H + 0.18 : shelfY + 0.28,
              z: posZ,
              w: effectivePosStatus === "Reserved" ? pw * 0.35 : pw * 0.92,
              h: effectivePosStatus === "Reserved" ? 0.18 : 0.5,
              d: effectivePosStatus === "Reserved" ? pd * 0.35 : pd * 0.92,
              status: effectivePosStatus as "UnderMaintenance" | "Blocked" | "Reserved",
            });
          }
        }
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
    } else {
      // Tramo sin posiciones hijas registradas
      const resolved = resolveRackStatus(tramo.status);
      const statusKey = resolved?.textValue ?? "Available";
      const pw = Math.min(tramo.width * 0.7, 1.2);
      const pd = Math.min(tramo.length * 0.7, 1.2);

      if (statusKey === "Occupied") {
        polines.push({
          x: tramo.cx,
          y: 0.08,
          z: tramo.cz,
          w: pw,
          h: PALLET_H,
          d: pd,
        });
        boxes.push({
          x: tramo.cx,
          y: 0.08 + PALLET_H / 2 + BOX_H / 2,
          z: tramo.cz,
          w: pw * 0.9,
          h: BOX_H,
          d: pd * 0.9,
        });
      } else if (
        statusKey === "UnderMaintenance" ||
        statusKey === "Blocked" ||
        statusKey === "Reserved"
      ) {
        statusMarkers.push({
          x: tramo.cx,
          y: statusKey === "Reserved" ? PALLET_H + 0.18 : 0.3,
          z: tramo.cz,
          w: statusKey === "Reserved" ? pw * 0.35 : pw,
          h: statusKey === "Reserved" ? 0.18 : 0.55,
          d: statusKey === "Reserved" ? pd * 0.35 : pd,
          status: statusKey as "UnderMaintenance" | "Blocked" | "Reserved",
        });
      }
    }
  });

  return { polines, boxes, statusMarkers };
}

export const buildDynamicRacksPolinCargo = (
  racks: ProcessedRack3D[],
  tramos: ProcessedTramo3D[] = [],
): PolinCargoBuild => buildDynamicWarehouseCargo(racks, tramos);
