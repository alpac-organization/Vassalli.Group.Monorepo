import { BODEGA_2_FISCAL_LAYOUT } from "./bodega-2-fiscal.layout";
import type {
  LocationOccupancy,
  OccupancyMap,
  PolinCount,
  SlotStatus,
} from "../types/warehouse-3d.types";
import { polinesFromStatus } from "../types/warehouse-3d.types";

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

function mockEntry(code: string): LocationOccupancy {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash * 31 + code.charCodeAt(i)) | 0;
  }
  const n = Math.abs(hash) % 10;
  let status: SlotStatus;
  let polines: PolinCount;
  if (n < 4) {
    status = "free";
    polines = 0;
  } else if (n < 7) {
    status = "occupied";
    polines = 1;
  } else {
    status = "occupied";
    polines = 2;
  }
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

  map["T-41"] = entry("free");
  map["T-62"] = entry("occupied", 2);
  map["T-62-01"] = entry("occupied", 1);
  map["T-62-02"] = entry("free", 0);
  map["T-51"] = entry("occupied", 1);
  map["T-51-01"] = entry("occupied", 2);
  map["T-51-02"] = entry("occupied", 2);
  map["T-55-02"] = entry("occupied", 1);

  return map;
}

export const BODEGA_2_OCCUPANCY_MOCK = buildBodega2OccupancyMock();
