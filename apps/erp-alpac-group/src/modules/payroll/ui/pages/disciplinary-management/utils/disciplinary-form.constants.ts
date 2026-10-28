import type { Option } from "@alpac/design-system";
import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import { SanctionStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

const toOptions = (
  enumMap: Record<string, { value: number | string; label: string }>,
  allLabel: string,
): Option[] => [
  { label: allLabel, value: "all" },
  ...Object.entries(enumMap).map(([key, item]) => ({
    label: item.label,
    value: key,
  })),
];

export const FAULT_SEVERITY_FILTER_OPTIONS = toOptions(
  FaultSeverityEnum,
  "Todas las severidades",
);

export const FAULT_STATUS_FILTER_OPTIONS = toOptions(
  FaultStatusEnum,
  "Todos los estados",
);

export const FAULT_SOURCE_FILTER_OPTIONS = toOptions(
  FaultSourceEnum,
  "Todos los orígenes",
);

export const SANCTION_TYPE_FILTER_OPTIONS = toOptions(
  SanctionTypeEnum,
  "Todos los tipos",
);

export const SANCTION_STATUS_FILTER_OPTIONS = toOptions(
  SanctionStatusEnum,
  "Todos los estados",
);

export const disciplinaryInputClassName =
  "w-full rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const disciplinaryDropdownClassName =
  "w-full focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const disciplinaryLabelClassName = "text-black! dark:text-white!";

export const disciplinaryPrimaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const disciplinarySecondaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
