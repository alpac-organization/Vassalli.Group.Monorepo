export const AttendanceRecordTypeEnum = {
  CheckIn: { value: "CheckIn", label: "Entrada" },
  CheckOut: { value: "CheckOut", label: "Salida" },
} as const;

export type AttendanceRecordType =
  (typeof AttendanceRecordTypeEnum)[keyof typeof AttendanceRecordTypeEnum]["value"];

const RECORD_TYPE_LABELS: Record<string, string> = {
  CheckIn: AttendanceRecordTypeEnum.CheckIn.label,
  CheckOut: AttendanceRecordTypeEnum.CheckOut.label,
  1: AttendanceRecordTypeEnum.CheckIn.label,
  2: AttendanceRecordTypeEnum.CheckOut.label,
};

export const getAttendanceRecordTypeLabel = (
  type: string | number,
): string => RECORD_TYPE_LABELS[String(type)] ?? String(type);
