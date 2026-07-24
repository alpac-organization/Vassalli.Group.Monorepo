import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CameraPreset,
  LocationCode,
  Vec3,
} from "../types/warehouse-3d.types";

export type CameraFlyTo = {
  position: Vec3;
  target: Vec3;
  minDistance?: number;
};

interface BodegaViewerState {
  selectedBodegaId: string | null;
  selectedBodegaName: string | null;
  focusedTramoId: string | null;
  selectedLocationCode: LocationCode | null;
  cameraPreset: CameraPreset | null;
  cameraFlyTo: CameraFlyTo | null;
  setBodega: (id: string, name: string) => void;
  clearBodega: () => void;
  focusTramo: (tramoId: string, flyTo: CameraFlyTo) => void;
  selectLevel: (code: LocationCode) => void;
  clearLevelSelection: () => void;
  exitTramoFocus: (overviewFlyTo?: CameraFlyTo) => void;
  requestCameraPreset: (preset: CameraPreset) => void;
  clearCameraPreset: () => void;
  clearCameraFlyTo: () => void;
}

export const useBodegaViewerStore = create<BodegaViewerState>()(
  persist(
    (set) => ({
      selectedBodegaId: null,
      selectedBodegaName: null,
      focusedTramoId: null,
      selectedLocationCode: null,
      cameraPreset: null,
      cameraFlyTo: null,
      setBodega: (id, name) =>
        set({
          selectedBodegaId: id,
          selectedBodegaName: name,
          focusedTramoId: null,
          selectedLocationCode: null,
          cameraFlyTo: null,
        }),
      clearBodega: () =>
        set({
          selectedBodegaId: null,
          selectedBodegaName: null,
          focusedTramoId: null,
          selectedLocationCode: null,
          cameraFlyTo: null,
        }),
      focusTramo: (tramoId, flyTo) =>
        set({
          focusedTramoId: tramoId,
          selectedLocationCode: null,
          cameraFlyTo: flyTo,
          cameraPreset: null,
        }),
      selectLevel: (code) => set({ selectedLocationCode: code }),
      clearLevelSelection: () => set({ selectedLocationCode: null }),
      exitTramoFocus: (overviewFlyTo) =>
        set({
          focusedTramoId: null,
          selectedLocationCode: null,
          cameraFlyTo: overviewFlyTo ?? null,
          cameraPreset: overviewFlyTo ? null : "reset",
        }),
      requestCameraPreset: (preset) =>
        set({
          cameraPreset: preset,
          focusedTramoId: null,
          selectedLocationCode: null,
          cameraFlyTo: null,
        }),
      clearCameraPreset: () => set({ cameraPreset: null }),
      clearCameraFlyTo: () => set({ cameraFlyTo: null }),
    }),
    {
      name: "bodega-viewer",
      partialize: (state) => ({
        selectedBodegaId: state.selectedBodegaId,
        selectedBodegaName: state.selectedBodegaName,
      }),
    },
  ),
);
