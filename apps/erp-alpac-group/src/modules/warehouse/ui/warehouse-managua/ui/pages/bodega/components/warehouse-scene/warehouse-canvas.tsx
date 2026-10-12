import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";
import { BuildingShell } from "./building-shell";
import { SectionFloors } from "./section-floors";
import { RackStructures } from "./rack-structures";
import { PolinCargoInstances } from "./polin-cargo-instances";
import { CameraRig } from "./camera-rig";
import { WarehouseToolbar } from "../warehouse-toolbar";
import { TramoFloors } from "./tramo-floors";
import type {
  BuildingDimensions3D,
  ProcessedRack3D,
  ProcessedSection3D,
  ProcessedTramo3D,
} from "../../hooks/use-warehouse-3d-data";

interface WarehouseCanvasProps {
  building: BuildingDimensions3D;
  sections: ProcessedSection3D[];
  racks: ProcessedRack3D[];
  tramos?: ProcessedTramo3D[];
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  hidePositionLabels?: boolean;
}

function getCompactPositionLabel(code: string): string {
  const rackMatch = code.match(/RACK-(\d+)-N(\d+)P(\d+)$/i);
  if (rackMatch) {
    return `R${rackMatch[1]}·P${rackMatch[3]}`;
  }
  const posMatch = code.match(/P(\d+)$/i);
  if (posMatch) {
    return `P${posMatch[1]}`;
  }
  const tramoMatch = code.match(/F(\d+)C(\d+)$/i);
  if (tramoMatch) {
    return `F${tramoMatch[1]}C${tramoMatch[2]}`;
  }
  return code.length > 8 ? code.slice(-6) : code;
}

function SelectedPositionReticle() {
  const selectedPosition = useBodegaViewerStore((s) => s.selectedPosition);
  const clearPositionSelection = useBodegaViewerStore(
    (s) => s.clearPositionSelection,
  );

  if (!selectedPosition) return null;

  const {
    worldX,
    worldY,
    worldZ,
    width,
    depth,
    height,
    positionCode,
  } = selectedPosition;
  const pw = Math.max(width || 1, 0.9);
  const pd = Math.max(depth || 1.2, 0.9);
  const ph = Math.max(height || 0.3, 0.4);

  return (
    <group position={[worldX, worldY, worldZ]}>
      {/* 1. Marco volumétrico con wireframe cian neón */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(pw * 1.05, ph * 1.1, pd * 1.05)]}
        />
        <lineBasicMaterial color="#00f0ff" linewidth={2} toneMapped={false} />
      </lineSegments>

      {/* Relleno sutil holográfico */}
      <mesh>
        <boxGeometry args={[pw * 1.02, ph * 1.05, pd * 1.02]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.16}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Anillo de radar sobre la superficie */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -ph / 2 + 0.02, 0]}>
        <ringGeometry
          args={[Math.min(pw, pd) * 0.35, Math.min(pw, pd) * 0.52, 32]}
        />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Etiqueta HTML flotante compacta (pointerEvents: none para no bloquear clics) */}
      <Html
        center
        position={[0, ph / 2 + 0.16, 0]}
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          title={positionCode}
          className="pointer-events-none flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-950/95 text-white border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)] backdrop-blur-md select-none text-[9px] font-mono font-bold whitespace-nowrap transform -translate-y-1/2"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
          </span>
          <span className="text-cyan-300">
            {getCompactPositionLabel(positionCode)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearPositionSelection();
            }}
            className="pointer-events-auto ml-0.5 text-slate-400 hover:text-white rounded p-0.5 hover:bg-slate-800 cursor-pointer text-[9px] leading-none"
            title="Deseleccionar"
          >
            ✕
          </button>
        </div>
      </Html>
    </group>
  );
}

