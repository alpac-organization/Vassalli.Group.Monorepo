import type { PermissionFormSetError } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-form.types";

export const validateSessionContextUtils = (
  companyId: string,
  moduleCode: string,
  identificationNumber: string,
  setError: PermissionFormSetError,
) => {
  if (!companyId.trim() || !moduleCode.trim() || !identificationNumber.trim()) {
    setError("root", {
      type: "manual",
      message:
        "Falta el contexto de sesión (empresa, módulo o identificación). Vuelve a iniciar sesión o contacta al administrador.",
    });
    return false;
  }
  return true;
};
