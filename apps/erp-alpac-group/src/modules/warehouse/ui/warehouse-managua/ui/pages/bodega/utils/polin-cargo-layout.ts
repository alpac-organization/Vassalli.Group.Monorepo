import type { ProcessedRack3D } from "../hooks/use-warehouse-3d-data";
import { resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";

export type PolinMeshInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export type CargoBoxInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

export type StatusMarkerInstance = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  status: "UnderMaintenance" | "Blocked" | "Reserved";
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

export function buildDynamicRacksPolinCargo(
  racks: ProcessedRack3D[],
): PolinCargoBuild {
  const polines: PolinMeshInstance[] = [];
  const boxes: CargoBoxInstance[] = [];
  const statusMarkers: StatusMarkerInstance[] = [];

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
    // Usar la separación real entre niveles (tierHeight)
    const tierH = rack.tierHeight || renderHeight / (numLevels + 1);

    // Si está rotado 90°, el largo corre por el eje Z; si no, por el eje X
    const lengthSpan = isRotated90 ? renderDepth : renderWidth;

    for (let l = 0; l < numLevels; l++) {
      const shelfY = cy + (l + 1) * tierH + 0.04;
      const levelData = levels[l];

      // Cuántos polines/posiciones soporta este nivel: viene de max_pulleys o total_positions
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

        // Posición individual en la estantería (si existe en positions)
        const posDto = levelData?.positions ? levelData.positions[p] : undefined;

        let effectivePosStatus: string;
        if (posDto) {
          const r = resolveRackStatus(posDto.status);
          effectivePosStatus =
            r?.textValue ??
            (posDto.current_stock?.product_name ? "Occupied" : "Available");
        } else {
          effectivePosStatus =
            statusKey === "Occupied"
              ? p < levelOccupied
                ? "Occupied"
                : "Available"
              : statusKey;
        }

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
            y: shelfY + 0.28,
            z: posZ,
            w: pw * 0.92,
            h: 0.5,
            d: pd * 0.92,
            status: effectivePosStatus as "UnderMaintenance" | "Blocked" | "Reserved",
          });
        }
      }
    }
  });

  return { polines, boxes, statusMarkers };
}
