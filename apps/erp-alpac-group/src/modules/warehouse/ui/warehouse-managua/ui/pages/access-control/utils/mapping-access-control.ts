import type {
  CreateAccessControlRequest,
  GeneralInformationRequest,
  TransportInformationRequest,
  CustomsDeclarationInformationRequest,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
import dayjs from "dayjs";
import type { DatePickerValue } from "@alpac/design-system";

export function mapGateEntryToCreateRequest(
  data: GateEntryFormValues,
  documentType: DocumentType,
  companyId: string,
  moduleCode: string,
): CreateAccessControlRequest {
  const isCustomsDeclaration =
    Number(documentType.value) ===
    Number(DocumentEnum.CustomsDeclaration.value);

  const general_information: GeneralInformationRequest = {
    custom_branch_id: data.customBranchId.trim(),
    seal_number: data.sealNumber.trim(),
    country_origin: data.countryOfOrigin.trim(),
    container_number: data.containerNumber.trim(),
    document_type: Number(documentType.value),
    ducat_numbers: isCustomsDeclaration
      ? []
      : data.ducas.map((duca) => duca.value.trim()).filter(Boolean),
    customs_declaration_number: isCustomsDeclaration
      ? data.customsDeclarationNumber.trim()
      : null,
  };

  const transport_information: TransportInformationRequest = {
    driver_name: data.driverName.trim(),
    driver_license: data.driverLicense.trim(),
    transportista: data.transportista.trim(),
    vehicle_plate_number: data.plateNumber.trim().toUpperCase(),
    vehicle_chassis_number: data.trailerChassis.trim(),
    transport_unit: Number(data.transportUnitId),
  };

  const customs_declaration_information: CustomsDeclarationInformationRequest | null =
    isCustomsDeclaration
      ? {
          total_weight: Number(data.totalWeight || 0),
          package_number: Number(data.packages || 0),
          product_description: data.product?.trim() || null,
          observations: data.observations?.trim() || null,
        }
      : null;

  return {
    company_id: companyId,
    module_code: moduleCode,
    general_information,
    transport_information,
    customs_declaration_information,
    evidence_base64: (data.sealEvidence ?? []).map((img) => img.imageBase64),
  };
}

export const toApiDate = (date: DatePickerValue | null): string => {
  if (!date) return "";
  const parsed = dayjs.isDayjs(date) ? date : dayjs(date.$d ?? date);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};
