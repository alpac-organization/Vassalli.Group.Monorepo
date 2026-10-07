import type {
  AdditionalReceptionEntranceData,
  ReceptionEntranceDetail,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { DocumentEnum } from "@app/core/enums/document.enum";
import type { MovementDetailFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import {
  formatDateToSpanishWords,
  formatTimeWithSeconds,
} from "@app/shared/utils/string.utils";

export function parseAdditionalData(
  additionalData: unknown,
): AdditionalReceptionEntranceData | null {
  if (!additionalData) return null;
  if (typeof additionalData === "object") {
    return additionalData as AdditionalReceptionEntranceData;
  }
  if (typeof additionalData === "string") {
    try {
      return JSON.parse(additionalData) as AdditionalReceptionEntranceData;
    } catch {
      return null;
    }
  }
  return null;
}

export function isDucaDocumentType(detail: ReceptionEntranceDetail): boolean {
  const parsed = parseAdditionalData(detail.additional_data);
  const docType =
    detail.document_type ??
    parsed?.document_numbers?.[0]?.document_type;

  if (docType == null) return false;

  const num = Number(docType);
  if (num === Number(DocumentEnum.DUCA.value) || num === 1 || num === 3) {
    return true;
  }

  const str = String(docType).toUpperCase();
  return str.includes("DUCA");
}

export function mapDetailToFormValues(
  detail: ReceptionEntranceDetail,
): MovementDetailFormValues {
  const transport = detail.reception_transport_entrance_information;
  const customBranches = detail.custom_branches_information;
  const parsed = parseAdditionalData(detail.additional_data);

  // Evidencias desde additional_data
  const evidenceUrls = (parsed?.evidence_urls ?? [])
    .map((e) => e.image_url ?? e.document_url ?? "")
    .filter(Boolean);

  // Documento principal
  const firstDoc = parsed?.document_numbers?.[0];
  const docTypeRaw = detail.document_type ?? firstDoc?.document_type;

  // Declaración aduanera
  const customsDoc = parsed?.document_numbers?.find((d) => {
    const dt = Number(d.document_type);
    return (
      dt === Number(DocumentEnum.CustomsDeclaration.value) ||
      dt === 2 ||
      dt === 4 ||
      String(d.document_type).toUpperCase().includes("CUSTOM")
    );
  });

  // Fechas de inicio desde created_at
  const startDateRaw = detail.created_at ? detail.created_at.slice(0, 10) : "";
  const startTimeRaw = detail.created_at ? detail.created_at.slice(11, 19) : "";

  return {
    document_type: resolveDocumentTypeLabel(docTypeRaw),
    country_of_origin: detail.country_of_origin ?? "",
    start_date: formatDateToSpanishWords(startDateRaw) ?? "",
    start_time: formatTimeWithSeconds(startTimeRaw) ?? "",
    customs_decaration_number: customsDoc?.document_numbers ?? "",
    plate_number: transport?.vehicle_plate_number ?? "",
    trailer_chassis: transport?.vehicle_chassis_number ?? "",
    container_number: detail.container_number ?? "",
    driver_name: transport?.driver_name ?? "",
    driver_license: transport?.driver_license ?? "",
    transportista: transport?.transportista ?? "",
    transport_unit:
      transport?.transport_unit != null ? String(transport.transport_unit) : "",
    seal_number: detail.seal_number ?? "",
    custom_branch:
      customBranches?.customs_branch_name || customBranches?.code || "",
    evidence_urls: evidenceUrls,
  };
}
