import type { WorkFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import { isOperatorRole } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/collaboratorProfileRoles";

const CONTACT_WORK_FIELDS: (keyof WorkFormData)[] = [
  "workEmail",
  "workPhoneNumber",
];

/**
 * Operator: solo puede editar correo y teléfono de trabajo.
 * Administrador y demás roles (no operator): edición completa en la sección laboral.
 */
export function workFieldAllowEdit(
  role: string,
  field: keyof WorkFormData,
): boolean {
  if (isOperatorRole(role)) {
    return CONTACT_WORK_FIELDS.includes(field);
  }
  return true;
}
