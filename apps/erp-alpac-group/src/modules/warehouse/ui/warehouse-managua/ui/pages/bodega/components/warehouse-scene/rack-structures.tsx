import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RackTramo } from "../../types/warehouse-3d.types";
import {
  LEVEL_HEIGHT,
  RACK_FRAME_HEIGHT,
} from "../../types/warehouse-3d.types";

interface RackStructuresProps {
  tramos: RackTramo[];
}

const POST_W = 0.12;

type Part = {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
};

function buildParts(tramos: RackTramo[]): Part[] {
  const parts: Part[] = [];

  for (const tramo of tramos) {
    const hw = (tramo.size.width * 0.94) / 2;
    const hd = (tramo.size.depth * 0.94) / 2;
    const { x, z } = tramo.position;
    const corners: [number, number][] = [
      [x - hw, z - hd],
      [x + hw, z - hd],
      [x - hw, z + hd],
      [x + hw, z + hd],
    ];

    for (const [cx, cz] of corners) {
      parts.push({
        x: cx,
        y: RACK_FRAME_HEIGHT / 2,
        z: cz,
        sx: POST_W,
        sy: RACK_FRAME_HEIGHT,
        sz: POST_W,
      });
    }

    for (const level of [1, 2]) {
      const by = LEVEL_HEIGHT * level;
      parts.push({
        x,
        y: by,
        z: z - hd,
        sx: tramo.size.width * 0.94,
        sy: POST_W,
        sz: POST_W,
      });
      parts.push({
        x,
        y: by,
        z: z + hd,
        sx: tramo.size.width * 0.94,
        sy: POST_W,
        sz: POST_W,
      });
      parts.push({
        x: x - hw,
        y: by,
        z,
        sx: POST_W,
        sy: POST_W,
        sz: tramo.size.depth * 0.94,
      });
      parts.push({
        x: x + hw,
        y: by,
        z,
        sx: POST_W,
        sy: POST_W,
        sz: tramo.size.depth * 0.94,
      });
    }
  }

  return parts;
}

export function RackStructures({ tramos }: RackStructuresProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const parts = useMemo(() => buildParts(tramos), [tramos]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    parts.forEach((part, i) => {
      dummy.position.set(part.x, part.y, part.z);
      dummy.scale.set(part.sx, part.sy, part.sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.computeBoundingBox();
    invalidate();
  }, [parts, dummy, invalidate]);

  if (parts.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, parts.length]}
      castShadow
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.65} roughness={0.35} />
    </instancedMesh>
  );
}
