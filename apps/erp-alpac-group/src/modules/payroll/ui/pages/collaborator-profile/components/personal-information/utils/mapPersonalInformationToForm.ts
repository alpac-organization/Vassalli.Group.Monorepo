import type { CollaboratorProfilePersonalInformation } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { genderRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/genderRawToLabel";
import { maritalRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/maritalRawToLabel";
import { toHtmlDateInputValue } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
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
    marital_status: maritalRawToLabel(personal?.marital_status) ?? "",
    birthdate: toHtmlDateInputValue(personal?.birthdate as string | Date),
    address: personal?.address ?? "",
    personalEmail: personal?.personal_email ?? "",
    personalPhone: personal?.personal_phone_number ?? "",
    department_id:
      personal?.department_id !== undefined && personal?.department_id !== null
        ? String(personal.department_id)
        : "",
    departament: personal?.departament ?? "",
  };
}
