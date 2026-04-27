export const VacationTypeEnum: Record<
  string,
  { value: number; label: string }
> = {
  VACATION: { value: 1, label: "Vacaciones" },
  DONATED_VACATION: { value: 7, label: "Vacaciones donadas" },
} as const;
