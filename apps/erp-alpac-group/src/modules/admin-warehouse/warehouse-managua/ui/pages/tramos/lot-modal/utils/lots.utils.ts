import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
export const parseDecimal = (value: unknown) => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
};

export const isUnavailableStatus = (status: number) =>
  status === RackStatusEnum.UnderMaintenance.value ||
  status === RackStatusEnum.Blocked.value;
