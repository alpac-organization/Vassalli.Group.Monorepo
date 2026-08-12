import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { WarehouseLayout } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
import forkliftUrl from "@app/assets/warehouse/forklift.glb?url";

interface AisleForkliftsProps {
  layout: WarehouseLayout;
}

/** Same footprint as the first aisle placement (meters). */
const FORKLIFT_LENGTH = 2.85;
const FORKLIFT_WIDTH = 1.25;
const FORKLIFT_HEIGHT = 2.15;

type ForkliftPose = {
  x: number;
  z: number;
  yaw: number;
};

/** Same aisle coordinates as the original InstancedMesh placement. */
function buildForkliftPoses(layout: WarehouseLayout): ForkliftPose[] {
  const { wallClearance, aisleWidth, depth, sideTramoWidth, centerBlockWidth } =
    layout.building;

  const aisle1X = wallClearance + sideTramoWidth + aisleWidth / 2;
  const aisle2X =
    wallClearance +
    sideTramoWidth +
    aisleWidth +
    centerBlockWidth +
    aisleWidth / 2;

  const usableDepth = depth - wallClearance * 2;
  const zSouth = wallClearance + usableDepth * 0.28;
  const zNorth = wallClearance + usableDepth * 0.68;

  return [
    { x: aisle1X, z: zSouth, yaw: 0 },
    { x: aisle2X, z: zNorth, yaw: Math.PI },
  ];
}

function deepCloneScene(source: THREE.Object3D): THREE.Object3D {
  const root = source.clone(true);
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => m.clone());
    } else if (mesh.material) {
      mesh.material = mesh.material.clone();
    }
  });
  return root;
}

function applyRealisticForkliftMaterials(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    for (const raw of mats) {
      const mat = raw as THREE.MeshStandardMaterial;
      if (!mat?.isMeshStandardMaterial) continue;

      const name = mat.name ?? "";
      const lum =
        0.2126 * mat.color.r + 0.7152 * mat.color.g + 0.0722 * mat.color.b;

      mat.map = null;
      mat.vertexColors = false;
      mat.toneMapped = true;

      if (name.includes("002") || lum < 0.08) {
        // Tires — slate (readable on dark floor, matches rack posts)
        mat.color.set("#64748b");
        mat.emissive.set("#334155");
        mat.emissiveIntensity = 0.18;
        mat.roughness = 0.88;
        mat.metalness = 0.08;
      } else if (
        name.includes("014") ||
        (mat.color.r > 0.45 && mat.color.g > 0.25 && mat.color.b < 0.2)
      ) {
        // Body — safety yellow
        mat.color.set("#f5c518");
        mat.emissive.set("#a16207");
        mat.emissiveIntensity = 0.28;
        mat.roughness = 0.42;
        mat.metalness = 0.22;
      } else if (name.includes("003") || lum < 0.2) {
        // Mast / cage / dark trim — same slate as rack posts
        mat.color.set("#94a3b8");
        mat.emissive.set("#475569");
        mat.emissiveIntensity = 0.14;
        mat.roughness = 0.45;
        mat.metalness = 0.5;
      } else {
        // Steel mast / forks — slate like rack uprights (#94a3b8)
        mat.color.set("#94a3b8");
        mat.emissive.set("#475569");
        mat.emissiveIntensity = 0.14;
        mat.roughness = 0.4;
        mat.metalness = 0.55;
      }

      mat.needsUpdate = true;
    }
  });
}

/**
 * Returns a Group whose local origin is on the floor at the model center.
 * Outer placement must set the Group position — never overwrite inner offsets.
 */
function buildPreparedForklift(scene: THREE.Object3D): THREE.Group {
  const model = deepCloneScene(scene);
  applyRealisticForkliftMaterials(model);

  const wrapper = new THREE.Group();
  wrapper.add(model);

  model.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Center on XZ and put wheels on y = 0 (local)
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= box.min.y;

  const s = Math.min(
    FORKLIFT_WIDTH / (size.x || 1),
    FORKLIFT_HEIGHT / (size.y || 1),
    FORKLIFT_LENGTH / (size.z || 1),
  );
  wrapper.scale.setScalar(s);

  // Re-ground after scale (scale is on wrapper, so adjust model.y)
  wrapper.updateWorldMatrix(true, true);
  const box2 = new THREE.Box3().setFromObject(wrapper);
  model.position.y -= box2.min.y / s;

  return wrapper;
}

export function AisleForklifts({ layout }: AisleForkliftsProps) {
  const { scene } = useGLTF(forkliftUrl);
  const invalidate = useThree((s) => s.invalidate);
  const poses = useMemo(() => buildForkliftPoses(layout), [layout]);

  const template = useMemo(() => buildPreparedForklift(scene), [scene]);

  const instances = useMemo(
    () => poses.map((pose) => template.clone(true)),
    [template, poses],
  );

  useLayoutEffect(() => {
    invalidate();
  }, [instances, invalidate]);

  return (
    <group>
      {instances.map((obj, i) => {
        const pose = poses[i]!;
        return (
          <group
            key={i}
            position={[pose.x, 0.02, pose.z]}
            rotation={[0, pose.yaw, 0]}
          >
            <primitive object={obj} />
          </group>
        );
      })}
    </group>
  );
}

useGLTF.preload(forkliftUrl);
