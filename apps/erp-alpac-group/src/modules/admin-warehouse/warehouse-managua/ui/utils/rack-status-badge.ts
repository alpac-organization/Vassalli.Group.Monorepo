import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
const normalizeEnumKey = (value: string | number) =>
  String(value)
    .replace(/[_\s-]/g, "")
    .toLowerCase();

export const resolveRackStatus = (value: string | number) => {
  if (value === null || value === undefined || value === "") return null;

  const normalized = normalizeEnumKey(value);

  return (
    Object.values(RackStatusEnum).find(
      (option) =>
        normalizeEnumKey(option.textValue) === normalized ||
        String(option.value) === String(value),
    ) ?? null
  );
};

export const getRackStatusLabel = (value: string | number) => {
  return resolveRackStatus(value)?.label ?? (value ? String(value) : "-");
};
