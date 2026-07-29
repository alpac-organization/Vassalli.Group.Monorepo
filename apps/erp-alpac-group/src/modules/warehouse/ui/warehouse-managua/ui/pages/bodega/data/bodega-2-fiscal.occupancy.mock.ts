import { BODEGA_2_FISCAL_LAYOUT } from "./bodega-2-fiscal.layout";
import type {
  LocationOccupancy,
  OccupancyMap,
  PolinCount,
  SlotStatus,
} from "../types/warehouse-3d.types";
import {
  FLOOR_POLINES_MAX,
  POLINES_PER_LEVEL,
  RACK_FLOOR_POLINES_MAX,
  polinesFromStatus,
} from "../types/warehouse-3d.types";
import { rackLevelIndex } from "../utils/location-codes";

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

function maxPolinesForCode(code: string): number {
  if (BODEGA_2_FISCAL_LAYOUT.floorTramos.some((t) => t.code === code)) {
    return FLOOR_POLINES_MAX;
  }
  const level = rackLevelIndex(code);
  return level === 0 ? RACK_FLOOR_POLINES_MAX : POLINES_PER_LEVEL;
}

function mockEntry(code: string): LocationOccupancy {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) | 0;
  }
  const n = Math.abs(hash) % 10;
  const max = maxPolinesForCode(code);

  let polines: PolinCount;
  if (n < 3) polines = 0;
  else if (n < 7) polines = Math.max(1, Math.floor(max / 2));
  else polines = max;

  const status: SlotStatus = polines > 0 ? "occupied" : "free";
  return { status, polines };
}

function entry(status: SlotStatus, polines?: PolinCount): LocationOccupancy {
  return {
    status,
    polines: polines ?? polinesFromStatus(status),
  };
}

export function buildBodega2OccupancyMock(): OccupancyMap {
  const map: OccupancyMap = {};
  for (const code of allLocationCodes()) {
    map[code] = mockEntry(code);
  }

  map["T-41"] = entry("free", 0);
  map["T-62"] = entry("occupied", 4);
  map["T-62-01"] = entry("occupied", 1);
  map["T-62-02"] = entry("free", 0);
  map["T-51"] = entry("occupied", 2);
  map["T-51-01"] = entry("occupied", 2);
  map["T-51-02"] = entry("occupied", 2);
  map["T-55-02"] = entry("occupied", 1);
  map["T-80"] = entry("occupied", 3);
  map["T-79"] = entry("occupied", 7);

  return map;
}

export const BODEGA_2_OCCUPANCY_MOCK = buildBodega2OccupancyMock();
