import type { NavigateFunction } from "react-router-dom";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { ModuleEnum } from "@app/core/enums/module.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";

/** Token fijo de sesión mock; Axios lo usa para no forzar refresh ni logout en 401. */
export const DEV_MOCK_ACCESS_TOKEN = "dev-mock-access-token";

function isDevMockAuthExplicitlyDisabled(): boolean {
  const v = import.meta.env.VITE_DEV_MOCK_AUTH?.trim().toLowerCase();
  return v === "false" || v === "0";
}

/**
 * Muestra el botón "Entrar sin servidor" en /auth.
 * En desarrollo está activo por defecto; desactívalo con VITE_DEV_MOCK_AUTH=false.
 */
export function isDevMockLoginUiVisible(): boolean {
  return import.meta.env.DEV === true && !isDevMockAuthExplicitlyDisabled();
}

/**
 * Sesión mock aplicada (cookies). Solo entonces se relajan refresh/401 en Axios.
 */
export function isDevMockSessionActive(): boolean {
  return CookieStorageAdapter.getToken() === DEV_MOCK_ACCESS_TOKEN;
}

/**
 * Replica el efecto de un login exitoso: cookies, store y navegación al dashboard.
 */
export function applyDevMockSession(navigate: NavigateFunction): void {
  if (!isDevMockLoginUiVisible()) return;

  const companyAlias = (
    import.meta.env.VITE_DEV_MOCK_COMPANY_ALIAS ?? "alpac"
  ).toLowerCase();
  const companyId =
    import.meta.env.VITE_DEV_MOCK_COMPANY_ID ??
    "00000000-0000-0000-0000-000000000001";
  const moduleCode =
    import.meta.env.VITE_DEV_MOCK_MODULE_CODE ?? ModuleEnum.PAYROLL;
  const role = import.meta.env.VITE_DEV_MOCK_ROLE ?? RoleEnum.ADMINISTRATOR;

  CookieStorageAdapter.setDevMockSession(DEV_MOCK_ACCESS_TOKEN, companyAlias);

  useUserStore.setState({
    fullName: "Usuario (mock)",
    email: "dev.mock@local.test",
    userName: "dev.mock",
    companyId,
    companyName: "Empresa (mock)",
    companyAlias,
    identificationNumber: "0000000000",
    moduleCode,
    role,
  });

  navigate(`/${companyAlias}/dashboard`, { replace: true });
}