function PreselectedPositionsOverlay({ hideLabels = false }: { hideLabels?: boolean }) {
  const preselectedPositions = useBodegaViewerStore((s) => s.preselectedPositions);
  const togglePreselectPosition = useBodegaViewerStore((s) => s.togglePreselectPosition);

  if (preselectedPositions.length === 0) return null;

  return (
    <group>
      {preselectedPositions.map((pos) => {
        const {
          positionId,
          worldX,
          worldY,
          worldZ,
          width,
          depth,
          height,
          positionCode,
        } = pos;
        const pw = Math.max(width || 1, 0.9);
        const pd = Math.max(depth || 1.2, 0.9);
        const ph = Math.max(height || 0.3, 0.4);

        return (
          <group key={`preselected-3d-${positionId}`} position={[worldX, worldY, worldZ]}>
            {/* Bounding box verde/esmeralda brillante */}
            <lineSegments>
              <edgesGeometry
                args={[new THREE.BoxGeometry(pw * 1.04, ph * 1.08, pd * 1.04)]}
              />
              <lineBasicMaterial color="#10b981" linewidth={2} toneMapped={false} />
            </lineSegments>

            {/* Relleno sutil holográfico esmeralda */}
            <mesh>
              <boxGeometry args={[pw * 1.01, ph * 1.04, pd * 1.01]} />
              <meshBasicMaterial
                color="#10b981"
                transparent
                opacity={0.18}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            {!hideLabels && <Html
              center
              position={[0, ph / 2 + 0.14, 0]}
              distanceFactor={8}
              style={{ pointerEvents: "none" }}
            >
              <div
                title={positionCode}
                className="pointer-events-none flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-950/95 text-white border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)] backdrop-blur-md select-none text-[9px] font-mono font-bold whitespace-nowrap transform -translate-y-1/2"
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-emerald-300">
                  {getCompactPositionLabel(positionCode)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreselectPosition(pos);
                  }}
                  className="pointer-events-auto ml-0.5 text-slate-400 hover:text-white rounded p-0.5 hover:bg-slate-800 cursor-pointer text-[9px] leading-none"
                  title="Remover de preselección"
                >
                  ✕
                </button>
              </div>
            </Html>}
          </group>
        );
      })}
    </group>
  );
}

function WarehouseScene({
  building,
  sections,
  racks,
  tramos = [],
  hidePositionLabels = false,
}: Omit<WarehouseCanvasProps, "onToggleFullscreen" | "isFullscreen">) {
  const clearRackSelection = useBodegaViewerStore((s) => s.clearRackSelection);
  const clearTramoSelection = useBodegaViewerStore((s) => s.clearTramoSelection);
  const clearPositionSelection = useBodegaViewerStore(
    (s) => s.clearPositionSelection,
  );
  const setSectionFilter = useBodegaViewerStore((s) => s.setSectionFilter);
  const sectionFilterId = useBodegaViewerStore((s) => s.sectionFilterId);
  const showWarehouse = useBodegaViewerStore((s) => s.showWarehouse);
  const showSections = useBodegaViewerStore((s) => s.showSections);
  const showRacks = useBodegaViewerStore((s) => s.showRacks);
  const showTramos = useBodegaViewerStore((s) => s.showTramos);
  const showCargo = useBodegaViewerStore((s) => s.showCargo);

  // Filtrar racks si hay un filtro de sección activo
  const safeRacks = racks ?? [];
  const displayedRacks = sectionFilterId
    ? safeRacks.filter((r) => r.sectionId === sectionFilterId)
    : safeRacks;

  // Filtrar tramos si hay un filtro de sección activo
  const safeTramos = tramos ?? [];
  const displayedTramos = sectionFilterId
    ? safeTramos.filter((t) => t.sectionId === sectionFilterId)
    : safeTramos;

  const handleDeselect = () => {
    clearRackSelection();
    clearTramoSelection();
    clearPositionSelection();
    setSectionFilter(null);
  };

  return (
    <>
      <color attach="background" args={["#0b1220"]} />
      <fog attach="fog" args={["#0b1220", 90, 240]} />
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[30, 50, 30]}
        intensity={1.4}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <hemisphereLight args={["#94a3b8", "#0f172a", 0.5]} />

      <group onPointerMissed={handleDeselect}>
        {/* Estructura exterior y suelo de la nave (control de paredes y cotas por showWarehouse) */}
        <BuildingShell
          building={building}
          showEnvelope={showWarehouse}
          onFloorClick={handleDeselect}
        />

        {/* Delimitación de secciones y cotas individuales */}
        {showSections && <SectionFloors sections={sections} />}

        {/* Tramos en el suelo (Lots / Bahías a nivel de piso) */}
        {showTramos && (
          <TramoFloors
            tramos={displayedTramos}
          />
        )}

        {/* Estructuras metálicas de racks con vigas naranjas */}
        {showRacks && (
          <RackStructures racks={displayedRacks} />
        )}

        {/* Pallets y mercancías instanciados (racks y tramos con carga/polines y estados) */}
        {showCargo && (
          <Suspense fallback={null}>
            <PolinCargoInstances
              racks={showRacks ? displayedRacks : []}
              tramos={showTramos ? displayedTramos : []}
            />
          </Suspense>
        )}

        {/* Retícula holográfica de selección de posición en 3D */}
        <SelectedPositionReticle />

        {/* Visualización de todas las posiciones preseleccionadas en 3D */}
        <PreselectedPositionsOverlay hideLabels={hidePositionLabels} />
      </group>

      <ContactShadows
        position={[building.width / 2, 0.01, building.depth / 2]}
        opacity={0.5}
        scale={Math.max(building.width, building.depth) * 1.5}
        blur={1.5}
        far={15}
      />

      <CameraRig building={building} />
    </>
  );
}

