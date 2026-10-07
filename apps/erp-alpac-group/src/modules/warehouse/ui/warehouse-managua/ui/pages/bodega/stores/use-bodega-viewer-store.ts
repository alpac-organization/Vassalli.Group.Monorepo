import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CameraProps,
  LayerFilterMode,
  Vec3,
  ViewerLayer,
} from "../types/warehouse-3d.types";
import type { ProcessedRack3D, ProcessedTramo3D } from "../hooks/use-warehouse-3d-data";

export type CameraFlyTo = {
  position: Vec3;
  target: Vec3;
  minDistance?: number;
};

interface BodegaViewerState {
  selectedBodegaId: string | null;
  selectedBodegaName: string | null;
  selectedRackId: string | null;
  focusedRack: ProcessedRack3D | null;
  focusedTramo: ProcessedTramo3D | null;
  selectedLevel: number | null;
  focusedTramoId: string | null; // compatibilidad
  sectionFilterId: string | null;
  cameraPreset: CameraProps | null;
  cameraFlyTo: CameraFlyTo | null;

  // Capas de visualización (Botonera)
  showWarehouse: boolean;
  showSections: boolean;
  showRacks: boolean;
  showTramos: boolean;
  showCargo: boolean;
  layerFilterMode: LayerFilterMode | null;

  // Pantalla completa / Expandir
  isFullscreen: boolean;

  // Acciones de Zoom
  zoomAction: "in" | "out" | null;

  setBodega: (id: string, name: string) => void;
  clearBodega: () => void;
  focusRack: (rack: ProcessedRack3D, flyTo: CameraFlyTo, level?: number | null) => void;
  focusTramo: (tramo: ProcessedTramo3D) => void;
  selectLevel: (level: number | null) => void;
  clearRackSelection: () => void;
  clearTramoSelection: () => void;
  exitTramoFocus: (overviewFlyTo?: CameraFlyTo) => void;
  setSectionFilter: (sectionId: string | null) => void;
  requestCameraPreset: (preset: CameraProps) => void;
  clearCameraPreset: () => void;
  setCameraFlyTo: (flyTo: CameraFlyTo | null) => void;
  clearCameraFlyTo: () => void;

  // Métodos de capas
  toggleLayer: (layer: ViewerLayer) => void;
  isolateLayer: (mode: LayerFilterMode) => void;
  resetLayers: () => void;

  // Pantalla completa y zoom
  setIsFullscreen: (full: boolean) => void;
  toggleFullscreen: () => void;
  triggerZoom: (direction: "in" | "out") => void;
  clearZoomAction: () => void;
}

