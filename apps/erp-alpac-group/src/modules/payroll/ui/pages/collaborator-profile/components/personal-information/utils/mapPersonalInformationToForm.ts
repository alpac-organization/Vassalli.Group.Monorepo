import type { CollaboratorProfilePersonalInformation } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { genderRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/genderRawToLabel";
import { formatIsoString } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { normalizeMaritalStatusFromApi } from "./normalizeMaritalStatusFromApi";

export function mapPersonalInformationToForm(
  personal: CollaboratorProfilePersonalInformation | undefined,
): Pick<
  PersonalFormData,
  | "identification_number"
  | "gender"
  | "marital_status"
  | "birthdate"
  | "address"
  | "personalEmail"
  | "personalPhone"
  | "department_id"
  | "departament"
> {
  return {
    identification_number: formatIdentificationNumber(
      personal?.identification_number ?? "",
    ),
    gender: genderRawToLabel(personal?.gender) ?? "",
    marital_status: normalizeMaritalStatusFromApi(personal?.marital_status),
    birthdate: formatIsoString(personal?.birthdate as string | null),
    address: personal?.address ?? "",
    personalEmail: personal?.personal_email ?? "",
    personalPhone: personal?.personal_phone_number ?? "",
    department_id:
      personal?.departament_id !== undefined &&
      personal?.departament_id !== null
        ? String(personal.departament_id)
        : "",
    departament: "",
  };
}
