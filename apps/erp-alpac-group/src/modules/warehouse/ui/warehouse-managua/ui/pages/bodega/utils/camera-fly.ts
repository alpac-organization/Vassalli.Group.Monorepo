import type { Vec3 } from "../types/warehouse-3d.types";
import type { CameraFlyTo } from "../stores/use-bodega-viewer-store";
import type { ProcessedRack3D, BuildingDimensions3D, ProcessedSection3D } from "../hooks/use-warehouse-3d-data";

export function getWarehouseCenter(building: { width: number; depth: number }): Vec3 {
  return {
    x: building.width / 2,
    y: 0,
    z: building.depth / 2,
  };
}

export function getDynamicRackFlyTo(
  rack: ProcessedRack3D,
  level?: number | null,
  sections?: ProcessedSection3D[],
): CameraFlyTo {
  const standOff = Math.max(rack.renderWidth, rack.renderDepth) * 0.7 + 3.8;
  const numLevels = Math.max(rack.levelNumber || 1, 1);
  const tierH = rack.tierHeight || (rack.renderHeight / (numLevels + 1));

  const targetY = level
    ? rack.cy + (level + 0.5) * tierH
    : rack.cy + rack.renderHeight * 0.5;

  const target: Vec3 = {
    x: rack.cx,
    y: targetY,
    z: rack.cz,
  };

  // Determinar la orientación del pasillo de acceso para el rack.
  // En estanterías organizadas en naves industriales (ej. SR-01 y SR-02):
  // La cámara debe ubicarse en el pasillo de acceso frontal del rack enfocado,
  // y nunca del lado de la sección vecina trasera ni atravesando el fondo.
  let aisleSide = rack.aisleSide;

  if (aisleSide === undefined) {
    if (sections && sections.length > 1) {
      const currentSec = sections.find((s) => s.sectionId === rack.sectionId);
      if (currentSec) {
        if (rack.isRotated90) {
          // Racks verticales: si hay sección vecina en +X, el pasillo está en -X (-1)
          const hasNeighborOnRight = sections.some(
            (s) => s.sectionId !== currentSec.sectionId && s.x > currentSec.x,
          );
          aisleSide = hasNeighborOnRight ? -1 : 1;
        } else {
          // Racks horizontales: si hay sección vecina en +Z, el pasillo está en -Z (-1)
          const hasNeighborBehind = sections.some(
            (s) => s.sectionId !== currentSec.sectionId && s.z > currentSec.z,
          );
          aisleSide = hasNeighborBehind ? -1 : 1;
        }
      }
    }

    if (aisleSide === undefined && rack.sectionCode) {
      const match = rack.sectionCode.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        aisleSide = num % 2 === 1 ? -1 : 1;
      }
    }

    if (aisleSide === undefined) {
      aisleSide = -1;
    }
  }

  let posX = rack.cx;
  let posZ = rack.cz;

  if (rack.isRotated90) {
    // Para racks verticales, el pasillo de acceso se encuentra a lo largo del eje X
    posX = rack.cx + aisleSide * standOff;
    // Ligero ángulo de perspectiva en Z para apreciar la volumetría de la estantería y los polines
    posZ = rack.cz + Math.min(rack.renderDepth * 0.22, 0.7);
  } else {
    // Para racks horizontales, el pasillo de acceso se encuentra a lo largo del eje Z
    posZ = rack.cz + aisleSide * standOff;
    // Ligero ángulo de perspectiva en X para apreciar la volumetría de la estantería y los polines
    posX = rack.cx + Math.min(rack.renderWidth * 0.22, 0.7);
  }

  const posY = Math.max(targetY + 1.2, 2.5);

  return {
    position: { x: posX, y: posY, z: posZ },
    target,
    minDistance: 0.5,
  };
}

export function getSectionFlyTo(section: ProcessedSection3D): CameraFlyTo {
  const centerX = section.x + section.width / 2;
  const centerZ = section.z + section.depth / 2;
  const span = Math.max(section.width, section.depth);

  return {
    position: {
      x: centerX + span * 0.45,
      y: Math.max(span * 0.6, 3.5),
      z: centerZ + span * 0.55,
    },
    target: { x: centerX, y: 0.2, z: centerZ },
    minDistance: 0.5,
  };
}

export function getDynamicOverviewFlyTo(building: BuildingDimensions3D): CameraFlyTo {
  const center = getWarehouseCenter(building);
  const maxSpan = Math.max(building.width, building.depth);

  return {
    position: {
      x: center.x + maxSpan * 0.45,
      y: Math.max(maxSpan * 0.4, 15),
      z: center.z + maxSpan * 0.55,
    },
    target: { x: center.x, y: 0.5, z: center.z },
    minDistance: 0.5,
  };
}
