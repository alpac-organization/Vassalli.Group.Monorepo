import type { PermissionFormSetError } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-form.types";

export const validateDatesUtils = (
  requestedDays: number,
  setError: PermissionFormSetError,
) => {
  if (requestedDays === 0) {
    setError("end_date", {
      type: "manual",
      message: "La fecha de fin debe ser igual o posterior a la de inicio.",
    });
    return false;
  }
  return true;
};
