import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ProcessedRack3D, ProcessedSection3D } from "../../hooks/use-warehouse-3d-data";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";
import { getDynamicRackFlyTo } from "../../utils/camera-fly";
import {
  RACK_STATUS_COLORS,
  getEffectiveRackStatus,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";

interface RackStructuresProps {
  racks: ProcessedRack3D[];
  sections?: ProcessedSection3D[];
}

const POST_W = 0.08;
const BEAM_H = 0.10;
const BEAM_T = 0.05;
const CONNECTOR_H = 0.14;
const CONNECTOR_W = 0.04;
const STRUT_W = 0.035;

type Part = {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  rx?: number;
  ry?: number;
  rz?: number;
};

type LevelHitPlate = {
  rack: ProcessedRack3D;
  level: number;
  levelCode: string;
  status: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
};

function AnimatedLevelBoundingBox({
  w,
  h,
  d,
  color,
  isWarning,
}: {
  w: number;
  h: number;
  d: number;
  color: string;
  isWarning: boolean;
}) {
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const fillMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (isWarning) {
      const t = clock.getElapsedTime();
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);
      if (lineMatRef.current) {
        lineMatRef.current.opacity = 0.6 + 0.4 * pulse;
      }
      if (fillMatRef.current) {
        fillMatRef.current.opacity = 0.08 + 0.12 * pulse;
      }
    }
  });

  return (
    <group>
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(w * 0.99, h * 0.99, d * 0.99)]}
        />
        <lineBasicMaterial
          ref={lineMatRef}
          color={color}
          transparent
          opacity={0.9}
        />
      </lineSegments>
      <mesh>
        <boxGeometry args={[w * 0.98, h * 0.98, d * 0.98]} />
        <meshBasicMaterial
          ref={fillMatRef}
          color={color}
          transparent
          opacity={isWarning ? 0.12 : 0.05}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
