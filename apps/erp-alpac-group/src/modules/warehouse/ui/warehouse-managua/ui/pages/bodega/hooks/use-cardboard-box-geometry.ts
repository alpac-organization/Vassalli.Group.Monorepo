import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import boxUrl from "@app/assets/warehouse/box.glb?url";

export type CardboardBoxAsset = {
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

function pickCardboardMaterial(
  meshes: THREE.Mesh[],
  materials: Record<string, THREE.Material>,
): THREE.MeshStandardMaterial {
  const named = materials.Cardboard as THREE.MeshStandardMaterial | undefined;
  if (named) return named.clone();

  for (const mesh of meshes) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat.name?.toLowerCase().includes("cardboard")) {
        return (mat as THREE.MeshStandardMaterial).clone();
      }
    }
  }

  const first = meshes[0]?.material;
  const mat = (Array.isArray(first) ? first[0] : first) as
    | THREE.MeshStandardMaterial
    | undefined;

  if (mat) return mat.clone();

  return new THREE.MeshStandardMaterial({
    color: "#c4a574",
    roughness: 0.85,
    metalness: 0.05,
  });
}

export function useCardboardBoxAsset(): CardboardBoxAsset {
  const gltf = useGLTF(boxUrl);

  return useMemo(() => {
    const fromNodes =
      (gltf as { nodes?: Record<string, THREE.Object3D> }).nodes ?? {};
    const root = fromNodes.CardboardBoxes_2 ?? fromNodes.RootNode ?? gltf.scene;

    const meshes = collectMeshes(root);
    if (meshes.length === 0) {
      throw new Error(
        `box.glb: no mesh found (nodes: ${Object.keys(fromNodes).join(", ") || "none"})`,
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
    const material = pickCardboardMaterial(meshes, materials);
    material.side = THREE.FrontSide;
    material.toneMapped = true;
    material.vertexColors = false;

    return { geometry, material };
  }, [gltf]);
}

useGLTF.preload(boxUrl);