export const useBodegaViewerStore = create<BodegaViewerState>()(
  persist(
    (set) => ({
      selectedBodegaId: null,
      selectedBodegaName: null,
      selectedRackId: null,
      focusedRack: null,
      focusedTramo: null,
      selectedLevel: null,
      focusedTramoId: null,
      sectionFilterId: null,
      cameraPreset: null,
      cameraFlyTo: null,

      // Capas activadas por defecto
      showWarehouse: true,
      showSections: true,
      showRacks: true,
      showTramos: true,
      showCargo: true,
      layerFilterMode: "all",

      isFullscreen: false,
      zoomAction: null,

      setBodega: (id, name) =>
        set({
          selectedBodegaId: id,
          selectedBodegaName: name,
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          focusedTramoId: null,
          sectionFilterId: null,
          cameraPreset: "default",
          cameraFlyTo: null,
        }),

      clearBodega: () =>
        set({
          selectedBodegaId: null,
          selectedBodegaName: null,
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          focusedTramoId: null,
          sectionFilterId: null,
          cameraPreset: null,
          cameraFlyTo: null,
        }),

      focusRack: (rack, flyTo, level = null) =>
        set({
          selectedRackId: rack.rackId,
          focusedRack: rack,
          focusedTramo: null,
          selectedLevel: level ?? null,
          focusedTramoId: rack.rackId,
          cameraFlyTo: flyTo,
        }),

      focusTramo: (tramo) =>
        set({
          focusedTramo: tramo,
          focusedRack: null,
          selectedRackId: null,
          selectedLevel: null,
          focusedTramoId: tramo.tramoId,
        }),

      selectLevel: (level) =>
        set({
          selectedLevel: level,
        }),

      clearRackSelection: () =>
        set({
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          focusedTramoId: null,
        }),

      clearTramoSelection: () =>
        set({
          focusedTramo: null,
          focusedTramoId: null,
        }),

      exitTramoFocus: (overviewFlyTo) =>
        set({
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          focusedTramoId: null,
          cameraFlyTo: overviewFlyTo ?? null,
        }),

      setSectionFilter: (sectionId) =>
        set({
          sectionFilterId: sectionId,
        }),

      requestCameraPreset: (preset) =>
        set({
          cameraPreset: preset,
          cameraFlyTo: null,
        }),

      clearCameraPreset: () => set({ cameraPreset: null }),
      setCameraFlyTo: (flyTo) => set({ cameraFlyTo: flyTo }),
      clearCameraFlyTo: () => set({ cameraFlyTo: null }),

      // Control de capas
      toggleLayer: (layer) =>
        set((state) => {
          const nextWarehouse =
            layer === "warehouse" ? !state.showWarehouse : state.showWarehouse;
          const nextSections =
            layer === "sections" ? !state.showSections : state.showSections;
          const nextRacks =
            layer === "racks" ? !state.showRacks : state.showRacks;
          const nextTramos =
            layer === "tramos" ? !state.showTramos : state.showTramos;
          const nextCargo =
            layer === "cargo" ? !state.showCargo : state.showCargo;

          const isAll =
            nextWarehouse && nextSections && nextRacks && nextTramos && nextCargo;

          return {
            showWarehouse: nextWarehouse,
            showSections: nextSections,
            showRacks: nextRacks,
            showTramos: nextTramos,
            showCargo: nextCargo,
            layerFilterMode: isAll ? "all" : null,
          };
        }),

      isolateLayer: (mode) =>
        set(() => {
          if (mode === "all") {
            return {
              layerFilterMode: "all",
              showWarehouse: true,
              showSections: true,
              showRacks: true,
              showTramos: true,
              showCargo: true,
            };
          }
          if (mode === "warehouse") {
            return {
              layerFilterMode: "warehouse",
              showWarehouse: true,
              showSections: false,
              showRacks: false,
              showTramos: false,
              showCargo: false,
            };
          }
          if (mode === "sections") {
            return {
              layerFilterMode: "sections",
              showWarehouse: true,
              showSections: true,
              showRacks: false,
              showTramos: false,
              showCargo: false,
            };
          }
          if (mode === "racks") {
            return {
              layerFilterMode: "racks",
              showWarehouse: true,
              showSections: false,
              showRacks: true,
              showTramos: false,
              showCargo: false,
            };
          }
          if (mode === "tramos") {
            return {
              layerFilterMode: "tramos",
              showWarehouse: true,
              showSections: false,
              showRacks: false,
              showTramos: true,
              showCargo: true,
            };
          }
          return {};
        }),

      resetLayers: () =>
        set({
          showWarehouse: true,
          showSections: true,
          showRacks: true,
          showTramos: true,
          showCargo: true,
          layerFilterMode: "all",
        }),

      setIsFullscreen: (full) => set({ isFullscreen: full }),
      toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

      triggerZoom: (direction) => set({ zoomAction: direction }),
      clearZoomAction: () => set({ zoomAction: null }),
    }),
    {
      name: "alpac-bodega-viewer",
      partialize: (state) => ({
        selectedBodegaId: state.selectedBodegaId,
        selectedBodegaName: state.selectedBodegaName,
      }),
    },
  ),
);
