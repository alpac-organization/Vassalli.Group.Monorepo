type AttendanceReports = "attendance-pdf";

const reportEnum: Record<AttendanceReports, Function> = {
    "attendance-pdf": (): void => console.log("testing attendance report")
} as const;

export const GetReport = (key: string): Function => {
    return reportEnum[key as keyof typeof reportEnum];
}