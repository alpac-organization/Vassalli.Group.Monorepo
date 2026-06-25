import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import { PermissionTypeEnum } from "@app/modules/payroll/domain/enums/permission-enums/permissionType.enum";

import type { ChannelEnum } from "@app/core/enums/channel.enum";
import { VacationTypeEnum } from "@app/modules/payroll/domain/enums/vacation-enums/vacation-type.enum";
import type { PermissionType } from "./permission.types";
import type { ApplicationType } from "./application.types";
/**
 * Propiedades requeridas para el formulario de nueva solicitud de permiso.
 * Utilizado para manejar acciones y datos externos al formulario.
 */
export type NewPermissionRequestFormProps = {
   isPending: boolean;
   onSubmit: (payload: CreatePermissionRequestBase) => void;
   onCancel: () => void;
   companyId: string;
   moduleCode: string;
   identificationNumber: string;
   channel: ChannelEnum;
   payrollId?: string;
   onValidationError?: (message: string) => void;
};

export const PERMISSION_TYPE_TO_ENUM_VALUE: Record<ApplicationType | PermissionType, number> = {
   Vacation: VacationTypeEnum.VACATION.value,
   MedicalAppointment: PermissionTypeEnum.MEDICAL_APPOINTMENT.value,
   /* CompensatoryTime: PermissionTypeEnum.COMPENSATORY_TIME.value,
    PaidLeave: PermissionTypeEnum.PAID_LEAVE.value,
    UnpaidLeave: PermissionTypeEnum.UNPAID_LEAVE.value,
    SpecialLeave: PermissionTypeEnum.SPECIAL_LEAVE.value, */
   DonatedVacations: PermissionTypeEnum.DONATED_VACATION.value,
   VacationPay: PermissionTypeEnum.VACATION_PAY.value
};
