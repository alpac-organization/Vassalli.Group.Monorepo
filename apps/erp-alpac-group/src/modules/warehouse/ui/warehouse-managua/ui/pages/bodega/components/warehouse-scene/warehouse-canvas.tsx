import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  getLayoutByBodegaId,
  getWarehouseCenter,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/data/bodega-2-fiscal.layout";
import { useWarehouseOccupancy } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/hooks/use-warehouse-occupancy";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { getOverviewFlyTo } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/utils/camera-fly";
import { BuildingShell } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/building-shell";
import { AisleMarkers } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/aisle-markers";
import { FloorTramos } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/floor-tramos";
import { RackStructures } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/rack-structures";
import { RackSlots } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/rack-slots";
import { PolinCargoInstances } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/polin-cargo-instances";
import { FocusedTramoHighlight } from "./focused-tramo-highlight";
import { CameraRig } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/components/warehouse-scene/camera-rig";
import "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/hooks/use-warehouse-gltf-assets";
interface WarehouseCanvasProps {
  bodegaId: string;
}
function WarehouseScene({ bodegaId }: WarehouseCanvasProps) {
  const layout = getLayoutByBodegaId(bodegaId);
  const { locations } = useWarehouseOccupancy(bodegaId);
  const clearLevelSelection = useBodegaViewerStore(
    (s) => s.clearLevelSelection,
  );
  if (!layout) return null;
  const center = getWarehouseCenter(layout);
  return (
    <>
      <color attach="background" args={["#0b1220"]} />
      <fog attach="fog" args={["#0b1220", 110, 220]} />
      <ambientLight intensity={0.75} />
      <directionalLight
        castShadow
        position={[30, 50, 20]}
        intensity={1.35}
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#94a3b8", "#0f172a", 0.45]} />

      <group onPointerMissed={() => clearLevelSelection()}>
        <BuildingShell layout={layout} />
        <AisleMarkers layout={layout} />
        <FloorTramos tramos={layout.floorTramos} />
        <RackSlots tramos={layout.rackTramos} />
        <RackStructures tramos={layout.rackTramos} />
        <Suspense fallback={null}>
          <PolinCargoInstances
            floorTramos={layout.floorTramos}
            rackTramos={layout.rackTramos}
            occupancy={locations}
          />
        </Suspense>
        <FocusedTramoHighlight layout={layout} />
      </group>

      <ContactShadows
        position={[center.x, 0.02, center.z]}
        opacity={0.35}
        scale={80}
        blur={2.5}
        far={40}
      />

      <CameraRig layout={layout} />
    </>
  );
}

export default function WarehouseCanvas({ bodegaId }: WarehouseCanvasProps) {
  const layout = getLayoutByBodegaId(bodegaId);
  console.log(layout);
  const overview = layout
    ? getOverviewFlyTo(layout)
    : {
        position: { x: 46, y: 22, z: 78 },
        target: { x: 18, y: 0.5, z: 30 },
      };

  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{
        position: [
          overview.position.x,
          overview.position.y,
          overview.position.z,
        ],
        fov: 42,
        near: 0.1,
        far: 250,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="h-full w-full touch-none"
      onCreated={({ gl }) => {
        gl.setClearColor("#0b1220");
      }}
    >
      <WarehouseScene bodegaId={bodegaId} />
    </Canvas>
  );
}
