type WarehouseAreaAttributes = {
   color: string;
}

export const WarehouseAreasColorTypes = {
   Internal: { color: "#d467f5" },
   External: { color: "#38bdf8" },
} as const satisfies Record<string, WarehouseAreaAttributes>;

export const WarehouseLegends = [
   { text: "Área Externa", color: WarehouseAreasColorTypes["External"].color },
   { text: "Área Interna", color: WarehouseAreasColorTypes["Internal"].color },
] as const;