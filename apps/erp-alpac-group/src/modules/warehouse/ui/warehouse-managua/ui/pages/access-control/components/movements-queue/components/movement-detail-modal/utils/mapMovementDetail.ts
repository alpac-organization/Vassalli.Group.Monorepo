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
  const normalizeTime = (value?: string | null): string => {
    if (!value?.trim()) return "";
    return value
      .trim()
      .split(":")
      .map((part, index) => (index === 2 ? part.split(".")[0] || "00" : part))
      .join(":");
  };

  const formatSpanishDateTime = (date?: string | null, time?: string | null): string => {
    if (!date && !time) return "";
    let datePart = "";
    if (date) {
      const parts = date.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0));
        const weekday = parsedDate.toLocaleDateString("es-NI", { weekday: "long", timeZone: "UTC" });
        datePart = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
      } else {
        datePart = date;
      }
    }

    let timePart = "";
    if (time?.trim()) {
      const [hours, minutes, secondsRaw = "00"] = time.split(":");
      const hourNumber = Number(hours);
      const minuteNumber = Number(minutes);
      const seconds = (secondsRaw || "00").split(".")[0] || "00";
      const secondNumber = Number(seconds);
      if (!Number.isNaN(hourNumber) && !Number.isNaN(minuteNumber)) {
        const period = hourNumber >= 12 ? "pm" : "am";
        const normalizedHour = hourNumber % 12 || 12;
        timePart = `${String(normalizedHour).padStart(2, "0")}:${String(minuteNumber).padStart(2, "0")}:${String(Number.isNaN(secondNumber) ? 0 : secondNumber).padStart(2, "0")} ${period}`;
      } else {
        timePart = time;
      }
    }

    return [datePart, timePart].filter(Boolean).join(" ");
  };

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
    registration_date_time: formatSpanishDateTime(startDateRaw, startTimeRaw),
    vehicle_exit_date: detail.vehicle_exit_date ?? transport?.vehicle_exit_date ?? "",
    vehicle_exit_time: normalizeTime(detail.vehicle_exit_time ?? transport?.vehicle_exit_time ?? ""),
    vehicle_exit_date_time: formatSpanishDateTime(
      detail.vehicle_exit_date ?? transport?.vehicle_exit_date ?? "",
      detail.vehicle_exit_time ?? transport?.vehicle_exit_time ?? "",
    ),
    container_exit_date: detail.container_exit_date ?? transport?.container_exit_date ?? "",
    container_exit_time: normalizeTime(detail.container_exit_time ?? transport?.container_exit_time ?? ""),
    container_exit_date_time: formatSpanishDateTime(
      detail.container_exit_date ?? transport?.container_exit_date ?? "",
      detail.container_exit_time ?? transport?.container_exit_time ?? "",
    ),
    customs_decaration_number: customsDoc?.document_numbers ?? "",
    plate_number: transport?.vehicle_plate_number ?? detail.vehicle_plate_number ?? "",
    trailer_chassis: transport?.vehicle_chassis_number ?? "",
    container_number: detail.container_number ?? "",
    driver_name: transport?.driver_name ?? "",
    driver_license: transport?.driver_license ?? "",
    transportista: transport?.transportista ?? "",
    transport_unit:
      transport?.transport_unit === "Container" ||
      transport?.transport_unit === 1 ||
      transport?.transport_unit === "1"
        ? "1"
        : transport?.transport_unit === "Van" ||
            transport?.transport_unit === 2 ||
            transport?.transport_unit === "2"
          ? "2"
          : transport?.transport_unit != null
            ? String(transport.transport_unit)
            : "",
    seal_number: detail.seal_number ?? "",
    custom_branch:
      customBranches?.customs_branch_name || customBranches?.code || "",
    evidence_urls: evidenceUrls,
  };
}
