import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type {
  FloorTramo,
  OccupancyMap,
  RackTramo,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import {
  useCardboardBoxAsset,
  usePolinAsset,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/hooks/use-warehouse-gltf-assets";
import { buildAllPolinCargo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/polin-cargo-layout";

interface PolinCargoInstancesProps {
  floorTramos: FloorTramo[];
  rackTramos: RackTramo[];
  occupancy: OccupancyMap;
}

export function PolinCargoInstances({
  floorTramos,
  rackTramos,
  occupancy,
}: PolinCargoInstancesProps) {
  const polinAsset = usePolinAsset();
  const boxAsset = useCardboardBoxAsset();
  const polinesRef = useRef<THREE.InstancedMesh>(null);
  const boxesRef = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { polines, boxes } = useMemo(
    () => buildAllPolinCargo(floorTramos, rackTramos, occupancy),
    [floorTramos, rackTramos, occupancy],
  );
  console.log("polines", polines, "boxes", boxes);
  useEffect(() => {
    const polinMesh = polinesRef.current;
    const boxMesh = boxesRef.current;
    if (!polinMesh || !boxMesh) return;

    polines.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      if (p.visible) {
        dummy.scale.set(p.w, p.h, p.d);
      } else {
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      polinMesh.setMatrixAt(i, dummy.matrix);
    });

    boxes.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z);
      if (b.visible) {
        dummy.scale.set(b.w, b.h, b.d);
      } else {
        dummy.scale.set(0, 0, 0);
      }
      dummy.updateMatrix();
      boxMesh.setMatrixAt(i, dummy.matrix);
    });

    polinMesh.instanceMatrix.needsUpdate = true;
    boxMesh.instanceMatrix.needsUpdate = true;
    polinMesh.computeBoundingSphere();
    boxMesh.computeBoundingSphere();
    invalidate();
  }, [polines, boxes, dummy, invalidate]);

  if (polines.length === 0) return null;

  return (
    <group>
      <instancedMesh
        ref={polinesRef}
        args={[polinAsset.geometry, polinAsset.material, polines.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => {}}
      />
      <instancedMesh
        ref={boxesRef}
        args={[boxAsset.geometry, boxAsset.material, boxes.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => {}}
      />
    </group>
  );
}
