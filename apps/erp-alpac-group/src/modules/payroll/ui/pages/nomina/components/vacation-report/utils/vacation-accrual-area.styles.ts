import { StyleSheet } from "@react-pdf/renderer";

const COLUMN_KEYS = [
  "collaborator_code",
  "entry_date",
  "monthly_salary",
  "antique",
  "salary_plus_antique",
  "vacation_balance",
  "agui_days",
  "equivales_quantity",
  "equivales_quantity_in_dollars",
  "agui",
  "indem_years",
  "indem_value",
] as const;

const COLUMN_FLEX: Record<(typeof COLUMN_KEYS)[number], number> = {
  collaborator_code: 1.15,
  entry_date: 1,
  monthly_salary: 1.05,
  antique: 0.95,
  salary_plus_antique: 1.15,
  vacation_balance: 0.95,
  agui_days: 0.75,
  equivales_quantity: 1.1,
  equivales_quantity_in_dollars: 1.1,
  agui: 0.65,
  indem_years: 0.85,
  indem_value: 0.9,
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

export const vacationAccrualAreaColStyles = StyleSheet.create(
  Object.fromEntries(
    COLUMN_KEYS.map((key) => [
      key,
      { ...baseColStyle, flexGrow: COLUMN_FLEX[key] },
    ]),
  ) as Record<string, typeof baseColStyle & { flexGrow: number }>,
);

export function vacationAccrualAreaColStyle(key: string) {
  return (
    vacationAccrualAreaColStyles[
      key as keyof typeof vacationAccrualAreaColStyles
    ] ?? vacationAccrualAreaColStyles.collaborator_code
  );
}

export const vacationAccrualAreaHeaderTextStyle = {
  margin: 0,
  padding: 2,
  width: "100%",
  fontSize: 6,
  fontWeight: "bold" as const,
};
