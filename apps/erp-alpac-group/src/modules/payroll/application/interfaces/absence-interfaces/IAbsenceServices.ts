import type { RegisterAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/register-absence.request";
import type { GetAbsencesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absences.request";
import type { GetAbsenceDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absence-details.request";
import type { ApplyAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/apply-absence.request";
import type { CancelAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/cancel-absence.request";
import type { DeleteAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/delete-absence.request";
import type { GetAbsencesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absences.response";
import type { AbsenceDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absence-details.response";

export interface IAbsenceServices {
  /**
   * Registra una nueva inasistencia en estado Pending
   */
  registerAbsence(payload: RegisterAbsenceRequest): Promise<void>;

  /**
   * Obtiene el listado paginado y filtrado de inasistencias
   */
  getAbsences(payload: GetAbsencesRequest): Promise<GetAbsencesResponse>;

  /**
   * Obtiene la ficha de detalle plano de una inasistencia por ID
   */
  getAbsenceDetails(payload: GetAbsenceDetailsRequest): Promise<AbsenceDetailDto>;

  /**
   * Aplica formalmente una inasistencia (Recursos Humanos)
   */
  applyAbsence(payload: ApplyAbsenceRequest): Promise<void>;

  /**
   * Cancela una inasistencia con motivo obligatorio (Recursos Humanos)
   */
  cancelAbsence(payload: CancelAbsenceRequest): Promise<void>;

  /**
   * Anula lógicamente (soft delete) una inasistencia por error de registro
   */
  deleteAbsence(payload: DeleteAbsenceRequest): Promise<void>;
}
