import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type UnitGltfAsset = {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
};

function collectMeshes(root: THREE.Object3D): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      meshes.push(obj as THREE.Mesh);
    }
  });
  return meshes;
}

function toUnitGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const geo = geometry.clone();
  geo.computeBoundingBox();
  const size = new THREE.Vector3();
  geo.boundingBox!.getSize(size);
  geo.center();
  geo.scale(1 / (size.x || 1), 1 / (size.y || 1), 1 / (size.z || 1));
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  return geo;
}

function pickMaterial(
  meshes: THREE.Mesh[],
  materials: Record<string, THREE.Material>,
  fallbackColor: string,
): THREE.MeshStandardMaterial {
  for (const key of Object.keys(materials)) {
    const mat = materials[key];
    if (mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
      return (mat as THREE.MeshStandardMaterial).clone();
    }
  }

  for (const mesh of meshes) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
        return (mat as THREE.MeshStandardMaterial).clone();
      }
    }
  }

  return new THREE.MeshStandardMaterial({
    color: fallbackColor,
    roughness: 0.85,
    metalness: 0.05,
  });
}

function buildUnitAsset(
  gltf: ReturnType<typeof useGLTF>,
  label: string,
  fallbackColor: string,
): UnitGltfAsset {
  const fromNodes =
    (gltf as { nodes?: Record<string, THREE.Object3D> }).nodes ?? {};
  const root =
    fromNodes.CardboardBoxes_2 ??
    fromNodes.RootNode ??
    fromNodes.Scene ??
    gltf.scene;

  const meshes = collectMeshes(root);
  if (meshes.length === 0) {
    throw new Error(
      `${label}: no mesh found (nodes: ${Object.keys(fromNodes).join(", ") || "none"})`,
    );
  }

  const geos = meshes.map((mesh) => {
    const g = mesh.geometry.clone();
    mesh.updateWorldMatrix(true, false);
    g.applyMatrix4(mesh.matrixWorld);
    return g;
  });

  const merged =
    geos.length === 1 ? geos[0]! : (mergeGeometries(geos, false) ?? geos[0]!);

  const geometry = toUnitGeometry(merged);
  geos.forEach((g) => {
    if (g !== merged) g.dispose();
  });

  const materials = ((gltf as { materials?: Record<string, THREE.Material> })
    .materials ?? {}) as Record<string, THREE.Material>;
  const material = pickMaterial(meshes, materials, fallbackColor);
  material.side = THREE.FrontSide;
  material.toneMapped = true;
  material.vertexColors = false;

  return { geometry, material };
}

import boxUrl from "@app/assets/warehouse/box.glb?url";
import polinUrl from "@app/assets/warehouse/polin.glb?url";
import forkliftUrl from "@app/assets/warehouse/forklift.glb?url";

export function useCardboardBoxAsset(): UnitGltfAsset {
  const gltf = useGLTF(boxUrl);
  return useMemo(() => buildUnitAsset(gltf, "box.glb", "#c4a574"), [gltf]);
}

export function usePolinAsset(): UnitGltfAsset {
  const gltf = useGLTF(polinUrl);
  return useMemo(() => buildUnitAsset(gltf, "polin.glb", "#8b6914"), [gltf]);
}
export function useForkliftAsset(): UnitGltfAsset {
  const gltf = useGLTF(forkliftUrl);
  return useMemo(
    () => buildUnitAsset(gltf, "forklift.glb", "#f59e0b"),
    [gltf],
  );
}

/** @deprecated use useForkliftAsset */
export function useForklift(): UnitGltfAsset {
  return useForkliftAsset();
}

useGLTF.preload(boxUrl);
useGLTF.preload(polinUrl);
useGLTF.preload(forkliftUrl);
