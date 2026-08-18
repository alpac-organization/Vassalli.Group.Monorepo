import type {
  CreateAccessControlRequest,
  DeclarationAduanaPayload,
  DucaPayload,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
import dayjs from "dayjs";
import type { DatePickerValue } from "@alpac/design-system";

export type EntryStartedAt = {
  start_date: string;
  start_time: string;
};

export function mapGateEntryToCreateRequest(
  data: GateEntryFormValues,
  documentType: DocumentType,
  companyId: string,
  moduleCode: string,
  entryStartedAt: EntryStartedAt,
): CreateAccessControlRequest {
  const base = {
    company_id: companyId,
    module_code: moduleCode,
    document_type: Number(documentType.value),
    transport_unit: Number(data.transportUnitId),
    country_of_origin: data.countryOfOrigin.trim(),
    custom_branch_id: data.customBranchId.trim(),
    vehicle_plate_number: data.plateNumber.trim().toUpperCase(),
    vehicle_chassis_number: data.trailerChassis.trim(),
    container_number: data.containerNumber.trim(),
    driver_license: data.driverLicense.trim(),
    transportista: data.transportista.trim(),
    driver_name: data.driverName.trim(),
    seal_number: data.sealNumber.trim(),
    seal_evidence: (data.sealEvidence ?? []).map((img) => ({
      image_base64: img.imageBase64,
      content_type: img.contentType,
    })),
    start_date: entryStartedAt.start_date,
    start_time: entryStartedAt.start_time,
  };

  const isCustomsDeclaration =
    Number(documentType.value) ===
    Number(DocumentEnum.CustomsDeclaration.value);

  if (isCustomsDeclaration) {
    const payload: DeclarationAduanaPayload = {
      ...base,
      customs_declaration_number: data.customsDeclarationNumber.trim(),
      packages: Number(data.packages),
      customer: data.customer.trim(),
      product: data.product.trim(),
    };
    return payload;
  }

  const payload: DucaPayload = {
    ...base,
    ducat_numbers: data.ducas.map((duca) => duca.value.trim()).filter(Boolean),
  };
  return payload;
}

export const toApiDate = (date: DatePickerValue | null): string => {
  if (!date) return "";
  const parsed = dayjs.isDayjs(date) ? date : dayjs(date.$d ?? date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};
