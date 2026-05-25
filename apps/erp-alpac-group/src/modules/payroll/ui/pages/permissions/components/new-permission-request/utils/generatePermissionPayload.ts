import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { PermissionRequestFormValues } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-form.types";
import { PERMISSION_TYPE_TO_ENUM_VALUE } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/new-permissionFormProps";
import { formatTimeHoursOnly } from "@app/shared/utils/string.utils";
import dayjs from "dayjs";

interface PayloadContext {
  companyId: string;
  moduleCode: string;
  identificationNumber: string;
  channel: number;
  timeFormatType: string;
  isSameDay: boolean;
  payrollId: string;
}

export const generatePermissionPayload = (
  values: PermissionRequestFormValues,
  context: PayloadContext,
): CreatePermissionRequestBase => {
  const {
    companyId,
    moduleCode,
    identificationNumber,
    channel,
    timeFormatType,
    isSameDay,
    payrollId,
  } = context;

  // Minimo de horas para que se considere un dia completo
  const minHoursToFullDay = 5;

  // Helpers internos de conversión
  const convertToIsoUtcZ = (ymd: any) =>
    new Date(ymd).toISOString().split(".")[0] + "Z";

  const startDate = dayjs(values.start_date);
  const endDate = dayjs(values.end_date);

  const hoursDiff =
    startDate && endDate ? endDate.diff(startDate, "hour", true) : 0;

  const isFullDay = () => {
    if (timeFormatType === "fullDay" && isSameDay) return true;
    if (
      timeFormatType === "halfDay" &&
      isSameDay &&
      hoursDiff > minHoursToFullDay
    )
      return true;
    if (
      timeFormatType === "rangeOfHours" &&
      isSameDay &&
      hoursDiff > minHoursToFullDay
    )
      return true;
    return false;
  };

  // Estructura base
  const payload: CreatePermissionRequestBase = {
    company_id: companyId,
    module_code: moduleCode,
    identification_number: identificationNumber.trim(),
    channel,
    permit_application_type: PERMISSION_TYPE_TO_ENUM_VALUE[values.type],
    description: values.description.trim(),
    payroll_id: payrollId.trim(),
  };

  // Asignación de datos específicos por tipo
  if (values.type === "Vacation") {
    payload.permit_application_vacation = {
      start_date: convertToIsoUtcZ(values.start_date.$d),
      end_date: convertToIsoUtcZ(values.end_date.$d),
      start_time:
        timeFormatType === "rangeOfHours"
          ? formatTimeHoursOnly(values.start_time)
          : null,
      end_time:
        timeFormatType === "rangeOfHours"
          ? formatTimeHoursOnly(values.end_time)
          : null,
      is_full_day: isFullDay(),
      is_it_midday:
        timeFormatType === "halfDay" &&
        isSameDay &&
        hoursDiff <= minHoursToFullDay,
      with_range_hours:
        timeFormatType === "rangeOfHours" &&
        isSameDay &&
        hoursDiff <= minHoursToFullDay,
    };
  } else if (values.type === "MedicalAppointment") {
    payload.permit_application_medical_appointment = {
      is_full_day: isFullDay(),
      start_date: convertToIsoUtcZ(values.start_date.$d),
      start_time: formatTimeHoursOnly(values.start_time),
      end_time: formatTimeHoursOnly(values.end_time),
    };
  } else if (values.type === "DonatedVacations") {
    payload.permit_application_donated_vacations = {
      amount_days: values.donated_vacation_days || 0,
      identification_collaborator_to_receive:
        values.beneficiary_identification?.trim() || "",
    };
  }

  return payload;
};