export default function WarehouseCanvas({
  onToggleFullscreen,
  isFullscreen = false,
  hidePositionLabels = false,
  ...props
}: WarehouseCanvasProps) {
  const navigationMode = useBodegaViewerStore((s) => s.navigationMode);
  const isPreselectionMode = useBodegaViewerStore((s) => s.isPreselectionMode);
  const preselectedPositions = useBodegaViewerStore((s) => s.preselectedPositions);
  const clearPreselectedPositions = useBodegaViewerStore((s) => s.clearPreselectedPositions);
  const activeDescargueAssignment = useBodegaViewerStore((s) => s.activeDescargueAssignment);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0b1220] touch-none ${
        navigationMode === "pan" ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {/* Botonera Flotante Superior de Navegación y Filtros (Acordeones) */}
      <WarehouseToolbar
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <Canvas
        shadows
        frameloop="demand"
        camera={{ position: [25, 20, 35], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <WarehouseScene {...props} hidePositionLabels={hidePositionLabels} />
        </Suspense>
      </Canvas>

      {/* Indicador de ayuda discreto para navegación (solo visible en pantallas medianas o grandes) */}
      <div className="pointer-events-none absolute bottom-2.5 left-3 z-20 hidden md:flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-slate-400 shadow-lg backdrop-blur-md">
        <span
          className={`h-1.5 w-1.5 rounded-full animate-pulse ${
            navigationMode === "pan"
              ? "bg-emerald-400"
              : isPreselectionMode
                ? "bg-cyan-400"
                : "bg-sky-400"
          }`}
        />
        {navigationMode === "pan" ? (
          <span>✋ Herramienta Mano: Clic izq para desplazarte · Clic der: Rotar · Rueda: Zoom</span>
        ) : isPreselectionMode ? (
          <span>☑️ Modo Preselección: Clic en celdas para marcar/desmarcar · Clic der: Mover</span>
        ) : (
          <span>🖱️ Clic izq: Rotar · Clic der: Mover · Rueda: Zoom</span>
        )}
      </div>

      {/* Barra Flotante de Posiciones Preseleccionadas (adaptable a móvil) */}
      {!activeDescargueAssignment && preselectedPositions.length > 0 && (
        <div className="pointer-events-auto absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex max-w-[calc(100vw-1.5rem)] items-center gap-2 sm:gap-2.5 rounded-xl border border-cyan-500/60 bg-slate-900/95 px-3 py-1.5 shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>
              {preselectedPositions.length}{" "}
              <span className="hidden sm:inline">
                {preselectedPositions.length > 1 ? "posiciones preseleccionadas" : "posición preseleccionada"}
              </span>
              <span className="sm:hidden">marcadas</span>
            </span>
          </div>
          <div className="hidden sm:block h-3.5 w-px bg-slate-700/80 shrink-0" />
          <div className="hidden sm:flex items-center gap-1 max-w-[280px] overflow-hidden text-[11px] font-mono text-slate-300">
            {preselectedPositions.slice(0, 3).map((p) => (
              <span
                key={p.positionId}
                className="rounded bg-slate-800 px-1.5 py-0.5 border border-slate-700 font-semibold text-cyan-200 truncate max-w-[90px]"
              >
                {p.positionCode}
              </span>
            ))}
            {preselectedPositions.length > 3 && (
              <span className="text-slate-400 text-[10px] font-sans">
                +{preselectedPositions.length - 3} más
              </span>
            )}
          </div>
          <div className="h-3.5 w-px bg-slate-700/80 shrink-0 sm:hidden" />
          <button
            type="button"
            onClick={clearPreselectedPositions}
            className="rounded px-2 py-0.5 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/50 transition cursor-pointer shrink-0"
            title="Limpiar preselección"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
