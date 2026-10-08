import { useMemo } from "react";
import * as THREE from "three";
import type { BuildingDimensions3D } from "../../hooks/use-warehouse-3d-data";
import { FloorBlueprintBadge } from "./floor-blueprint-badge";

interface BuildingShellProps {
  building?: BuildingDimensions3D;
  showEnvelope?: boolean;
  onFloorClick?: () => void;
}

export function BuildingShell({
  building,
  showEnvelope = true,
  onFloorClick,
}: BuildingShellProps) {
  const width = building?.width ?? 35;
  const depth = building?.depth ?? 45;
  const height = building?.height ?? 8;
  const wallH = height;
  const wallY = wallH / 2;
  const wallT = 0.2;

  // Líneas de acotación arquitectónica discretas (estilo plano CAD en el suelo que pasa desapercibido)
  const dimensionLinesGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const y = 0.012;
    const offset = 0.6;
    const tickLen = 0.25;

    // --- Cota Eje X (Ancho frontal) ---
    points.push(new THREE.Vector3(0, y, -offset), new THREE.Vector3(width, y, -offset));
    // Ticks de extremo
    points.push(new THREE.Vector3(0, y, -offset - tickLen), new THREE.Vector3(0, y, -offset + tickLen));
    points.push(new THREE.Vector3(width, y, -offset - tickLen), new THREE.Vector3(width, y, -offset + tickLen));
    // Líneas de proyección desde las esquinas del edificio
    points.push(new THREE.Vector3(0, y, -0.05), new THREE.Vector3(0, y, -offset));
    points.push(new THREE.Vector3(width, y, -0.05), new THREE.Vector3(width, y, -offset));

    // --- Cota Eje Z (Fondo lateral) ---
    points.push(new THREE.Vector3(-offset, y, 0), new THREE.Vector3(-offset, y, depth));
    // Ticks de extremo
    points.push(new THREE.Vector3(-offset - tickLen, y, 0), new THREE.Vector3(-offset + tickLen, y, 0));
    points.push(new THREE.Vector3(-offset - tickLen, y, depth), new THREE.Vector3(-offset + tickLen, y, depth));
    // Líneas de proyección desde las esquinas del edificio
    points.push(new THREE.Vector3(-0.05, y, 0), new THREE.Vector3(-offset, y, 0));
    points.push(new THREE.Vector3(-0.05, y, depth), new THREE.Vector3(-offset, y, depth));

    // --- Marcador de eje en Origen (0, 0) ---
    points.push(new THREE.Vector3(-0.35, y, 0), new THREE.Vector3(0.35, y, 0));
    points.push(new THREE.Vector3(0, y, -0.35), new THREE.Vector3(0, y, 0.35));

    // --- Marcador de eje en Vértice opuesto (width, depth) ---
    points.push(new THREE.Vector3(width - 0.35, y, depth), new THREE.Vector3(width + 0.35, y, depth));
    points.push(new THREE.Vector3(width, y, depth - 0.35), new THREE.Vector3(width, y, depth + 0.35));

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [width, depth]);

  return (
    <group>
      {/* Suelo principal de hormigón industrial */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0, depth / 2]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onFloorClick?.();
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Cuadrícula guía en el piso */}
      <gridHelper
        args={[Math.max(width, depth) * 1.2, 50, "#334155", "#1e293b"]}
        position={[width / 2, 0.005, depth / 2]}
      />

      {showEnvelope && (
        <>
          {/* Líneas de cota arquitectónica sutiles en el perímetro */}
          <lineSegments geometry={dimensionLinesGeo} raycast={() => null}>
            <lineBasicMaterial color="#475569" transparent opacity={0.4} />
          </lineSegments>

          {/* Anotación de cota sutil: Ancho (Eje X) */}
          <FloorBlueprintBadge
            title={`↔ ${width} m`}
            subtitle="ANCHO (Eje X)"
            position={[width / 2, 0.015, -0.6]}
            size={[2.4, 0.58]}
            opacity={0.6}
          />

          {/* Anotación de cota sutil: Fondo (Eje Z) */}
          <FloorBlueprintBadge
            title={`↕ ${depth} m`}
            subtitle="FONDO (Eje Z)"
            position={[-0.6, 0.015, depth / 2]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            size={[2.4, 0.58]}
            opacity={0.6}
          />

          {/* Anotación discreta de coordenadas en el Origen (0, 0) */}
          <FloorBlueprintBadge
            title="(0, 0)"
            subtitle={`Alt: ${height}m`}
            position={[-0.85, 0.015, -0.85]}
            size={[1.8, 0.52]}
            opacity={0.5}
          />

          {/* Anotación discreta en el Vértice opuesto (width, depth) */}
          <FloorBlueprintBadge
            title={`(${width}m, ${depth}m)`}
            subtitle="Límite Nave"
            position={[width + 0.85, 0.015, depth + 0.85]}
            size={[2.2, 0.52]}
            opacity={0.5}
          />

          {/* Muros perimetrales semi-transparentes */}
          <mesh position={[width / 2, wallY, -wallT / 2]}>
            <boxGeometry args={[width, wallH, wallT]} />
            <meshStandardMaterial color="#334155" transparent opacity={0.90} />
          </mesh>
          <mesh position={[width / 2, wallY, depth + wallT / 2]}>
            <boxGeometry args={[width, wallH, wallT]} />
            <meshStandardMaterial color="#334155" transparent opacity={0.90} />
          </mesh>
          <mesh position={[-wallT / 2, wallY, depth / 2]}>
            <boxGeometry args={[wallT, wallH, depth]} />
            <meshStandardMaterial color="#334155" transparent opacity={0.90} />
          </mesh>
          <mesh position={[width + wallT / 2, wallY, depth / 2]}>
            <boxGeometry args={[wallT, wallH, depth]} />
            <meshStandardMaterial color="#334155" transparent opacity={0.90} />
          </mesh>
        </>
      )}
    </group>
  );
}
