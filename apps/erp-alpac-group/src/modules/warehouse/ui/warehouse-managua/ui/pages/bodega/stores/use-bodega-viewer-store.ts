import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CameraProps,
  LayerFilterMode,
  ProcessedPosition3D,
  Vec3,
  ViewerLayer,
} from "../types/warehouse-3d.types";
import type { ProcessedRack3D, ProcessedTramo3D } from "../hooks/use-warehouse-3d-data";
import { resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";

export type CameraFlyTo = {
  position: Vec3;
  target: Vec3;
  minDistance?: number;
};

export type ActiveDescargueAssignment = {
  assignmentId: string;
  operationalOrderId: string;
  merchandise?: string;
  merchandiseDescription?: string;
  warehouseId?: string;
  status?: number | string;
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
  showPositions: boolean;
  showCargo: boolean;
  layerFilterMode: LayerFilterMode | null;

  // Modo de navegación / vista (Mano para solo moverse vs Orbitar 3D)
  navigationMode: "orbit" | "pan";
  setNavigationMode: (mode: "orbit" | "pan") => void;
  togglePanMode: () => void;

  // Preselección de posiciones (marcar múltiples posiciones antes de asignar)
  isPreselectionMode: boolean;
  preselectedPositions: ProcessedPosition3D[];
  togglePreselectPosition: (position: ProcessedPosition3D) => void;
  clearPreselectedPositions: () => void;
  togglePreselectionMode: () => void;

  // Pantalla completa / Expandir
  isFullscreen: boolean;

  // Acciones de Zoom
  zoomAction: "in" | "out" | null;

  // Selección de posición específica (celda / polín) en 3D
  selectedPosition: ProcessedPosition3D | null;
  hoveredPosition: ProcessedPosition3D | null;

  // Asignación de Descargue activa
  activeDescargueAssignment: ActiveDescargueAssignment | null;
  setActiveDescargueAssignment: (assignment: ActiveDescargueAssignment | null) => void;
  clearActiveDescargueAssignment: () => void;

  setBodega: (id: string, name: string) => void;
  clearBodega: () => void;
  focusRack: (rack: ProcessedRack3D, flyTo: CameraFlyTo, level?: number | null) => void;
  focusTramo: (tramo: ProcessedTramo3D) => void;
  selectLevel: (level: number | null) => void;
  selectPosition: (position: ProcessedPosition3D | null) => void;
  setHoveredPosition: (position: ProcessedPosition3D | null) => void;
  clearPositionSelection: () => void;
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

      // Capas activadas por defecto (Paredes, Secciones y Cuadrícula ocultas por defecto)
      showWarehouse: false,
      showSections: false,
      showRacks: true,
      showTramos: true,
      showPositions: false,
      showCargo: true,
      layerFilterMode: null,

      navigationMode: "orbit",
      isPreselectionMode: false,
      preselectedPositions: [],

      isFullscreen: false,
      zoomAction: null,

      selectedPosition: null,
      hoveredPosition: null,

      setNavigationMode: (mode) => set({ navigationMode: mode }),
      togglePanMode: () =>
        set((s) => ({
          navigationMode: s.navigationMode === "pan" ? "orbit" : "pan",
        })),

      togglePreselectPosition: (position) =>
        set((state) => {
          const resolved = resolveRackStatus(position.status);
          const statusKey =
            resolved?.textValue ??
            (position.isOccupied ? "Occupied" : "Available");
          const isAvailable =
            statusKey === "Available" && !position.isOccupied;

          const exists = state.preselectedPositions.some(
            (p) => p.positionId === position.positionId,
          );

          // Si no está preseleccionada y ya cuenta con un estado (no disponible), bloquear selección
          if (!exists && !isAvailable) {
            return state;
          }

          const updated = exists
            ? state.preselectedPositions.filter(
                (p) => p.positionId !== position.positionId,
              )
            : [...state.preselectedPositions, position];
          return { preselectedPositions: updated };
        }),

      clearPreselectedPositions: () => set({ preselectedPositions: [] }),
      togglePreselectionMode: () =>
        set((s) => {
          const nextMode = !s.isPreselectionMode;
          return {
            isPreselectionMode: nextMode,
            showPositions: nextMode,
          };
        }),

      activeDescargueAssignment: null,
      setActiveDescargueAssignment: (assignment) =>
        set({
          activeDescargueAssignment: assignment,
          isPreselectionMode: Boolean(assignment),
          showPositions: Boolean(assignment),
        }),
      clearActiveDescargueAssignment: () =>
        set({
          activeDescargueAssignment: null,
          preselectedPositions: [],
        }),

      setBodega: (id, name) =>
        set({
          selectedBodegaId: id,
          selectedBodegaName: name,
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          selectedPosition: null,
          hoveredPosition: null,
          focusedTramoId: null,
          sectionFilterId: null,
          cameraPreset: "default",
          cameraFlyTo: null,
          showWarehouse: false,
          showSections: false,
          showRacks: true,
          showTramos: true,
          showPositions: false,
          showCargo: true,
          layerFilterMode: null,
        }),

      clearBodega: () =>
        set({
          selectedBodegaId: null,
          selectedBodegaName: null,
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          selectedPosition: null,
          hoveredPosition: null,
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
          selectedPosition: null,
          hoveredPosition: null,
          focusedTramoId: rack.rackId,
          cameraFlyTo: flyTo,
        }),

      focusTramo: (tramo) =>
        set({
          focusedTramo: tramo,
          focusedRack: null,
          selectedRackId: null,
          selectedLevel: null,
          selectedPosition: null,
          hoveredPosition: null,
          focusedTramoId: tramo.tramoId,
        }),

      selectLevel: (level) =>
        set({
          selectedLevel: level,
        }),

      selectPosition: (position) =>
        set({
          selectedPosition: position,
        }),

      setHoveredPosition: (position) =>
        set({
          hoveredPosition: position,
        }),

      clearPositionSelection: () =>
        set({
          selectedPosition: null,
          hoveredPosition: null,
        }),

      clearRackSelection: () =>
        set({
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          selectedPosition: null,
          hoveredPosition: null,
          focusedTramoId: null,
        }),

      clearTramoSelection: () =>
        set({
          focusedTramo: null,
          selectedPosition: null,
          hoveredPosition: null,
          focusedTramoId: null,
        }),

      exitTramoFocus: (overviewFlyTo) =>
        set({
          selectedRackId: null,
          focusedRack: null,
          focusedTramo: null,
          selectedLevel: null,
          selectedPosition: null,
          hoveredPosition: null,
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
          const nextPositions =
            layer === "positions" ? !state.showPositions : state.showPositions;
          const nextCargo =
            layer === "cargo" ? !state.showCargo : state.showCargo;

          const isAll =
            nextWarehouse &&
            nextSections &&
            nextRacks &&
            nextTramos &&
            nextPositions &&
            nextCargo;

          return {
            showWarehouse: nextWarehouse,
            showSections: nextSections,
            showRacks: nextRacks,
            showTramos: nextTramos,
            showPositions: nextPositions,
            showCargo: nextCargo,
            isPreselectionMode: nextPositions ? state.isPreselectionMode : false,
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
              showPositions: false,
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
              showPositions: false,
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
              showPositions: false,
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
              showPositions: false,
              showCargo: true,
            };
          }
          if (mode === "tramos") {
            return {
              layerFilterMode: "tramos",
              showWarehouse: true,
              showSections: false,
              showRacks: false,
              showTramos: true,
              showPositions: false,
              showCargo: true,
            };
          }
          if (mode === "positions") {
            return {
              layerFilterMode: "positions",
              showWarehouse: true,
              showSections: true,
              showRacks: true,
              showTramos: true,
              showPositions: true,
              showCargo: false,
            };
          }
          return {};
        }),

      resetLayers: () =>
        set({
          showWarehouse: false,
          showSections: false,
          showRacks: true,
          showTramos: true,
          showPositions: false,
          showCargo: true,
          layerFilterMode: null,
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
