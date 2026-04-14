import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";

export type DonatedVacationFormProps = {
   application: GetApplicationsResponse;
   beneficiary?: GetCollaboratorProfileDetailsResponse | null
   isLoadingBeneficiary?: boolean
}