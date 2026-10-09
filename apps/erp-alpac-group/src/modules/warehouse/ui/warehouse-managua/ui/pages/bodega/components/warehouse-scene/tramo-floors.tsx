import { useState } from "react";
import * as THREE from "three";
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

function TramoPositionSlot({
  pos,
  isSelected,
  onSelect,
}: {
  pos: ProcessedPosition3D;
  isSelected: boolean;
  onSelect: (p: ProcessedPosition3D) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isPreselectionMode = useBodegaViewerStore((s) => s.isPreselectionMode);
  const preselectedPositions = useBodegaViewerStore((s) => s.preselectedPositions);
  const togglePreselectPosition = useBodegaViewerStore((s) => s.togglePreselectPosition);
  const isPreselected = preselectedPositions.some(
    (p) => p.positionId === pos.positionId,
  );

  const resolved = resolveRackStatus(pos.status);
  const statusKey = (resolved?.textValue ??
    (pos.status ? String(pos.status) : "Available")) as keyof typeof RACK_STATUS_COLORS;
  const statusColor = RACK_STATUS_COLORS[statusKey] ?? "#4ade80";

  const isAvailable = statusKey === "Available" && !pos.isOccupied;

  const pw = Math.max(pos.width, 0.8);
  const pd = Math.max(pos.depth, 0.8);

  const cellColor = isPreselected
    ? "#10b981"
    : isSelected
      ? "#00f0ff"
      : hovered && isAvailable
        ? "#38bdf8"
        : statusColor;

  return (
    <group position={[pos.localX, pos.localY, pos.localZ]}>
      {/* 1. Celda en suelo (outline y sutil plano de fondo) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[pw * 0.94, pd * 0.94]} />
        <meshBasicMaterial
          color={cellColor}
          transparent
          opacity={isPreselected ? 0.45 : isSelected ? 0.35 : hovered && isAvailable ? 0.22 : 0.08}
        />
      </mesh>

      {/* Borde perimetral de la celda */}
      <lineSegments position={[0, -0.05, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(pw * 0.96, isPreselected ? 0.05 : 0.02, pd * 0.96)]}
        />
        <lineBasicMaterial
          color={cellColor}
          transparent
          opacity={isPreselected ? 1 : isSelected ? 1 : hovered && isAvailable ? 0.85 : 0.35}
        />
      </lineSegments>

      {/* Resalte volumétrico si está preseleccionado */}
      {isPreselected && (
        <lineSegments position={[0, 0.12, 0]}>
          <edgesGeometry
            args={[new THREE.BoxGeometry(pw * 0.98, 0.26, pd * 0.98)]}
          />
          <lineBasicMaterial color="#10b981" transparent opacity={0.85} />
        </lineSegments>
      )}

      {/* Hitbox interactivo para clic y hover en esta posición */}
      <mesh
        position={[0, 0.25, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (isPreselectionMode) {
            if (!isAvailable) return;
            togglePreselectPosition(pos);
          } else {
            onSelect(pos);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[pw, 0.6, pd]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function TramoItem({
  tramo,
}: {
  tramo: ProcessedTramo3D;
}) {
  const selectedPosition = useBodegaViewerStore((s) => s.selectedPosition);
  const selectPosition = useBodegaViewerStore((s) => s.selectPosition);
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
          {tramo.positions.map((pos) => (
            <TramoPositionSlot
              key={`tramo-pos-${pos.positionId}`}
              pos={pos}
              isSelected={selectedPosition?.positionId === pos.positionId}
              onSelect={(p) => {
                selectPosition(p);
              }}
            />
          ))}
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
