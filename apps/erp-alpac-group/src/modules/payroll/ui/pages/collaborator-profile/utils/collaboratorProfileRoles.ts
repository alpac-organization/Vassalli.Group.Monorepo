/**
 * Detección de roles para permisos en el perfil de colaborador.
 * Ajustar strings si el backend usa otros valores en `useUserStore().role`.
 */

/** Rol operator (colaborador): solo lectura en información laboral; subset en datos personales. */
export function isOperatorRole(role: string): boolean {
  const r = role.toLowerCase().trim();
  return r === "operator" || r.includes("operator");
}

/** Administrador: edición amplia según pantalla y contrato de API. */
export function isAdministratorRole(role: string): boolean {
  const r = role.toLowerCase().trim();
  return (
    r.includes("admin") ||
    r === "administrator" ||
    r === "administrador"
  );
}
