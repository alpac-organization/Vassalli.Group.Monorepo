import type { LayoutEntityKind } from "./layout-builder-2d.types";

export const METERS_TO_PIXELS = 20;
export const SNAP_METRES = 0.5;
export const SNAP_PIXELS = SNAP_METRES * METERS_TO_PIXELS;
export const MIN_DRAW_METRES = SNAP_METRES;
export const LAYOUT_FETCH_PAGE_SIZE = 1000;

export const ENTITY_COLORS: Record<
  LayoutEntityKind,
  { fill: string; stroke: string }
> = {
  section: { fill: "rgba(148, 163, 184, 0.25)", stroke: "#94a3b8" },
  lot: { fill: "rgba(34, 197, 94, 0.25)", stroke: "#22c55e" },
  rack: { fill: "rgba(239, 68, 68, 0.25)", stroke: "#ef4444" },
};

export const STORAGE_TYPE_COLORS: Record<
  string,
  { fill: string; stroke: string; dash?: number[]; elevated?: boolean }
> = {
  Lots: { fill: "rgba(249, 115, 22, 0.28)", stroke: "#f97316" },
  Racks: {
    fill: "rgba(56, 189, 248, 0.22)",
    stroke: "#38bdf8",
    dash: [8, 4],
    elevated: true,
  },
  Empty: { fill: "rgba(148, 163, 184, 0.2)", stroke: "#94a3b8" },
};
