import { StyleSheet } from "@react-pdf/renderer";

const COLUMN_KEYS = [
  "collaborator_code",
  "collaborator_fullname",
  "beginning_balance",
  "final_balance",
  "permission_type",
  "permission_period",
  "permission_start_time",
  "permission_end_time",
  "permission_days",
  "permission_status",
] as const;

const COLUMN_FLEX: Record<(typeof COLUMN_KEYS)[number], number> = {
  collaborator_code: 0.9,
  collaborator_fullname: 1.4,
  beginning_balance: 0.85,
  final_balance: 0.85,
  permission_type: 0.85,
  permission_period: 1.2,
  permission_start_time: 0.75,
  permission_end_time: 0.75,
  permission_days: 0.65,
  permission_status: 0.85,
};

const baseColStyle = {
  flexShrink: 1,
  flexBasis: 0,
  minWidth: 0,
  borderStyle: "solid" as const,
  borderWidth: 1,
  borderColor: "#bfbfbf",
  borderLeftWidth: 0,
  borderTopWidth: 0,
};

export const vacationControlAreaColStyles = StyleSheet.create(
  Object.fromEntries(
    COLUMN_KEYS.map((key) => [
      key,
      { ...baseColStyle, flexGrow: COLUMN_FLEX[key] },
    ]),
  ) as Record<string, typeof baseColStyle & { flexGrow: number }>,
);

export function vacationControlAreaColStyle(key: string) {
  return (
    vacationControlAreaColStyles[
      key as keyof typeof vacationControlAreaColStyles
    ] ?? vacationControlAreaColStyles.collaborator_code
  );
}

export const vacationControlAreaHeaderTextStyle = {
  margin: 0,
  padding: 2,
  width: "100%",
  fontSize: 6,
  fontWeight: "bold" as const,
};
