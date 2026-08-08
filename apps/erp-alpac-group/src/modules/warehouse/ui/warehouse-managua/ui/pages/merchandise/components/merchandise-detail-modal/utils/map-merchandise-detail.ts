import type {
  GetMerchandiseDetailResponse,
  MerchandiseDucatDetailDto,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import type { MerchandiseDetailDisplayValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/types/merchandise-detail-modal.types";
import {
  formatDateToSpanishWords,
  formatDuration,
  formatTime,
  formatTimeWithSeconds,
} from "@app/shared/utils/string.utils";

function display(value: string | number | null | undefined): string {
  if (value == null) return "";
  const text = String(value).trim();
  return text;
}

export function isDucaMerchandiseDocument(
  detail: GetMerchandiseDetailResponse,
): boolean {
  const documentType = detail.reception?.document_type;
  if (!documentType) return false;

  const typeString = String(documentType).trim();
  if (typeString === "DUCA") return true;

  const label = resolveDocumentTypeLabel(documentType).toUpperCase();
  return label.includes("DUCA");
}

export function mapMerchandiseDetailToDisplay(
  detail: GetMerchandiseDetailResponse,
): MerchandiseDetailDisplayValues {
  const reception = detail.reception;
  const registration = detail.merchandise_registration;
  const duca = detail.duca_registry;
  const customs = detail.customs_declaration;

  return {
    documentType: resolveDocumentTypeLabel(reception?.document_type),
    countryOfOrigin: display(reception?.country_of_origin),
    registrationDate:
      formatDateToSpanishWords(
        registration?.merchandise_registration_date ?? "",
      ) ?? "",
    registrationTime:
      formatTimeWithSeconds(
        registration?.merchandise_registration_time ?? "",
      ) ?? "",
    registrationEndDate:
      formatDateToSpanishWords(
        registration?.merchandise_registration_end_date ?? "",
      ) ?? "",
    registrationEndTime:
      formatTimeWithSeconds(
        registration?.merchandise_registration_end_time ?? "",
      ) ?? "",
    durationFormatted:
      formatDuration(registration?.duration_formatted ?? "") ?? "",
    registeredByUserName: display(
      registration?.merchandise_registered_by_user_name,
    ),
    finishedByUserName: display(
      registration?.merchandise_finished_by_user_name,
    ),
    plateNumber: display(reception?.plate_number),
    trailerChassis: display(reception?.trailer_chassis),
    driverName: display(reception?.driver_name),
    driverLicense: display(reception?.driver_license),
    transportista: display(reception?.transportista),
    transportUnitName: display(reception?.transport_unit_name),
    sealNumber: display(reception?.seal_number),
    aduana: display(reception?.aduana),
    containerNumber: display(reception?.container_number),
    transportUnitExitDate:
      formatDateToSpanishWords(reception?.transport_unit_exit_date ?? "") ?? "",
    transportUnitExitTime:
      formatTime(reception?.transport_unit_exit_time ?? "") ?? "",
    customsDeclarationNumber: display(customs?.customs_declaration_number),
    packages: customs?.packages != null ? String(customs.packages) : "",
    customer: display(customs?.customer),
    product: display(customs?.product),
    serviceOrderCode: display(customs?.service_order_code),
    ducaEmpresa: display(duca?.empresa),
    ducaObservations: display(duca?.general_observations),
    ducaIsInTransit:
      duca?.is_in_transit == null ? "" : duca.is_in_transit ? "Sí" : "No",
    ducaRegisteredBy: display(duca?.registered_by_user_name),
    ducaRegisteredStartDate:
      formatDateToSpanishWords(duca?.registered_start_date ?? "") ?? "",
    ducaRegisteredStartTime:
      formatTimeWithSeconds(duca?.registered_start_time ?? "") ?? "",
    ducaRegisteredEndDate:
      formatDateToSpanishWords(duca?.registered_end_date ?? "") ?? "",
    ducaRegisteredEndTime:
      formatTimeWithSeconds(duca?.registered_end_time ?? "") ?? "",
    ducaDuration: formatDuration(duca?.duration_formatted ?? "") ?? "",
    ducaUpdatedBy: display(duca?.updated_by_user_name),
    ducaUpdatedDate: formatDateToSpanishWords(duca?.updated_date ?? "") ?? "",
    ducaUpdatedTime: formatTime(duca?.updated_time ?? "") ?? "",
  };
}

export function mapDucatToDisplay(ducat: MerchandiseDucatDetailDto) {
  return {
    ducatNumber: display(ducat.ducat_number),
    status:
      typeof ducat.status === "object" && ducat.status
        ? ((ducat.status as { label?: string }).label ?? "")
        : display(ducat.status as unknown as string),
    merchandiseName: display(ducat.merchandise_name),
    totalBultos: ducat.total_bultos != null ? String(ducat.total_bultos) : "",
    totalWeight: ducat.total_weight != null ? String(ducat.total_weight) : "",
    productDescription: display(ducat.product_description),
    remitente: display(ducat.remitente),
    destinationAreaObservation: display(ducat.destination_area_observation),
    serviceOrderCode: display(ducat.service_order_code),
    registeredByUserName: display(ducat.registered_by_user_name),
    registeredStartDate:
      formatDateToSpanishWords(ducat.registered_start_date ?? "") ?? "",
    registeredStartTime:
      formatTimeWithSeconds(ducat.registered_start_time ?? "") ?? "",
    registeredEndDate:
      formatDateToSpanishWords(ducat.registered_end_date ?? "") ?? "",
    registeredEndTime:
      formatTimeWithSeconds(ducat.registered_end_time ?? "") ?? "",
    durationFormatted: formatDuration(ducat.duration_formatted ?? "") ?? "",
    updatedByUserName: display(ducat.updated_by_user_name),
    updatedDate: formatDateToSpanishWords(ducat.updated_date ?? "") ?? "",
    updatedTime: formatTime(ducat.updated_time ?? "") ?? "",
  };
}
