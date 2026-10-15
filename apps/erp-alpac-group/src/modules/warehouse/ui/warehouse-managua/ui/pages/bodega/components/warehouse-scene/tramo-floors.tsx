import { memo, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import type { ProcessedTramo3D } from "../../hooks/use-warehouse-3d-data";
import type { ProcessedPosition3D } from "../../types/warehouse-3d.types";
import { TRAMO_STRIP_COLOR } from "../../types/warehouse-3d.types";
import { FloorBlueprintBadge } from "./floor-blueprint-badge";
import {
  resolveRackStatus,
  RACK_STATUS_COLORS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";

interface TramoFloorsProps {
  tramos: ProcessedTramo3D[];
}

const RAIL_T = 0.08;
const RAIL_H = 0.04;

// Geometría y materiales singleton compartidos para todos los tramos (cero duplicación en VRAM)
const POSITION_BOX_GEOMETRY = new THREE.BoxGeometry(1, 1, 1);
const POSITION_VISUAL_MATERIAL = new THREE.MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.45,
  depthWrite: false,
});
const POSITION_HITBOX_MATERIAL = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

const TramoPositionSlot = memo(function TramoPositionInstances({
  positions,
  isInteractive,
}: {
  positions: ProcessedPosition3D[];
  isInteractive: boolean;
}) {
  const visualRef = useRef<THREE.InstancedMesh>(null);
  const hitboxRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const invalidate = useThree((state) => state.invalidate);
  const selectedPosition = useBodegaViewerStore((s) => s.selectedPosition);
  const isPreselectionMode = useBodegaViewerStore((s) => s.isPreselectionMode);
  const preselectedPositions = useBodegaViewerStore((s) => s.preselectedPositions);
  const togglePreselectPosition = useBodegaViewerStore((s) => s.togglePreselectPosition);
  const selectPosition = useBodegaViewerStore((s) => s.selectPosition);
  const setHoveredPosition = useBodegaViewerStore((s) => s.setHoveredPosition);

  useLayoutEffect(() => {
    const mesh = visualRef.current;
    if (!mesh) return;

    positions.forEach((pos, index) => {
      const isPreselected = preselectedPositions.some(
        (selected) => selected.positionId === pos.positionId,
      );
      const isSelected = selectedPosition?.positionId === pos.positionId;
      const resolved = resolveRackStatus(pos.status);
      const statusKey = (resolved?.textValue ??
        (pos.status ? String(pos.status) : "Available")) as keyof typeof RACK_STATUS_COLORS;
      const color = isPreselected
        ? "#10b981"
        : isSelected
          ? "#00f0ff"
          : RACK_STATUS_COLORS[statusKey] ?? "#4ade80";
      const width = Math.max(pos.width, 0.8);
      const depth = Math.max(pos.depth, 0.8);
      dummy.position.set(pos.localX, pos.localY - 0.06, pos.localZ);
      dummy.scale.set(width * 0.94, isPreselected ? 0.12 : 0.05, depth * 0.94);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, new THREE.Color(color));
      if (hitboxRef.current) {
        hitboxRef.current.setMatrixAt(index, dummy.matrix);
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();

    if (hitboxRef.current) {
      hitboxRef.current.instanceMatrix.needsUpdate = true;
      hitboxRef.current.computeBoundingSphere();
    }

    invalidate();
  }, [dummy, invalidate, positions, preselectedPositions, selectedPosition]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const pos = positions[event.instanceId];
    if (!pos) return;
    const resolved = resolveRackStatus(pos.status);
    const statusKey = resolved?.textValue ?? (pos.isOccupied ? "Occupied" : "Available");
    const isAvailable = statusKey === "Available" && !pos.isOccupied;
    if (isPreselectionMode) {
      if (isAvailable) togglePreselectPosition(pos);
    } else {
      selectPosition(pos);
    }
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (event.instanceId === undefined) return;
    event.stopPropagation();
    setHoveredPosition(positions[event.instanceId] ?? null);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHoveredPosition(null);
    document.body.style.cursor = "auto";
  };

  return (
    <>
      <instancedMesh
        ref={visualRef}
        args={[POSITION_BOX_GEOMETRY, POSITION_VISUAL_MATERIAL, positions.length]}
      />
      {isInteractive && (
        <instancedMesh
          ref={hitboxRef}
          args={[POSITION_BOX_GEOMETRY, POSITION_HITBOX_MATERIAL, positions.length]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      )}
    </>
  );
});

function TramoItem({
  tramo,
}: {
  tramo: ProcessedTramo3D;
}) {
  const showPositions = useBodegaViewerStore((s) => s.showPositions);
  const isPreselectionMode = useBodegaViewerStore((s) => s.isPreselectionMode);
  const preselectedPositions = useBodegaViewerStore((s) => s.preselectedPositions);

  const hasPreselectedInTramo = Boolean(
    tramo.positions?.some((pos) =>
      preselectedPositions.some((p) => p.positionId === pos.positionId),
    ),
  );

  const isGoingToSelectPositions =
    isPreselectionMode || showPositions || hasPreselectedInTramo;

  const resolved = resolveRackStatus(tramo.status);
  const statusKey = (resolved?.textValue ??
    "Available") as keyof typeof RACK_STATUS_COLORS;
  const statusColor = RACK_STATUS_COLORS[statusKey] ?? "#4ade80";

  // Dimensiones del tramo
  const w = tramo.width;
  const l = tramo.length;

  const railColor = TRAMO_STRIP_COLOR;

  const badgeW = Math.min(Math.max(w * 0.75, 1.4), 2.2);
  const badgeH = badgeW * 0.28;

  const hasIndividualPositions =
    tramo.positions && tramo.positions.length > 0;

  return (
    <group
      position={[tramo.cx, 0, tramo.cz]}
      rotation={[0, tramo.rotationY, 0]}
    >
      {/* 1. Suelo del tramo con fondo sutil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.8}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* 2. Rieles amarillos (#e8d98a) delimitadores de tramo en el suelo (3D) */}
      <group>
        {/* Riel Frontal */}
        <mesh position={[0, RAIL_H / 2, -l / 2 + RAIL_T / 2]} receiveShadow>
          <boxGeometry args={[w, RAIL_H, RAIL_T]} />
          <meshStandardMaterial
            color={railColor}
            roughness={0.7}
            metalness={0.04}
            toneMapped={false}
          />
        </mesh>
        {/* Riel Trasero */}
        <mesh position={[0, RAIL_H / 2, l / 2 - RAIL_T / 2]} receiveShadow>
          <boxGeometry args={[w, RAIL_H, RAIL_T]} />
          <meshStandardMaterial
            color={railColor}
            roughness={0.7}
            metalness={0.04}
            toneMapped={false}
          />
        </mesh>
        {/* Riel Lateral Izquierdo */}
        <mesh
          position={[-w / 2 + RAIL_T / 2, RAIL_H / 2, 0]}
          receiveShadow
        >
          <boxGeometry
            args={[RAIL_T, RAIL_H, Math.max(0.05, l - RAIL_T * 2)]}
          />
          <meshStandardMaterial
            color={railColor}
            roughness={0.7}
            metalness={0.04}
            toneMapped={false}
          />
        </mesh>
        {/* Riel Lateral Derecho */}
        <mesh
          position={[w / 2 - RAIL_T / 2, RAIL_H / 2, 0]}
          receiveShadow
        >
          <boxGeometry
            args={[RAIL_T, RAIL_H, Math.max(0.05, l - RAIL_T * 2)]}
          />
          <meshStandardMaterial
            color={railColor}
            roughness={0.7}
            metalness={0.04}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 3. Placa con código de tramo y medidas */}
      <FloorBlueprintBadge
        title={tramo.code}
        subtitle={`${tramo.raw?.width ?? w}m × ${tramo.raw?.length ?? l}m`}
        position={[0, 0.025, 0]}
        size={[badgeW, badgeH]}
        accentColor={statusColor}
        textColor="#cbd5e1"
        subTextColor="#64748b"
        opacity={0.65}
      />

      {/* 4. Posiciones individuales con coordenadas exactas */}
      {hasIndividualPositions && isGoingToSelectPositions ? (
        <group>
          <TramoPositionSlot
            positions={tramo.positions}
            isInteractive={isPreselectionMode || showPositions}
          />
        </group>
      ) : null}

    </group>
  );
}

export function TramoFloors({ tramos }: TramoFloorsProps) {
  if (tramos.length === 0) return null;

  return (
    <group>
      {tramos.map((tramo) => (
        <TramoItem
          key={`tramo-3d-${tramo.tramoId}`}
          tramo={tramo}
        />
      ))}
    </group>
  );
}
