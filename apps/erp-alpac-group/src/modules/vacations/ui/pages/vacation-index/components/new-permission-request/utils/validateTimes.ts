import type {
  PermissionFormSetError,
  PermissionRequestFormValues,
} from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/permission-form.types";

export const validateTimesUtils = (
  showTimeInputs: boolean,
  setError: PermissionFormSetError,
  values: PermissionRequestFormValues,
) => {
  if (showTimeInputs) {
    if (!values.start_time) {
      setError("start_time", {
        type: "manual",
        message: "La hora de inicio es requerida.",
      });
      return false;
    }
    if (!values.end_time) {
      setError("end_time", {
        type: "manual",
        message: "La hora de fin es requerida.",
      });
      return false;
    }
  }
  return true;
};
