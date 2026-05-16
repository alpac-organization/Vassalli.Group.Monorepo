import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export type ProfileSummaryProps = {
  profile?: GetCollaboratorProfileDetailsResponse;
};
