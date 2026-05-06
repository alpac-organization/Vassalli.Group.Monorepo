import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

/** 
 * @description 
 * Interface que define la estructura de props para el componente VacationManagementSection
 * @param profile - Perfil del colaborador
 */
export interface VacationManagementSectionProps {
   profile: GetCollaboratorProfileDetailsResponse;
}

/**
 * @description
 * Interface que define la estructura de props para el componente VacationManagementModal
 * @param isOpen - Estado de apertura del modal
 * @param onClose - Función para cerrar el modal
 * @param onRequestSuccess - Función para manejar el éxito de la solicitud
 * @param onRequestError - Función para manejar el error de la solicitud
 */
export interface VacationManagementModalProps {
   profile: GetCollaboratorProfileDetailsResponse;
   isOpen: boolean;
   onClose: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
}