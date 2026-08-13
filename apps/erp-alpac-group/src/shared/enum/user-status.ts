export const UserStatusRecord = {
  Active: "Activo",
  Inactive: "Inactivo",
  Locked: "Bloqueado",
} as const;

export type UserStatusKey = keyof typeof UserStatusRecord;
export type UserStatusLabel = (typeof UserStatusRecord)[UserStatusKey];

export type UserStatusOption = {
  value: UserStatusKey;
  label: UserStatusLabel;
};

export const UserTypeOptions: UserStatusOption[] = Object.entries(
  UserStatusRecord,
).map(([key, label]) => ({
  value: key as UserStatusKey,
  label: label as UserStatusLabel,
}));
