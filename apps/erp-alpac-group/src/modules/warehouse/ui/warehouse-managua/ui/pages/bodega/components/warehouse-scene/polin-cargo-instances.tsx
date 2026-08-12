import { useLayoutEffect, useMemo, useRef } from "react";
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

  useLayoutEffect(() => {
    const polinMesh = polinesRef.current;
    if (polinMesh && polines.length > 0) {
      polines.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(p.w, p.h, p.d);
        dummy.updateMatrix();
        polinMesh.setMatrixAt(i, dummy.matrix);
      });
      polinMesh.instanceMatrix.needsUpdate = true;
      polinMesh.computeBoundingSphere();
    }

    const boxMesh = boxesRef.current;
    if (boxMesh && boxes.length > 0) {
      boxes.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z);
        dummy.scale.set(b.w, b.h, b.d);
        dummy.updateMatrix();
        boxMesh.setMatrixAt(i, dummy.matrix);
      });
      boxMesh.instanceMatrix.needsUpdate = true;
      boxMesh.computeBoundingSphere();
    }

    invalidate();
  }, [polines, boxes, dummy, invalidate]);

  if (polines.length === 0) return null;

  return (
    <group>
      <instancedMesh
        key={`polines-${polines.length}`}
        ref={polinesRef}
        args={[polinAsset.geometry, polinAsset.material, polines.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => {}}
      />
      {boxes.length > 0 ? (
        <instancedMesh
          key={`boxes-${boxes.length}`}
          ref={boxesRef}
          args={[boxAsset.geometry, boxAsset.material, boxes.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
          raycast={() => {}}
        />
      ) : null}
    </group>
  );
}
