import type { CreatePermissionRequestBase } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import { PermissionTypeEnum } from "@app/modules/vacations/domain/enum/permissionType.enum";
import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { ChannelEnum } from "@app/core/enums/channel.enum";
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
};

export const PERMISSION_TYPE_TO_ENUM_VALUE: Record<PermissionType, number> = {
   Vacation: PermissionTypeEnum.VACATION.value,
   MedicalAppointment: PermissionTypeEnum.MEDICAL_APPOINTMENT.value,
   /* CompensatoryTime: PermissionTypeEnum.COMPENSATORY_TIME.value,
   PaidLeave: PermissionTypeEnum.PAID_LEAVE.value,
   UnpaidLeave: PermissionTypeEnum.UNPAID_LEAVE.value,
   SpecialLeave: PermissionTypeEnum.SPECIAL_LEAVE.value, */
   DonatedVacations: PermissionTypeEnum.DONATED_VACATION.value
};
