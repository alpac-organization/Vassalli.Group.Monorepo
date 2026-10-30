import { DocumentEnum } from "@app/core/enums/document.enum";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { Option } from "@alpac/design-system";

export const isMobileViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 639px)").matches;

export const DOCUMENT_TYPE_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  { value: "DUCA", label: DocumentEnum.DUCA.label },
  {
    value: "CustomsDeclaration",
    label: DocumentEnum.CustomsDeclaration.label,
  },
];

export function buildFiltersPayload(
  values: AccessControlFilters,
): AccessControlFilters {
  return {
    date: (values.date ?? "").trim() || undefined,
    plate_number: (values.vehicle_plate_number ?? "").trim() || undefined,
    document_number: (values.document_number ?? "").trim() || undefined,
    container_number: (values.container_number ?? "").trim() || undefined,
    reception_code: (values.reception_code ?? "").trim() || undefined,
    document_type: (values.document_type ?? "").trim() || undefined,
  };
}
