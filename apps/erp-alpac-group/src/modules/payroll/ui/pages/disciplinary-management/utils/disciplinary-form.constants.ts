import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import { SanctionStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import { getMappedOptionList } from "@app/shared/utils/values.utils";

export const FAULT_SEVERITY_FILTER_OPTIONS = getMappedOptionList({
  list: Object.entries(FaultSeverityEnum),
  label: ([, item]) => item.label,
  value: ([key]) => key,
  allLabel: "Todas las severidades",
});

export const FAULT_STATUS_FILTER_OPTIONS = getMappedOptionList({
  list: Object.entries(FaultStatusEnum),
  label: ([, item]) => item.label,
  value: ([key]) => key,
  allLabel: "Todos los estados",
});

export const FAULT_SOURCE_FILTER_OPTIONS = getMappedOptionList({
  list: Object.entries(FaultSourceEnum),
  label: ([, item]) => item.label,
  value: ([key]) => key,
  allLabel: "Todos los orígenes",
});

export const SANCTION_TYPE_FILTER_OPTIONS = getMappedOptionList({
  list: Object.entries(SanctionTypeEnum),
  label: ([, item]) => item.label,
  value: ([key]) => key,
  allLabel: "Todos los tipos",
});

export const SANCTION_STATUS_FILTER_OPTIONS = getMappedOptionList({
  list: Object.entries(SanctionStatusEnum),
  label: ([, item]) => item.label,
  value: ([key]) => key,
  allLabel: "Todos los estados",
});

export const disciplinaryInputClassName =
  "w-full rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const disciplinaryDropdownClassName =
  "w-full focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const disciplinaryLabelClassName = "text-black! dark:text-white!";

export const disciplinaryPrimaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const disciplinarySecondaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";

/** Footer actions — mismo patrón visual que purchase-request-detail-modal */
export const disciplinaryApproveButtonClassName =
  "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";

export const disciplinaryRejectButtonClassName =
  "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";
