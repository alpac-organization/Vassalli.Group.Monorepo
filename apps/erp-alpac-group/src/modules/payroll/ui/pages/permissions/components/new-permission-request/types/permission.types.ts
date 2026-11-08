export type PermissionType =
  | "Vacation"
  | "MedicalAppointment"
  | "DonatedVacations"
  | "VacationPay"
  | "JudicialAppointment"
  | "MarriageLeave"
  | "BirthLeave"
  | "BereavementLeave";

export type LeavePermissionType =
  | "JudicialAppointment"
  | "MarriageLeave"
  | "BirthLeave"
  | "BereavementLeave";

export const LEAVE_PERMISSION_TYPES: LeavePermissionType[] = [
  "JudicialAppointment",
  "MarriageLeave",
  "BirthLeave",
  "BereavementLeave",
];

export function isLeavePermissionType(
  type: string | undefined,
): type is LeavePermissionType {
  return (
    type === "JudicialAppointment" ||
    type === "MarriageLeave" ||
    type === "BirthLeave" ||
    type === "BereavementLeave"
  );
}
