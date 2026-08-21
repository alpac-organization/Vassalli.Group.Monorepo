import { RackUsageProfileEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";

export function getUsageProfileLabel(value?: string | null) {
  if (!value) return "—";

  const normalized = value.replace(/[_\s-]/g, "").toLowerCase();

  return (
    Object.values(RackUsageProfileEnum).find(
      (option) =>
        option.textValue.toLowerCase() === normalized ||
        String(option.value) === value,
    )?.label ?? value
  );
}
