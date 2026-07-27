import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  getLayoutByBodegaId,
  getWarehouseCenter,
} from "../../data/bodega-2-fiscal.layout";
import { useWarehouseOccupancy } from "../../hooks/use-warehouse-occupancy";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";
import { getOverviewFlyTo } from "../../utils/camera-fly";
import { BuildingShell } from "./building-shell";
import { AisleMarkers } from "./aisle-markers";
import { FloorTramos } from "./floor-tramos";
import { RackStructures } from "./rack-structures";
import { RackSlots } from "./rack-slots";
import { FocusedTramoHighlight } from "./focused-tramo-highlight";
import { CameraRig } from "./camera-rig";

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
        <FloorTramos tramos={layout.floorTramos} occupancy={locations} />
        <RackStructures tramos={layout.rackTramos} />
        <RackSlots tramos={layout.rackTramos} occupancy={locations} />
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