export function RackStructures({ racks = [], sections = [] }: RackStructuresProps) {
  const focusedRack = useBodegaViewerStore((s) => s.focusedRack);
  const selectedLevel = useBodegaViewerStore((s) => s.selectedLevel);
  const focusRack = useBodegaViewerStore((s) => s.focusRack);
  const selectLevel = useBodegaViewerStore((s) => s.selectLevel);

  const [hoveredLevel, setHoveredLevel] = useState<{
    rackId: string;
    level: number;
  } | null>(null);

  // Generar geometría del rack: bastidores azules con celosía diagonal, largueros naranjas y esperas superiores
  const { uprightParts, beamParts, levelPlates } = useMemo(() => {
    const uprights: Part[] = [];
    const beams: Part[] = [];
    const plates: LevelHitPlate[] = [];

    (racks ?? []).forEach((rack) => {
      const {
        cx,
        cy,
        cz,
        renderWidth,
        renderDepth,
        renderHeight,
        levels,
        isRotated90,
      } = rack;

      const halfW = renderWidth / 2;
      const halfD = renderDepth / 2;

      // 4 Postes esquineros verticales de acero (Bastidores azules) que suben hasta la altura total
      // Incluyendo las esperas superiores que sobrepasan el Nivel 2
      const corners: [number, number][] = [
        [cx - halfW + POST_W / 2, cz - halfD + POST_W / 2],
        [cx + halfW - POST_W / 2, cz - halfD + POST_W / 2],
        [cx - halfW + POST_W / 2, cz + halfD - POST_W / 2],
        [cx + halfW - POST_W / 2, cz + halfD - POST_W / 2],
      ];

      for (const [px, pz] of corners) {
        uprights.push({
          x: px,
          y: cy + renderHeight / 2,
          z: pz,
          sx: POST_W,
          sy: renderHeight,
          sz: POST_W,
        });
      }

      // Altura entre niveles y cantidad real de niveles de la bahía
      const numLevels = Math.max(levels.length, 1);
      // tierH es la separación vertical real entre niveles (~1.60m)
      const tierH = rack.tierHeight || renderHeight / (numLevels + 1);

      const topY = cy + renderHeight;

      // Celosía y tirantes laterales de los bastidores azules (uniendo poste frontal con trasero)
      if (!isRotated90) {
        const frameD = renderDepth - POST_W;
        const sideXs = [cx - halfW + POST_W / 2, cx + halfW - POST_W / 2];
        for (const sx of sideXs) {
          // Horizontal inferior (cerca del suelo)
          uprights.push({
            x: sx,
            y: cy + 0.15,
            z: cz,
            sx: POST_W * 0.7,
            sy: 0.035,
            sz: frameD,
          });
          uprights.push({
            x: sx,
            y: topY - 0.03,
            z: cz,
            sx: POST_W * 0.7,
            sy: 0.035,
            sz: frameD,
          });

          // Diagonales
          const dLen1 = Math.sqrt(frameD * frameD + (tierH - 0.15) * (tierH - 0.15));
          const ang1 = Math.atan2(tierH - 0.15, frameD);
          uprights.push({
            x: sx,
            y: cy + 0.15 + (tierH - 0.15) / 2,
            z: cz,
            sx: STRUT_W,
            sy: STRUT_W,
            sz: dLen1,
            rx: -ang1,
          });

          const dLen2 = Math.sqrt(frameD * frameD + tierH * tierH);
          uprights.push({
            x: sx,
            y: cy + 1.5 * tierH,
            z: cz,
            sx: STRUT_W,
            sy: STRUT_W,
            sz: dLen2,
            rx: Math.atan2(tierH, frameD),
          });
          uprights.push({
            x: sx,
            y: cy + 2.5 * tierH,
            z: cz,
            sx: STRUT_W,
            sy: STRUT_W,
            sz: dLen2,
            rx: -Math.atan2(tierH, frameD),
          });
        }

        // Largueros en X
        for (let i = 0; i < numLevels; i++) {
          const lvlNum = i + 1;
          const lY = cy + (i + 1) * tierH;
          const lvlData = levels[i];
          const levelCode = lvlData?.code || `${rack.code}-N${lvlNum}`;
          const levelStatus = lvlData?.status || rack.status || "available";

          beams.push({
            x: cx,
            y: lY,
            z: cz - halfD + BEAM_T / 2,
            sx: renderWidth - POST_W * 2,
            sy: BEAM_H,
            sz: BEAM_T,
          });
          beams.push({
            x: cx,
            y: lY,
            z: cz + halfD - BEAM_T / 2,
            sx: renderWidth - POST_W * 2,
            sy: BEAM_H,
            sz: BEAM_T,
          });

          for (const sx of sideXs) {
            beams.push({
              x: sx,
              y: lY,
              z: cz - halfD + BEAM_T / 2,
              sx: CONNECTOR_W,
              sy: CONNECTOR_H,
              sz: BEAM_T * 1.2,
            });
            beams.push({
              x: sx,
              y: lY,
              z: cz + halfD - BEAM_T / 2,
              sx: CONNECTOR_W,
              sy: CONNECTOR_H,
              sz: BEAM_T * 1.2,
            });
          }

          plates.push({
            rack,
            level: lvlNum,
            levelCode,
            status: levelStatus,
            x: cx,
            y: cy + (i + 1.5) * tierH,
            z: cz,
            w: renderWidth * 1.05,
            h: tierH * 0.96,
            d: renderDepth * 1.05,
          });
        }
      } else {
        const sideZs = [cz - halfD + POST_W / 2, cz + halfD - POST_W / 2];
        const frameW = renderWidth - POST_W;
        for (const sz of sideZs) {
          // Horizontal inferior (cerca del suelo)
          uprights.push({
            x: cx,
            y: cy + 0.15,
            z: sz,
            sx: frameW,
            sy: 0.035,
            sz: POST_W * 0.7,
          });
          uprights.push({
            x: cx,
            y: topY - 0.03,
            z: sz,
            sx: frameW,
            sy: 0.035,
            sz: POST_W * 0.7,
          });

          // Diagonales
          const dLen1 = Math.sqrt(frameW * frameW + (tierH - 0.15) * (tierH - 0.15));
          const ang1 = Math.atan2(tierH - 0.15, frameW);
          uprights.push({
            x: cx,
            y: cy + 0.15 + (tierH - 0.15) / 2,
            z: sz,
            sx: dLen1,
            sy: STRUT_W,
            sz: STRUT_W,
            rz: ang1,
          });

          const dLen2 = Math.sqrt(frameW * frameW + tierH * tierH);
          uprights.push({
            x: cx,
            y: cy + 1.5 * tierH,
            z: sz,
            sx: dLen2,
            sy: STRUT_W,
            sz: STRUT_W,
            rz: -Math.atan2(tierH, frameW),
          });
          uprights.push({
            x: cx,
            y: cy + 2.5 * tierH,
            z: sz,
            sx: dLen2,
            sy: STRUT_W,
            sz: STRUT_W,
            rz: Math.atan2(tierH, frameW),
          });
        }

        // Largueros en Z
        for (let i = 0; i < numLevels; i++) {
          const lvlNum = i + 1;
          const lY = cy + (i + 1) * tierH;
          const lvlData = levels[i];
          const levelCode = lvlData?.code || `${rack.code}-N${lvlNum}`;
          const levelStatus = lvlData?.status || rack.status || "available";

          beams.push({
            x: cx - halfW + BEAM_T / 2,
            y: lY,
            z: cz,
            sx: BEAM_T,
            sy: BEAM_H,
            sz: renderDepth - POST_W * 2,
          });
          beams.push({
            x: cx + halfW - BEAM_T / 2,
            y: lY,
            z: cz,
            sx: BEAM_T,
            sy: BEAM_H,
            sz: renderDepth - POST_W * 2,
          });

          for (const sz of sideZs) {
            beams.push({
              x: cx - halfW + BEAM_T / 2,
              y: lY,
              z: sz,
              sx: BEAM_T * 1.2,
              sy: CONNECTOR_H,
              sz: CONNECTOR_W,
            });
            beams.push({
              x: cx + halfW - BEAM_T / 2,
              y: lY,
              z: sz,
              sx: BEAM_T * 1.2,
              sy: CONNECTOR_H,
              sz: CONNECTOR_W,
            });
          }

          plates.push({
            rack,
            level: lvlNum,
            levelCode,
            status: levelStatus,
            x: cx,
            y: cy + (i + 1.5) * tierH,
            z: cz,
            w: renderWidth * 1.05,
            h: tierH * 0.96,
            d: renderDepth * 1.05,
          });
        }
      }
    });

    return {
      uprightParts: uprights,
      beamParts: beams,
      levelPlates: plates,
    };
  }, [racks]);

  const uprightsMeshRef = useRef<THREE.InstancedMesh>(null);
  const beamsMeshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Actualizar matrices de bastidores azules con diagonales
  useLayoutEffect(() => {
    if (uprightsMeshRef.current && uprightParts.length > 0) {
      uprightParts.forEach((part, i) => {
        dummy.position.set(part.x, part.y, part.z);
        dummy.rotation.set(part.rx || 0, part.ry || 0, part.rz || 0);
        dummy.scale.set(part.sx, part.sy, part.sz);
        dummy.updateMatrix();
        uprightsMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      uprightsMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [uprightParts, dummy]);

  // Actualizar matrices de largueros naranja (Nivel 1 y Nivel 2)
  useLayoutEffect(() => {
    if (beamsMeshRef.current && beamParts.length > 0) {
      beamParts.forEach((part, i) => {
        dummy.position.set(part.x, part.y, part.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(part.sx, part.sy, part.sz);
        dummy.updateMatrix();
        beamsMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      beamsMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [beamParts, dummy]);

  const handleLevelClick = (rack: ProcessedRack3D, level: number) => {
    const flyTo = getDynamicRackFlyTo(rack, level, sections);
    focusRack(rack, flyTo, level);
    selectLevel(level);
  };

  return (
    <group>
      {/* 1. Bastidores verticales de acero azul industrial (#1d4ed8) con celosía y esperas */}
      {uprightParts.length > 0 && (
        <instancedMesh
          ref={uprightsMeshRef}
          args={[undefined, undefined, uprightParts.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#1d4ed8"
            metalness={0.45}
            roughness={0.45}
          />
        </instancedMesh>
      )}

      {/* 2. Largueros de carga naranja (#ea580c) exclusivamente en Nivel 1 y Nivel 2 */}
      {beamParts.length > 0 && (
        <instancedMesh
          ref={beamsMeshRef}
          args={[undefined, undefined, beamParts.length]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#ea580c"
            metalness={0.35}
            roughness={0.5}
          />
        </instancedMesh>
      )}

      {/* 3. Hitboxes independientes por cada nivel (Nivel 1, Nivel 2, etc.) */}
      {levelPlates.map((plate, idx) => {
        const isRackSelected = focusedRack?.rackId === plate.rack.rackId;
        const isLevelSelected =
          isRackSelected && (selectedLevel === null || selectedLevel === plate.level);
        const isHovered =
          hoveredLevel?.rackId === plate.rack.rackId &&
          hoveredLevel?.level === plate.level;

        const lvlData = plate.rack.levels?.find(
          (l) => l.levelNumber === plate.level,
        );
        const effStatus = getEffectiveRackStatus(
          lvlData?.status || plate.status,
          lvlData?.occupiedPositions ?? plate.rack.occupiedPositions,
          lvlData?.positions,
        );
        const statusKey = effStatus.statusKey;
        const statusColor = RACK_STATUS_COLORS[statusKey] ?? "#38bdf8";
        const statusLabel = effStatus.label;
        const isWarning =
          statusKey === "UnderMaintenance" || statusKey === "Blocked";

        return (
          <group
            key={`${plate.rack.rackId}-lvl-${plate.level}-${idx}`}
            position={[plate.x, plate.y, plate.z]}
          >
            {/* Hitbox transparente para interactuar con este nivel específico */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                handleLevelClick(plate.rack, plate.level);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredLevel({
                  rackId: plate.rack.rackId,
                  level: plate.level,
                });
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHoveredLevel(null);
                document.body.style.cursor = "auto";
              }}
            >
              <boxGeometry args={[plate.w, plate.h, plate.d]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* Bounding box de resalte para el nivel enfocado/hover con animación y color según estado */}
            {(isLevelSelected || isHovered) && (
              <AnimatedLevelBoundingBox
                w={plate.w}
                h={plate.h}
                d={plate.d}
                color={statusColor}
                isWarning={isWarning}
              />
            )}

            {/* Tooltip / Badge 3D flotante con código y estado */}
            {(isLevelSelected || isHovered) && (
              <Html
                center
                distanceFactor={14}
                position={[0, plate.h * 0.52 + 0.18, 0]}
                style={{ pointerEvents: "none" }}
              >
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md pointer-events-none select-none text-[11px] font-semibold whitespace-nowrap transform -translate-y-1/2">
                  {isWarning ? (
                    <span className="relative flex h-2 w-2">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: statusColor }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-2 w-2"
                        style={{ backgroundColor: statusColor }}
                      />
                    </span>
                  ) : (
                    <span
                      className="h-2 w-2 rounded-full inline-block"
                      style={{ backgroundColor: statusColor }}
                    />
                  )}
                  <span className="font-bold text-slate-100">{plate.levelCode}</span>
                  <span className="text-slate-500">·</span>
                  <span className="font-bold" style={{ color: statusColor }}>
                    {statusLabel}
                  </span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
