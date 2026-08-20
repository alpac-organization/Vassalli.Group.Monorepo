import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import type { MovementDetailFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import {
  formatDateToSpanishWords,
  formatTimeWithSeconds,
  formatDuration,
  formatTime,
} from "@app/shared/utils/string.utils";

export function isDucaDocumentType(detail: ReceptionEntranceDetail): boolean {
  if (!detail.document_type) return false;

  const typeString = String(detail.document_type).trim();

  if (typeString === "DUCA") return true;

  const label = resolveDocumentTypeLabel(typeString).toUpperCase();
  if (label.includes("DUCA")) {
    return true;
  }

  return false;
}

export function mapDetailToFormValues(
  detail: ReceptionEntranceDetail,
): MovementDetailFormValues {
  const log = detail.execution_log;
  const customs = detail.customs_declaration;
  return {
    status: detail.status ?? "",
    is_consolidated: detail.is_consolidated ? "Sí" : "No",
    document_type: resolveDocumentTypeLabel(detail.document_type),
    start_date: formatDateToSpanishWords(log?.start_date ?? "") ?? "",
    start_time: formatTimeWithSeconds(log?.start_time ?? "") ?? "",
    end_date: log?.end_date ?? "",
    end_time: formatTimeWithSeconds(log?.end_time ?? "") ?? "",
    duration_formatted: formatDuration(log?.duration_formatted ?? "") ?? "",
    processed_by_user_name: log?.processed_by_user_name ?? "",
    plate_number: detail.plate_number ?? "",
    driver_name: detail.driver_name ?? "",
    driver_license: detail.driver_license ?? "",
    trailer_chassis: detail.trailer_chassis ?? "",
    transportista: detail.transportista ?? "",
    transport_unit: detail.transport_unit ?? "",
    seal_number: detail.seal_number ?? "",
    country_of_origin: detail.country_of_origin ?? "",
    custom_branch: detail.custom_branch ?? "",
    evidence_urls: detail.evidence_urls ?? [],
    customs_decaration_number: customs?.customs_decaration_number ?? "",
    packages: customs?.packages != null ? String(customs.packages) : "",
    customer: customs?.customer ?? "",
    product: customs?.product ?? "",
    container_number: detail.container_number ?? "",
    vehicle_exit_date:
      formatDateToSpanishWords(detail.vehicle_exit_date ?? "") ?? "",
    vehicle_exit_time: formatTime(detail.vehicle_exit_time ?? "") ?? "",
    container_exit_date:
      formatDateToSpanishWords(detail.container_exit_date ?? "") ?? "",
    container_exit_time: formatTime(detail.container_exit_time ?? "") ?? "",
    updated_by_user_name: detail.updated_by_user_name ?? "",
    updated_date: formatDateToSpanishWords(detail.updated_date ?? "") ?? "",
    updated_time: formatTime(detail.updated_time ?? "") ?? "",
  };
}
