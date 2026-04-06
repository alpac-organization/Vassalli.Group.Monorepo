import { IdentificationEnum } from "@app/core/enums/identifcation.enum";
import type { CollaboratorProfilePersonalInformation } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { genderRawToLabel } from "./genderRawToLabel";
import { identificationRawToLabel } from "./identificationRawToLabel";
import { maritalRawToLabel } from "./maritalRawToLabel";

/** Mapea `personal_information` del API a valores iniciales del formulario (labels vía utils). */
export function mapPersonalInformationToForm(
  personal: CollaboratorProfilePersonalInformation | undefined,
): Pick<
  PersonalFormData,
  | "identification_type"
  | "identification_number"
  | "gender"
  | "marital_status"
  | "address"
  | "personalEmail"
  | "personalPhone"
  | "departament"
> {
  return {
    identification_type: identificationRawToLabel(
      personal?.identification_type ?? "",
    ),
    identification_number: formatIdentificationNumber(
      personal?.identification_number ?? "",
    ),
    gender: genderRawToLabel(personal?.gender) ?? "",
    marital_status: maritalRawToLabel(personal?.marital_status) ?? "",
    address: personal?.address ?? "",
    personalEmail: personal?.personal_email ?? "",
    personalPhone: personal?.personal_phone_number ?? "",
    departament: personal?.departament ?? "",
  };
}
