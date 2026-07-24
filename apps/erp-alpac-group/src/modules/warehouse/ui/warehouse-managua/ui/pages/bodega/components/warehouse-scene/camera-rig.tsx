import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getWarehouseCenter } from "../../data/bodega-2-fiscal.layout";
import type { WarehouseLayout } from "../../types/warehouse-3d.types";
import { useBodegaViewerStore } from "../../stores/use-bodega-viewer-store";

interface CameraRigProps {
  layout: WarehouseLayout;
}

type ControlsHandle = {
  target: THREE.Vector3;
  update: () => void;
  minDistance: number;
  enabled: boolean;
};

const LERP = 0.09;
const ARRIVE_EPS = 0.04;

export function CameraRig({ layout }: CameraRigProps) {
  const controlsRef = useRef<ControlsHandle | null>(null);
  const { camera, invalidate } = useThree();
  const cameraPreset = useBodegaViewerStore((s) => s.cameraPreset);
  const clearCameraPreset = useBodegaViewerStore((s) => s.clearCameraPreset);
  const cameraFlyTo = useBodegaViewerStore((s) => s.cameraFlyTo);
  const clearCameraFlyTo = useBodegaViewerStore((s) => s.clearCameraFlyTo);

  const animatingRef = useRef(false);
  const goalPos = useRef(new THREE.Vector3());
  const goalTarget = useRef(new THREE.Vector3());
  const goalMinDist = useRef(8);

  const center = getWarehouseCenter(layout);

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
    goalMinDist.current = cameraFlyTo.minDistance ?? 8;
    animatingRef.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
    invalidate();
  }, [cameraFlyTo, invalidate]);

  useEffect(() => {
    if (!cameraPreset || !controlsRef.current) return;

    const controls = controlsRef.current;
    controls.target.set(center.x, 0.5, center.z);
    controls.minDistance = 8;

    if (cameraPreset === "top") {
      camera.position.set(center.x, 55, center.z + 0.01);
    } else if (cameraPreset === "isometric") {
      camera.position.set(center.x + 38, 32, center.z + 42);
    } else {
      camera.position.set(center.x + 28, 22, center.z + 48);
    }

    controls.update();
    animatingRef.current = false;
    invalidate();
    clearCameraPreset();
  }, [cameraPreset, camera, center, clearCameraPreset, invalidate]);

  useFrame(() => {
    if (!animatingRef.current || !controlsRef.current) return;

    const controls = controlsRef.current;
    camera.position.lerp(goalPos.current, LERP);
    controls.target.lerp(goalTarget.current, LERP);
    controls.minDistance = goalMinDist.current;
    controls.update();
    invalidate();

    const posDone =
      camera.position.distanceTo(goalPos.current) < ARRIVE_EPS;
    const targetDone =
      controls.target.distanceTo(goalTarget.current) < ARRIVE_EPS;

    if (posDone && targetDone) {
      camera.position.copy(goalPos.current);
      controls.target.copy(goalTarget.current);
      controls.update();
      animatingRef.current = false;
      controls.enabled = true;
      clearCameraFlyTo();
      invalidate();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef as never}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={3.5}
      maxDistance={120}
      target={[center.x, 0.5, center.z]}
      onChange={() => invalidate()}
    />
  );
}
