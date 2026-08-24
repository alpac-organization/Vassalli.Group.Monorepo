import { Badges } from "@alpac/design-system";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import {
  getSectionTypeLabel,
  getSectionStorageTypeLabel,
  resolveSectionType,
  resolveSectionStorageType,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { resolveRackStatus } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { getRackStatusLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";

// Esta funcion Representa un badge visual para indicar el tipo de seccion
// @param value - string | number - El valor del tipo de seccion
// @returns - ReactNode - Un badge visual para indicar el tipo de seccion
export const SectionTypeBadge = ({ value }: { value: string | number }) => {
  const resolved = resolveSectionType(value);
  const isStorage = resolved?.textValue === SectionTypeEnum.Storage.textValue;
  return (
    <Badges
      label={getSectionTypeLabel(value)}
      color={isStorage ? "success" : "gray"}
      className={
        isStorage
          ? "bg-emerald-500/15! border! border-emerald-500/40! text-emerald-400!"
          : "bg-blue-500/10! border! border-blue-400/30! text-blue-300!"
      }
    />
  );
};

// Esta funcion Representa un badge visual para indicar el tipo de almacenamiento de una seccion
// @param value - string | number - El valor del tipo de almacenamiento de una seccion
// @returns - ReactNode - Un badge visual para indicar el tipo de almacenamiento de una seccion
export const SectionStorageTypeBadge = ({
  value,
}: {
  value: string | number;
}) => {
  const resolved = resolveSectionStorageType(value);

  let className =
    "bg-slate-500/15! border! border-slate-400/30! text-slate-300!";

  if (resolved?.textValue === SectionStorageTypeEnum.Racks.textValue) {
    className =
      "bg-violet-500/15! border! border-violet-400/40! text-violet-300!";
  } else if (resolved?.textValue === SectionStorageTypeEnum.Lots.textValue) {
    className = "bg-amber-500/15! border! border-amber-400/40! text-amber-300!";
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
export const RackStatusBadge = ({
  value,
}: {
  value: string | number | null;
}) => {
  const status = resolveRackStatus(value ?? "");

  switch (status?.textValue) {
    case RackStatusEnum.Available.textValue:
      return (
        <Badges
          label={RackStatusEnum.Available.label}
          color="transparent"
          className="bg-emerald-500/15! text-emerald-400! border! border-emerald-500/40! dark:bg-emerald-500/15! dark:text-emerald-400! dark:border-emerald-500/40!"
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
          label={getRackStatusLabel(value ?? "")}
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
