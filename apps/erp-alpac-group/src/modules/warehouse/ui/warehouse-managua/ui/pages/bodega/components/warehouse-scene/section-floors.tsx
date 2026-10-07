import { useMemo } from "react";
import * as THREE from "three";
import type { ProcessedSection3D } from "../../hooks/use-warehouse-3d-data";
import { TRAMO_STRIP_COLOR } from "../../types/warehouse-3d.types";
import { FloorBlueprintBadge } from "./floor-blueprint-badge";

interface SectionFloorsProps {
  sections: ProcessedSection3D[];
}

export function SectionFloors({
  sections,
}: SectionFloorsProps) {
  // Generar las líneas perimetrales amarillas (#e8d98a) de cada sección
  const linesGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];

    sections.forEach((sec) => {
      const minX = sec.x;
      const maxX = sec.x + sec.width;
      const minZ = sec.z;
      const maxZ = sec.z + sec.depth;
      const y = 0.02;

      // 4 pares de puntos para lineSegments formando el rectángulo de la sección
      points.push(new THREE.Vector3(minX, y, minZ), new THREE.Vector3(maxX, y, minZ));
      points.push(new THREE.Vector3(maxX, y, minZ), new THREE.Vector3(maxX, y, maxZ));
      points.push(new THREE.Vector3(maxX, y, maxZ), new THREE.Vector3(minX, y, maxZ));
      points.push(new THREE.Vector3(minX, y, maxZ), new THREE.Vector3(minX, y, minZ));
    });

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <group>
      {/* Bordes amarillos limpios de los tramos y secciones en el suelo */}
      <lineSegments geometry={linesGeo} raycast={() => null}>
        <lineBasicMaterial color={TRAMO_STRIP_COLOR} />
      </lineSegments>

      {/* Anotaciones discretas de medidas y posición para cada sección (pasa desapercibido) */}
      {sections.map((sec) => {
        const rawX = sec.raw?.position_x ?? sec.x;
        const rawY = sec.raw?.position_y ?? sec.z;
        const rawW = sec.raw?.width ?? sec.width;
        const rawL = sec.raw?.length ?? sec.depth;

        const badgeW = Math.min(Math.max(sec.width * 0.45, 1.8), 3.2);
        const badgeH = badgeW * 0.28;
        const posX = sec.x + badgeW / 2 + 0.15;
        const posZ = sec.z + badgeH / 2 + 0.15;

        return (
          <FloorBlueprintBadge
            key={`sec-badge-${sec.sectionId}`}
            title={`${sec.code || "SEC"} · ${rawW}m × ${rawL}m`}
            subtitle={`Pos: (${rawX}m, ${rawY}m)`}
            position={[posX, 0.022, posZ]}
            size={[badgeW, badgeH]}
            accentColor={sec.color || TRAMO_STRIP_COLOR}
            textColor="#cbd5e1"
            subTextColor="#64748b"
            bgColor="rgba(15, 23, 42, 0.65)"
            borderColor="rgba(71, 85, 105, 0.35)"
            opacity={0.58}
          />
        );
      })}
    </group>
  );
}
