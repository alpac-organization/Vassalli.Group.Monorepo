export const LOGO_MAX_WIDTH = 120;
export const LOGO_MAX_HEIGHT = 48;
export const C = {
  headerBg: "FFF3F4F6",
  areaHeaderBg: "FFB8D4F0",
  areaHeaderText: "FF1E3A5F",
  areaTotalsBg: "FFE8F0FE",
  areaTotalsText: "FF1E3A5F",
  globalBg: "FFB8D4F0",
  globalText: "FF1E3A5F",
  border: "FFBFBFBF",
  subtitleText: "FF555555",
} as const;

export const THIN_BORDER = {
  top: { style: "thin" as const, color: { argb: C.border } },
  left: { style: "thin" as const, color: { argb: C.border } },
  bottom: { style: "thin" as const, color: { argb: C.border } },
  right: { style: "thin" as const, color: { argb: C.border } },
};
