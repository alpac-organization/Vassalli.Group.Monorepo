import type { CreateAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import type { DocumentType } from "@app/core/enums/document.enum";
import dayjs from "dayjs";
import type { DatePickerValue } from "@alpac/design-system";
export function mapGateEntryToCreateRequest(
  data: GateEntryFormValues,
  documentType: DocumentType,
  companyId: string,
  moduleCode: string,
): CreateAccessControlRequest {
  const now = dayjs();

  return {
    company_id: companyId,
    module_code: moduleCode,
    ducat_numbers: data.ducas.map((duca) => duca.value.trim()).filter(Boolean),
    document_type: documentType,
    customs_declaration_number:
      data.customsDeclarationNumber?.trim() || undefined,
    packages: data.packages ? Number(data.packages) : undefined,
    customer: data.customer?.trim() || undefined,
    product: data.product?.trim() || undefined,
    container_number: data.containerNumber?.trim() || undefined,
    transport_unit_id: data.transportUnitId.trim(),
    country_of_origin: data.countryOfOrigin.trim(),
    aduana: data.aduana.trim(),
    plate_number: data.plateNumber.trim().toUpperCase(),
    trailer_chassis: data.trailerChassis.trim(),
    driver_license: data.driverLicense.trim(),
    transportista: data.transportista.trim(),
    medio: data.medio.trim(),
    driver_name: data.driverName.trim(),
    consignee: data.consignee.trim(),
    seal_number: data.sealNumber.trim(),
    start_date: now.format("YYYY-MM-DD"),
    start_time: now.format("HH:mm:ss"),
  };
}

export const toApiDate = (date: DatePickerValue | null): string => {
  if (!date) return "";
  return dayjs(date.$d ?? date).format("YYYY-MM-DD");
};
