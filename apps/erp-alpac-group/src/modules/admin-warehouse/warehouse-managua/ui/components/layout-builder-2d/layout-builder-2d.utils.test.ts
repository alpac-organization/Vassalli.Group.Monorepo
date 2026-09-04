import { describe, expect, it } from "vitest";
import {
  pixelRectToSpatialDraft,
} from "./layout-builder-2d.utils";
import {
  composeSpatialTransform,
  mapSectionResponseToLayoutEntity,
  normalizeRotation,
} from "./utils/layout-entity.mapper";

describe("warehouse spatial contract", () => {
  it("converts screen pixels to metre X/Z without zoom data", () => {
    expect(
      pixelRectToSpatialDraft({ x: 20, y: 40, width: 60, height: 80 }),
    ).toEqual({
      position_x: 1,
      position_y: 0,
      position_z: 2,
      rotation_y: 0,
      width_metres: 3,
      length_metres: 4,
    });
  });

  it("normalizes quarter-turn rotations", () => {
    expect(normalizeRotation(450)).toBe(90);
    expect(normalizeRotation(-90)).toBe(270);
  });

  it("composes parent and local child transforms", () => {
    expect(
      composeSpatialTransform(
        { position_x: 10, position_y: 2, position_z: 5, rotation_y: 90 },
        { position_x: 3, position_y: 1, position_z: 2, rotation_y: 270 },
      ),
    ).toEqual({
      position_x: 8,
      position_y: 3,
      position_z: 8,
      rotation_y: 0,
    });
  });

  it("preserves section elevation and all valid quarter-turns", () => {
    const section = mapSectionResponseToLayoutEntity({
      section_id: "section-1",
      section_code: "S-01",
      section_name: "Section",
      section_type: null,
      storage_type: null,
      is_active: true,
      width_metres: 8,
      length_metres: 4,
      transform: {
        position_x: 10,
        position_y: 2,
        position_z: 5,
        rotation_y: 270,
      },
      total_area_m2: 32,
      used_area_m2: 0,
      total_positions: 0,
      used_positions: 0,
    });

    expect(section).toMatchObject({
      position_y: 2,
      rotation_y: 270,
      width_metres: 4,
      length_metres: 8,
    });
  });
});
