import type { UserStatusEnumMap } from "@app/core/enums/user-status.enum";

/**
 * Resumen de usuario asociado a una falta/sanción
 * (quién registró la falta o quién emitió la sanción).
 *
 * @property {string} user_id - Identificador del usuario.
 * @property {string|null} full_name - Nombre completo (puede ser null si no está disponible).
 * @property {string|null} email - Correo electrónico.
 * @property {UserStatusEnumMap} status - Estado del usuario (ej. `Active`).
 *
 * @example
 * ```ts
 * const user: DisciplinaryUserResponse = {
 *   user_id: "11111111-1111-1111-1111-111111111111",
 *   full_name: "Maria Lopez",
 *   email: "maria.lopez@empresa.com",
 *   status: "Active",
 * };
 * ```
 */
export interface DisciplinaryUserResponse {
  user_id: string;
  full_name: string | null;
  email: string | null;
  status: UserStatusEnumMap;
}
