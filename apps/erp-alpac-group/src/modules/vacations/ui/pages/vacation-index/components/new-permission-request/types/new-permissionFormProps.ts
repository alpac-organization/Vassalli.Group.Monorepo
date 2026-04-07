import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import { PermissionTypeEnum } from "@app/modules/vacations/domain/enum/permissionType.enum";
import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
/**
 * Propiedades requeridas para el formulario de nueva solicitud de permiso.
 * Utilizado para manejar acciones y datos externos al formulario.
 */
export type NewPermissionRequestFormProps = {
  isPending: boolean;
  onSubmit: (payload: CreatePermissionRequest) => void;
  onCancel: () => void;
  companyId: string;
  moduleCode: string;
  identificationNumber: string;
};

export const PERMISSION_TYPE_TO_ENUM_VALUE: Record<PermissionType, number> = {
  Vacation: PermissionTypeEnum.VACATION.value,
  MedicalAppointment: PermissionTypeEnum.MEDICAL_APPOINTMENT.value,
  CompensatoryTime: PermissionTypeEnum.COMPENSATORY_TIME.value,
  PaidLeave: PermissionTypeEnum.PAID_LEAVE.value,
  UnpaidLeave: PermissionTypeEnum.UNPAID_LEAVE.value,
  SpecialLeave: PermissionTypeEnum.SPECIAL_LEAVE.value,
};
