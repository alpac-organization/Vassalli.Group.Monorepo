import { useState } from "react";
import type { ProcessedTramo3D } from "../../hooks/use-warehouse-3d-data";
import { TRAMO_STRIP_COLOR } from "../../types/warehouse-3d.types";
import { FloorBlueprintBadge } from "./floor-blueprint-badge";
import {
  resolveRackStatus,
  RACK_STATUS_COLORS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";

interface TramoFloorsProps {
  tramos: ProcessedTramo3D[];
  onSelectTramo?: (tramo: ProcessedTramo3D) => void;
}

const RAIL_T = 0.08;
const RAIL_H = 0.04;

function TramoItem({
  tramo,
  isSelected,
  onSelect,
}: {
  tramo: ProcessedTramo3D;
  isSelected: boolean;
  onSelect: (tramo: ProcessedTramo3D) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const resolved = resolveRackStatus(tramo.status);
  const statusKey = (resolved?.textValue ??
    "Available") as keyof typeof RACK_STATUS_COLORS;
  const statusColor = RACK_STATUS_COLORS[statusKey] ?? "#4ade80";
  const isOccupied = statusKey === "Occupied";

  // Dimensiones del tramo
  const w = tramo.width;
  const l = tramo.length;

  const railColor = isSelected
    ? "#38bdf8"
    : hovered
      ? "#fde047"
      : TRAMO_STRIP_COLOR;

  const badgeW = Math.min(Math.max(w * 0.75, 1.4), 2.2);
  const badgeH = badgeW * 0.28;

  return (
    <group
      position={[tramo.cx, 0, tramo.cz]}
      rotation={[0, tramo.rotationY, 0]}
    >
      {/* 1. Suelo del tramo con fondo sutil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial
          color={isSelected ? "#0369a1" : hovered ? "#1e293b" : "#0f172a"}
          roughness={0.8}
          transparent
          opacity={isSelected ? 0.7 : hovered ? 0.5 : 0.25}
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
        textColor={isSelected ? "#38bdf8" : "#cbd5e1"}
        subTextColor="#64748b"
        opacity={0.65}
      />

      {/* 4. Mercancía / Carga en el tramo si está ocupado */}
      {isOccupied && (
        <group position={[0, 0, 0]}>
          {/* Pallet base */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry
              args={[
                Math.min(w * 0.7, 1.2),
                0.15,
                Math.min(l * 0.7, 1.0),
              ]}
            />
            <meshStandardMaterial color="#c4a574" roughness={0.7} />
          </mesh>
          {/* Bulto / Carga */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry
              args={[
                Math.min(w * 0.65, 1.15),
                0.55,
                Math.min(l * 0.65, 0.95),
              ]}
            />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
          {/* Segundo nivel si admite apilado / estibado */}
          {tramo.allowsStacking && (
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry
                args={[
                  Math.min(w * 0.6, 1.1),
                  0.45,
                  Math.min(l * 0.6, 0.9),
                ]}
              />
              <meshStandardMaterial color="#0369a1" roughness={0.4} />
            </mesh>
          )}
        </group>
      )}

      {/* 5. Hitbox para interacción y selección */}
      <mesh
        position={[0, 0.25, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(tramo);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[w, 0.5, l]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function TramoFloors({ tramos, onSelectTramo }: TramoFloorsProps) {
  const focusedTramo = useBodegaViewerStore((s) => s.focusedTramo);

  if (tramos.length === 0) return null;

  return (
    <group>
      {tramos.map((tramo) => (
        <TramoItem
          key={`tramo-3d-${tramo.tramoId}`}
          tramo={tramo}
          isSelected={focusedTramo?.tramoId === tramo.tramoId}
          onSelect={(t) => onSelectTramo?.(t)}
        />
      ))}
    </group>
  );
}

