import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";

export const isUnavailableStatus = (status: number) =>
  status === RackStatusEnum.UnderMaintenance.value ||
  status === RackStatusEnum.Blocked.value;
