import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

/**
 * @description
 * Interface que define la estructura de props para el componente SubsidyManagementSection
 * @param profile - Perfil del colaborador
 */
export interface SubsidyManagementSectionProps {
   profile: GetCollaboratorProfileDetailsResponse;
}