import type { CollaboratorProfilePersonalInformation } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import {
  formatIdentificationNumber,
  formatPhone,
} from "@app/shared/utils/string.utils";
import { genderRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/genderRawToLabel";
import { formatIsoString } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { normalizeMaritalStatusFromApi } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/marital-status.utils";

export function mapPersonalInformationToForm(
  personal: CollaboratorProfilePersonalInformation | null,
): Pick<
  PersonalFormData,
  | "identification_number"
  | "gender"
  | "marital_status"
  | "address"
  | "personalEmail"
  | "birthdate"
  | "personalPhone"
  | "department"
> {
  return {
    identification_number: formatIdentificationNumber(
      personal?.identification_number ?? "",
    ),
    gender: genderRawToLabel(personal?.gender ?? null) ?? "",
    marital_status: (() => {
      const code = normalizeMaritalStatusFromApi(personal?.marital_status ?? null);
      return code !== null ? String(code) : "";
    })(),
    birthdate: formatIsoString(personal?.birthdate as string | null),
    address: personal?.address ?? "",
    personalEmail: personal?.personal_email ?? "",
    personalPhone: formatPhone(personal?.personal_phone_number ?? ""),
    department: personal?.department ?? "",
  };
}
