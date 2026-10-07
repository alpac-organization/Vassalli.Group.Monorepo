import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getWarehouseCenter } from "../../utils/camera-fly";
import type { BuildingDimensions3D } from "../../hooks/use-warehouse-3d-data";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";

interface CameraRigProps {
  building?: BuildingDimensions3D;
}

type ControlsHandle = {
  target: THREE.Vector3;
  update: () => void;
  minDistance: number;
  enabled: boolean;
};

const LERP = 0.09;
const ARRIVE_EPS = 0.04;

export function CameraRig({ building }: CameraRigProps) {
  const controlsRef = useRef<ControlsHandle | null>(null);
  const { camera, invalidate } = useThree();
  const cameraPreset = useBodegaViewerStore((s) => s.cameraPreset);
  const clearCameraPreset = useBodegaViewerStore((s) => s.clearCameraPreset);
  const cameraFlyTo = useBodegaViewerStore((s) => s.cameraFlyTo);
  const clearCameraFlyTo = useBodegaViewerStore((s) => s.clearCameraFlyTo);
  const zoomAction = useBodegaViewerStore((s) => s.zoomAction);
  const clearZoomAction = useBodegaViewerStore((s) => s.clearZoomAction);

  const animatingRef = useRef(false);
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());
  const goalMinDist = useRef(0.5);

  const b = useMemo(
    () => building ?? { width: 35, depth: 45, height: 8 },
    [building],
  );
  const center = useMemo(() => getWarehouseCenter(b), [b]);

  // Transición suave hacia rack o sección seleccionada
  useEffect(() => {
    if (!cameraFlyTo) return;
    goalPos.current.set(
      cameraFlyTo.position.x,
      cameraFlyTo.position.y,
      cameraFlyTo.position.z,
    );
    goalTarget.current.set(
      cameraFlyTo.target.x,
      cameraFlyTo.target.y,
      cameraFlyTo.target.z,
    );
    goalMinDist.current = cameraFlyTo.minDistance ?? 0.5;
    animatingRef.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
    invalidate();
  }, [cameraFlyTo, invalidate]);

  // Transición suave hacia vistas predeterminadas de cámara
  useEffect(() => {
    if (!cameraPreset || !controlsRef.current) return;

    const span = Math.max(b.width, b.depth);
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3(center.x, 0.5, center.z);

    if (cameraPreset === "top") {
      // Vista Cenital / Planta 2D Superior más cercana para lectura de cotas
      targetPos.set(center.x, span * 0.75, center.z + 0.001);
      targetLook.set(center.x, 0, center.z);
    } else if (cameraPreset === "isometric") {
      // Vista Isométrica 3D inmersiva
      targetPos.set(center.x + span * 0.48, span * 0.38, center.z + span * 0.52);
      targetLook.set(center.x, 0.5, center.z);
    } else if (cameraPreset === "front") {
      // Vista Frontal
      targetPos.set(center.x, span * 0.22, -span * 0.45);
      targetLook.set(center.x, 1.2, center.z * 0.6);
    } else if (cameraPreset === "side") {
      // Vista Lateral
      targetPos.set(-span * 0.45, span * 0.22, center.z);
      targetLook.set(center.x * 0.6, 1.2, center.z);
    } else {
      // Reset / Default
      targetPos.set(center.x + span * 0.5, span * 0.4, center.z + span * 0.55);
      targetLook.set(center.x, 0.5, center.z);
    }

    goalPos.current.copy(targetPos);
    goalTarget.current.copy(targetLook);
    goalMinDist.current = 0.5;
    animatingRef.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
    invalidate();
    clearCameraPreset();
  }, [cameraPreset, center, b, clearCameraPreset, invalidate]);

  // Acciones de Zoom In / Zoom Out desde la botonera (con paso más ágil y cercano)
  useEffect(() => {
    if (!zoomAction || !controlsRef.current) return;
    const controls = controlsRef.current;
    // Paso de zoom más potente: 40% más cerca en cada click
    const factor = zoomAction === "in" ? 0.6 : 1.5;
    const offset = camera.position.clone().sub(controls.target);
    const newPos = controls.target.clone().add(offset.multiplyScalar(factor));

    const dist = newPos.distanceTo(controls.target);
    const minDist = 0.5;
    const maxDist = Math.max(b.width, b.depth) * 3;

    if (dist >= minDist && dist <= maxDist) {
      goalPos.current.copy(newPos);
      goalTarget.current.copy(controls.target);
      goalMinDist.current = minDist;
      animatingRef.current = true;
      controls.enabled = false;
      invalidate();
    }
    clearZoomAction();
  }, [zoomAction, clearZoomAction, camera, b, invalidate]);

  useFrame(() => {
    if (animatingRef.current && controlsRef.current) {
      const controls = controlsRef.current;
      camera.position.lerp(goalPos.current, LERP);
      controls.target.lerp(goalTarget.current, LERP);
      controls.minDistance = goalMinDist.current;
      controls.update();
      invalidate();

      const dPos = camera.position.distanceTo(goalPos.current);
      const dTar = controls.target.distanceTo(goalTarget.current);
      if (dPos < ARRIVE_EPS && dTar < ARRIVE_EPS) {
        animatingRef.current = false;
        controls.enabled = true;
        clearCameraFlyTo();
      }
    } else if (controlsRef.current?.enabled) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef as never}
      makeDefault
      enableDamping={true}
      dampingFactor={0.08}
      rotateSpeed={0.85}
      panSpeed={0.85}
      zoomSpeed={1.4}
      screenSpacePanning={true}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={0.5}
      maxDistance={Math.max(b.width, b.depth) * 3}
      onChange={() => invalidate()}
    />
  );
}
