import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
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
}

function WarehouseScene({
  building,
  sections,
  racks,
  tramos = [],
}: Omit<WarehouseCanvasProps, "onToggleFullscreen" | "isFullscreen">) {
  const clearRackSelection = useBodegaViewerStore((s) => s.clearRackSelection);
  const clearTramoSelection = useBodegaViewerStore((s) => s.clearTramoSelection);
  const focusTramo = useBodegaViewerStore((s) => s.focusTramo);
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
            onSelectTramo={(tramo) => focusTramo(tramo)}
          />
        )}

        {/* Estructuras metálicas de racks con vigas naranjas */}
        {showRacks && (
          <RackStructures racks={displayedRacks} sections={sections} />
        )}

        {/* Pallets y mercancías instanciados (tramos con carga/polines) */}
        {showCargo && (
          <Suspense fallback={null}>
            <PolinCargoInstances racks={displayedRacks} />
          </Suspense>
        )}
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
  ...props
}: WarehouseCanvasProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0b1220]">
      {/* Botonera Flotante Superior de Navegación y Filtros */}
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
          <WarehouseScene {...props} />
        </Suspense>
      </Canvas>

      {/* Indicador de ayuda discreto para navegación */}
      <div className="pointer-events-none absolute bottom-2.5 left-3 z-20 flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-slate-400 shadow-lg backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>🖱️ Clic izq: Rotar · Clic der: Mover · Rueda: Zoom</span>
      </div>
    </div>
  );
}
