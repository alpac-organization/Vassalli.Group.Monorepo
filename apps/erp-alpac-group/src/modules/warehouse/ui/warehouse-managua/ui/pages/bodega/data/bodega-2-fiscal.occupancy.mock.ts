import { BODEGA_2_FISCAL_LAYOUT } from "./bodega-2-fiscal.layout";
import type { OccupancyMap, SlotStatus } from "../types/warehouse-3d.types";

function allLocationCodes(): string[] {
  const codes: string[] = [];
  for (const t of BODEGA_2_FISCAL_LAYOUT.floorTramos) {
    codes.push(t.code);
  }
  for (const t of BODEGA_2_FISCAL_LAYOUT.rackTramos) {
    codes.push(...t.levels);
  }
  return codes;
}

/** Deterministic pseudo-random status from location code (stable mock). */
function mockStatus(code: string): SlotStatus {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) | 0;
  }
  const n = Math.abs(hash) % 10;
  if (n < 5) return "free";
  if (n < 8) return "occupied";
  return "reserved";
}

export function buildBodega2OccupancyMock(): OccupancyMap {
  const map: OccupancyMap = {};
  for (const code of allLocationCodes()) {
    map[code] = mockStatus(code);
  }
  // Showcase examples matching the plan nomenclature
  map["T-41"] = "free";
  map["T-62"] = "occupied";
  map["T-62-01"] = "reserved";
  map["T-62-02"] = "free";
  map["T-51"] = "occupied";
  map["T-51-01"] = "occupied";
  map["T-51-02"] = "free";
  map["T-80"] = "reserved";
  return map;
}

export const BODEGA_2_OCCUPANCY_MOCK = buildBodega2OccupancyMock();
