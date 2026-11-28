import { TerminationTypeEnum } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";
import { getMappedOptionList } from "@app/shared/utils/values.utils";

export const PROCESO_BAJA_TABS = [
  "terminations-pending",
  "terminations-approved",
  "liquidations-in-progress",
  "liquidations-approved",
] as const;

export type ProcesoBajaTabId = (typeof PROCESO_BAJA_TABS)[number];

export const DEFAULT_PROCESO_BAJA_TAB: ProcesoBajaTabId = "terminations-pending";

export const PROCESO_BAJA_PAGE_SIZE = 10;

export const TERMINATION_TYPE_OPTIONS = getMappedOptionList({
  list: Object.entries(TerminationTypeEnum).filter(
    ([key]) => key !== "JustifiedDismissal",
  ),
  label: ([, item]) => item.label,
  value: ([key]) => key,
});

export const procesoBajaInputClassName =
  "w-full rounded-md! text-[15px]! text-slate-800! dark:text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const procesoBajaDropdownClassName =
  "w-full focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-slate-800! dark:text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const procesoBajaLabelClassName = "text-black! dark:text-white!";

export const procesoBajaPrimaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const procesoBajaSecondaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";

export const procesoBajaDangerButtonClassName =
  "rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200 disabled:opacity-40";

export const procesoBajaCancelButtonClassName =
  "rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

export const procesoBajaModalPanelClassName = [
  "flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
  "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
  "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
].join(" ");

export const procesoBajaModalContentClassName = "flex min-h-0 flex-1 flex-col";

export const procesoBajaSectionTitleClassName =
  "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

export const procesoBajaContextMenuButtonClassName =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";
