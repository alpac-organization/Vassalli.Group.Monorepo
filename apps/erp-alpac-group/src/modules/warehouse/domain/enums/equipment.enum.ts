export const EquipmentTypeLabels: Record<string, string> = {
  Forklift: "Montacargas",
  WheelLoader: "Cargadora frontal",
  Truck: "Camión",
  Pickup: "Camioneta",
  Conveyor: "Transportador",
  BrushCutter: "Desbrozadora",
  Generator: "Generador",
  PressureWasher: "Hidrolavadora",
  Blower: "Sopladora",
  WaterPump: "Motobomba",
};

export function getEquipmentTypeLabel(type?: string | null): string {
  if (!type) return "—";
  return EquipmentTypeLabels[type] ?? type;
}