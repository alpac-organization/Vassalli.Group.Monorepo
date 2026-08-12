import { DocumentEnum } from "@app/core/enums/document.enum";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { Option } from "@alpac/design-system";

export const isMobileViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 639px)").matches;

export const DOCUMENT_TYPE_OPTIONS: Option[] = [
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
    ducat_number: (values.ducat_number ?? "").trim(),
    document_number: (values.document_number ?? "").trim(),
    document_type: (values.document_type ?? "").trim(),
    plate_number: (values.plate_number ?? "").trim(),
    driver_name: (values.driver_name ?? "").trim(),
    start_date: values.start_date,
    end_date: values.end_date,
  };
}
