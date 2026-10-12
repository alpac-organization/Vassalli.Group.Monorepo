import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type {
  ProcessedRack3D,
  ProcessedTramo3D,
} from "../../hooks/use-warehouse-3d-data";
import {
  useCardboardBoxAsset,
  usePolinAsset,
} from "../../hooks/use-warehouse-gltf-assets";
import { buildDynamicWarehouseCargo } from "../../utils/polin-cargo-layout";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";
import { resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import type { ProcessedPosition3D } from "../../types/warehouse-3d.types";

interface PolinCargoInstancesProps {
  racks: ProcessedRack3D[];
  tramos?: ProcessedTramo3D[];
}

export function PolinCargoInstances({
  racks = [],
  tramos = [],
}: PolinCargoInstancesProps) {
  const polinAsset = usePolinAsset();
  const boxAsset = useCardboardBoxAsset();
  const polinesRef = useRef<THREE.InstancedMesh>(null);
  const boxesRef = useRef<THREE.InstancedMesh>(null);
  const maintenanceRef = useRef<THREE.InstancedMesh>(null);
  const blockedRef = useRef<THREE.InstancedMesh>(null);
  const reservedRef = useRef<THREE.InstancedMesh>(null);

  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { polines, boxes, statusMarkers } = useMemo(
    () => buildDynamicWarehouseCargo(racks, tramos),
    [racks, tramos],
  );

  const maintenanceMarkers = useMemo(
    () => statusMarkers.filter((m) => m.status === "UnderMaintenance"),
    [statusMarkers],
  );
  const blockedMarkers = useMemo(
    () => statusMarkers.filter((m) => m.status === "Blocked"),
    [statusMarkers],
  );
  const reservedMarkers = useMemo(
    () => statusMarkers.filter((m) => m.status === "Reserved"),
    [statusMarkers],
  );
  const markerGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const maintenanceMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const blockedMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const reservedMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Animación continua de pulsación para estados de advertencia
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (maintenanceMatRef.current) {
      maintenanceMatRef.current.emissiveIntensity = 0.25 + 0.35 * Math.sin(t * 3.5);
    }
    if (blockedMatRef.current) {
      blockedMatRef.current.emissiveIntensity = 0.25 + 0.35 * Math.sin(t * 2.8);
    }
    if (reservedMatRef.current) {
      reservedMatRef.current.emissiveIntensity = 0.25 + 0.3 * Math.sin(t * 2);
    }
  });

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

    const mMesh = maintenanceRef.current;
    if (mMesh && maintenanceMarkers.length > 0) {
      maintenanceMarkers.forEach((m, i) => {
        dummy.position.set(m.x, m.y, m.z);
        dummy.scale.set(m.w, m.h, m.d);
        dummy.updateMatrix();
        mMesh.setMatrixAt(i, dummy.matrix);
      });
      mMesh.instanceMatrix.needsUpdate = true;
      mMesh.computeBoundingSphere();
    }

    const bMesh = blockedRef.current;
    if (bMesh && blockedMarkers.length > 0) {
      blockedMarkers.forEach((m, i) => {
        dummy.position.set(m.x, m.y, m.z);
        dummy.scale.set(m.w, m.h, m.d);
        dummy.updateMatrix();
        bMesh.setMatrixAt(i, dummy.matrix);
      });
      bMesh.instanceMatrix.needsUpdate = true;
      bMesh.computeBoundingSphere();
    }

    const rMesh = reservedRef.current;
    if (rMesh && reservedMarkers.length > 0) {
      reservedMarkers.forEach((m, i) => {
        dummy.position.set(m.x, m.y, m.z);
        dummy.scale.set(m.w, m.h, m.d);
        dummy.updateMatrix();
        rMesh.setMatrixAt(i, dummy.matrix);
      });
      rMesh.instanceMatrix.needsUpdate = true;
      rMesh.computeBoundingSphere();
    }

    invalidate();
  }, [
    polines,
    boxes,
    maintenanceMarkers,
    blockedMarkers,
    reservedMarkers,
    dummy,
    invalidate,
  ]);

  const hasAnyItem =
    polines.length > 0 ||
    boxes.length > 0 ||
    maintenanceMarkers.length > 0 ||
    blockedMarkers.length > 0 ||
    reservedMarkers.length > 0;

  const selectPosition = useBodegaViewerStore((s) => s.selectPosition);
  const setHoveredPosition = useBodegaViewerStore((s) => s.setHoveredPosition);
  const isPreselectionMode = useBodegaViewerStore((s) => s.isPreselectionMode);
  const togglePreselectPosition = useBodegaViewerStore(
    (s) => s.togglePreselectPosition,
  );

  const handleInstanceClick = (
    e: ThreeEvent<MouseEvent>,
    list: { position?: ProcessedPosition3D }[],
  ) => {
    e.stopPropagation();
    if (e.instanceId === undefined) return;
    const target = list[e.instanceId];
    if (!target?.position) return;

    if (isPreselectionMode) {
      const resolved = resolveRackStatus(target.position.status);
      const statusKey =
        resolved?.textValue ??
        (target.position.isOccupied ? "Occupied" : "Available");
      const isAvailable =
        statusKey === "Available" && !target.position.isOccupied;
      if (!isAvailable) {
        return;
      }
      togglePreselectPosition(target.position);
    } else {
      selectPosition(target.position);
    }
  };

  const handleInstancePointerOver = (
    e: ThreeEvent<PointerEvent>,
    list: { position?: ProcessedPosition3D }[],
  ) => {
    e.stopPropagation();
    if (e.instanceId === undefined) return;
    const target = list[e.instanceId];
    if (!target?.position) return;

    setHoveredPosition(target.position);
    document.body.style.cursor = "pointer";
  };

  const handleInstancePointerOut = () => {
    setHoveredPosition(null);
    document.body.style.cursor = "auto";
  };

  if (!hasAnyItem) return null;

  return (
    <group>
      {/* Polines de madera */}
      {polines.length > 0 && (
        <instancedMesh
          key={`polines-${polines.length}`}
          ref={polinesRef}
          args={[polinAsset.geometry, polinAsset.material, polines.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
          onClick={(e) => handleInstanceClick(e, polines)}
          onPointerOver={(e) => handleInstancePointerOver(e, polines)}
          onPointerOut={handleInstancePointerOut}
        />
      )}

      {/* Cajas de cartón corrugado */}
      {boxes.length > 0 && (
        <instancedMesh
          key={`boxes-${boxes.length}`}
          ref={boxesRef}
          args={[boxAsset.geometry, boxAsset.material, boxes.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
          onClick={(e) => handleInstanceClick(e, boxes)}
          onPointerOver={(e) => handleInstancePointerOver(e, boxes)}
          onPointerOut={handleInstancePointerOut}
        />
      )}

      {/* Marcadores de En Mantenimiento con destello ámbar */}
      {maintenanceMarkers.length > 0 && (
        <instancedMesh
          key={`maintenance-${maintenanceMarkers.length}`}
          ref={maintenanceRef}
          args={[markerGeometry, undefined, maintenanceMarkers.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
          onClick={(e) => handleInstanceClick(e, maintenanceMarkers)}
          onPointerOver={(e) => handleInstancePointerOver(e, maintenanceMarkers)}
          onPointerOut={handleInstancePointerOut}
        >
          <meshStandardMaterial
            ref={maintenanceMatRef}
            color="#fbbf24"
            roughness={0.35}
            metalness={0.2}
            emissive="#d97706"
            emissiveIntensity={0.3}
          />
        </instancedMesh>
      )}

      {/* Marcadores de Bloqueado con destello rojo */}
      {blockedMarkers.length > 0 && (
        <instancedMesh
          key={`blocked-${blockedMarkers.length}`}
          ref={blockedRef}
          args={[markerGeometry, undefined, blockedMarkers.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
          onClick={(e) => handleInstanceClick(e, blockedMarkers)}
          onPointerOver={(e) => handleInstancePointerOver(e, blockedMarkers)}
          onPointerOut={handleInstancePointerOut}
        >
          <meshStandardMaterial
            ref={blockedMatRef}
            color="#ef4444"
            roughness={0.35}
            metalness={0.2}
            emissive="#b91c1c"
            emissiveIntensity={0.3}
          />
        </instancedMesh>
      )}

      {/* Indicador elevado de una posición reservada para descargue */}
      {reservedMarkers.length > 0 && (
        <instancedMesh
          key={`reserved-${reservedMarkers.length}`}
          ref={reservedRef}
          args={[markerGeometry, undefined, reservedMarkers.length]}
          castShadow
          receiveShadow
          frustumCulled={false}
          onClick={(e) => handleInstanceClick(e, reservedMarkers)}
          onPointerOver={(e) => handleInstancePointerOver(e, reservedMarkers)}
          onPointerOut={handleInstancePointerOut}
        >
          <meshStandardMaterial
            ref={reservedMatRef}
            color="#c084fc"
            transparent
            opacity={0.85}
            roughness={0.25}
            metalness={0.1}
            emissive="#9333ea"
            emissiveIntensity={0.35}
          />
        </instancedMesh>
      )}

    </group>
  );
}
