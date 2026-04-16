import type { CreatePermissionRequestBase } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { PermissionRequestFormValues } from "../types/permission-form.types";
import { PERMISSION_TYPE_TO_ENUM_VALUE } from "../types/new-permissionFormProps";
import { formatTimeHoursOnly } from "@app/shared/utils/string.utils";

interface PayloadContext {
   companyId: string;
   moduleCode: string;
   identificationNumber: string;
   channel: number;
   timeFormatType: string;
   isSameDay: boolean;
}

export const generatePermissionPayload = (values: PermissionRequestFormValues, context: PayloadContext): CreatePermissionRequestBase => {

   const { companyId, moduleCode, identificationNumber, channel, timeFormatType, isSameDay } = context;

   // Helpers internos de conversión
   const convertToIsoUtcZ = (ymd: any) =>
      new Date(ymd).toISOString().split(".")[0] + "Z";

   // Estructura base
   const payload: CreatePermissionRequestBase = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber.trim(),
      channel,
      permit_application_type: PERMISSION_TYPE_TO_ENUM_VALUE[values.type],
      description: values.description.trim(),
   };

   // Asignación de datos específicos por tipo
   if (values.type === "Vacation") {
      payload.permit_application_vacation = {
         start_date: convertToIsoUtcZ(values.start_date.$d),
         end_date: convertToIsoUtcZ(values.end_date.$d),
         start_time: timeFormatType === "rangeOfHours" ? formatTimeHoursOnly(values.start_time) : null,
         end_time: timeFormatType === "rangeOfHours" ? formatTimeHoursOnly(values.end_time) : null,
         is_full_day: timeFormatType === "fullDay" && isSameDay,
         is_it_midday: timeFormatType === "halfDay" && isSameDay,
         with_range_hours: timeFormatType === "rangeOfHours" && isSameDay,
      };

   } else if (values.type === "MedicalAppointment") {
      payload.permit_application_medical_appointment = {
         is_full_day: timeFormatType === "fullDay",
         start_date: convertToIsoUtcZ(values.start_date.$d),
         start_time: formatTimeHoursOnly(values.start_time),
         end_time: formatTimeHoursOnly(values.end_time),
      };

   } else if (values.type === "DonatedVacations") {
      payload.permit_application_donated_vacations = {
         amount_days: values.donated_vacation_days || 0,
         identification_collaborator_to_receive: identificationNumber.trim(),
      };
   }

   return payload;
};
