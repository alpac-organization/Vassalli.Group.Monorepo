import type { CreateAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
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
  const isCustomsDeclaration =
    Number(documentType.value) ===
    Number(DocumentEnum.CustomsDeclaration.value);

  return {
    company_id: companyId,
    module_code: moduleCode,
    ducat_numbers: isCustomsDeclaration
      ? []
      : data.ducas.map((duca) => duca.value.trim()).filter(Boolean),
    document_type: Number(documentType.value),
    customs_declaration_number: isCustomsDeclaration
      ? data.customsDeclarationNumber.trim()
      : undefined,
    packages: isCustomsDeclaration ? Number(data.packages) : undefined,
    customer: isCustomsDeclaration ? data.customer.trim() : undefined,
    product: isCustomsDeclaration ? data.product.trim() : undefined,
    container_number: isCustomsDeclaration
      ? data.containerNumber.trim()
      : undefined,
    transport_unit_id: data.transportUnitId.trim(),
    country_of_origin: data.countryOfOrigin.trim(),
    aduana: data.aduana.trim(),
    plate_number: data.plateNumber.trim().toUpperCase(),
    trailer_chassis: data.trailerChassis.trim(),
    driver_license: data.driverLicense.trim(),
    transportista: data.transportista.trim(),
    medio: data.medio.trim(),
    driver_name: data.driverName.trim(),
    seal_number: data.sealNumber.trim(),
    start_date: entryStartedAt.start_date,
    start_time: entryStartedAt.start_time,
  };
}

export const toApiDate = (date: DatePickerValue | null): string => {
  if (!date) return "";
  return dayjs(date.$d ?? date).format("YYYY-MM-DD");
};
