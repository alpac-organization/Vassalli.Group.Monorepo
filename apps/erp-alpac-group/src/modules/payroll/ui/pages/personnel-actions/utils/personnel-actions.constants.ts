import { PersonnelActionScopeOptions } from "@app/modules/payroll/domain/enums/personnel-action-enums/personnel-action-scope.enum";
import { PersonnelActionStatusOptions } from "@app/modules/payroll/domain/enums/personnel-action-enums/personnel-action-status.enum";
import { getMappedOptionList } from "@app/shared/utils/values.utils";

export const ACTION_STATUS_FILTER_OPTIONS = getMappedOptionList({
  list: PersonnelActionStatusOptions,
  label: "label",
  value: (item) => item.value.toString(),
  allLabel: "Todos los estados",
});

export const ACTION_SCOPE_FILTER_OPTIONS = getMappedOptionList({
  list: PersonnelActionScopeOptions,
  label: "label",
  value: (item) => item.value.toString(),
  allLabel: "Todos los alcances",
});

export const actionInputClassName =
  "w-full rounded-md! text-[15px]! text-slate-800! dark:text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const actionDropdownClassName =
  "w-full focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-slate-800! dark:text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const actionLabelClassName = "text-black! dark:text-white!";

export const actionPrimaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const actionSecondaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";

export const actionApproveButtonClassName =
  "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";

export const actionRejectButtonClassName =
  "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200";

export const actionCancelOutlineClassName =
 "text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
export const actionModalPanelClassName = [
  "flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
  "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
  "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
].join(" ");

export const actionModalContentClassName = "flex min-h-0 flex-1 flex-col";

export const sectionTitleClassName =
  "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";
