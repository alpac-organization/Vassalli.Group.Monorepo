import * as THREE from "three";
import { TRAMO_STRIP_COLOR } from "../types/warehouse-3d.types";

/** Thickness of the pale-yellow border rail (meters). */
export const TRAMO_BORDER_RAIL = 0.1;

export type BorderRail = {
  /** Optional location code for click mapping (floor / rack level). */
  code?: string;
  tramoId?: string;
  /** Rack level index: 0 = piso, 1–2 = rack shelves. */
  level?: number;
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
};

/**
 * Four rails forming a rectangular outline on XZ (no solid fill).
 * Corners overlap slightly so the frame looks continuous.
 */
export function pushRectBorder(
  rails: BorderRail[],
  opts: {
    x: number;
    y: number;
    z: number;
    w: number;
    d: number;
    h: number;
    rail?: number;
    code?: string;
    tramoId?: string;
    level?: number;
  },
) {
  const t = opts.rail ?? TRAMO_BORDER_RAIL;
  const { x, y, z, w, d, h, code, tramoId, level } = opts;
  const meta = { code, tramoId, level };

  // Front / back (along width)
  rails.push({
    ...meta,
    x,
    y,
    z: z - d / 2 + t / 2,
    sx: w,
    sy: h,
    sz: t,
  });
  rails.push({
    ...meta,
    x,
    y,
    z: z + d / 2 - t / 2,
    sx: w,
    sy: h,
    sz: t,
  });
  // Left / right (along depth)
  rails.push({
    ...meta,
    x: x - w / 2 + t / 2,
    y,
    z,
    sx: t,
    sy: h,
    sz: d,
  });
  rails.push({
    ...meta,
    x: x + w / 2 - t / 2,
    y,
    z,
    sx: t,
    sy: h,
    sz: d,
  });
}

export function applyBorderMatrices(
  mesh: THREE.InstancedMesh,
  rails: BorderRail[],
  dummy: THREE.Object3D,
  color: THREE.Color,
  tint = 1,
) {
  color.set(TRAMO_STRIP_COLOR);
  if (tint !== 1) color.multiplyScalar(tint);

  rails.forEach((rail, i) => {
    dummy.position.set(rail.x, rail.y, rail.z);
    dummy.scale.set(rail.sx, rail.sy, rail.sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, color);
  });

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();
}
