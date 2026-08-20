import { Badges } from "@alpac/design-system";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import {
  getSectionTypeLabel,
  getSectionStorageTypeLabel,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { getRackStatusLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";

// Esta funcion Representa un badge visual para indicar el tipo de seccion
// @param value - string  - El valor del tipo de seccion
// @returns - ReactNode - Un badge visual para indicar el tipo de seccion
export const SectionTypeBadge = ({ value }: { value: string }) => {
  const isStorage = value === SectionTypeEnum.Storage.textValue;
  return (
    <Badges
      label={getSectionTypeLabel(value)}
      color={isStorage ? "success" : "gray"}
      className={
        isStorage
          ? "bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
          : "bg-slate-800! border! border-slate-700! text-slate-400!"
      }
    />
  );
};

// Esta funcion Representa un badge visual para indicar el tipo de almacenamiento de una seccion
// @param value - string  - El valor del tipo de almacenamiento de una seccion
// @returns - ReactNode - Un badge visual para indicar el tipo de almacenamiento de una seccion
export const SectionStorageTypeBadge = ({ value }: { value: string }) => {
  let className = "bg-slate-800! border! border-slate-700! text-slate-400!";
  if (value === SectionStorageTypeEnum.Racks.textValue) {
    className = "bg-[#123C69]! border! border-[#2F6FB2]! text-[#D6ECFF]!";
  } else if (value === SectionStorageTypeEnum.Lots.textValue) {
    className = "bg-[#234A2F]! border! border-[#4FA56A]! text-[#D9FBE2]!";
  }
  return (
    <Badges
      label={getSectionStorageTypeLabel(value)}
      color="transparent"
      className={className}
    />
  );
};

// Esta funcion Representa un badge visual para indicar el estado de un rack
// @param value - string  - El valor del estado del rack
// @returns - ReactNode - Un badge visual para indicar el estado de un rack
export const RackStatusBadge = ({ value }: { value: string }) => {
  const status = resolveRackStatus(value);

  switch (status?.textValue) {
    case RackStatusEnum.Available.textValue:
      return (
        <Badges
          label={RackStatusEnum.Available.label}
          color="transparent"
          className="bg-blue-100! text-blue-900! border! border-blue-200! dark:bg-[#09365C]! dark:text-[#93C5FD]! dark:border-[#3B82F6]!"
        />
      );
    case RackStatusEnum.Occupied.textValue:
      return (
        <Badges
          label={RackStatusEnum.Occupied.label}
          color="info"
          className="bg-[#123C69]! border! border-[#2F6FB2]! text-[#D6ECFF]!"
        />
      );
    case RackStatusEnum.UnderMaintenance.textValue:
      return (
        <Badges
          label={RackStatusEnum.UnderMaintenance.label}
          color="warning"
          className="bg-[#3a2c0a]! border! border-[#5c4a12]! text-[#fbbf24]!"
        />
      );
    case RackStatusEnum.Blocked.textValue:
      return (
        <Badges
          label={RackStatusEnum.Blocked.label}
          color="error"
          className="bg-[#3a1d1d]! border! border-[#5c2424]! text-[#f87171]!"
        />
      );
    default:
      return (
        <Badges
          label={getRackStatusLabel(value)}
          color="gray"
          className="bg-slate-800! border! border-slate-700! text-slate-400!"
        />
      );
  }
};

// Esta funco Representa un badge visual para indicar si el estado es activo o inactivo
// @param isActive - boolean - Indica si el estado es activo o inactivo
// @returns - ReactNode - Un badge visual para indicar si el estado es activo o inactivo
export const ActiveStatusBadge = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <Badges
      label="Activa"
      color="success"
      className="bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
    />
  ) : (
    <Badges
      label="Inactiva"
      color="gray"
      className="bg-slate-800! border! border-slate-700! text-slate-400!"
    />
  );
