import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import { DeductionTypeEnum } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import { getMappedOptionList } from "@app/shared/utils/values.utils";

export const DEDUCTION_TYPE_FILTER_OPTIONS = getMappedOptionList({
  list: Object.entries(DeductionTypeEnum),
  label: ([, item]) => item.label,
  value: ([key]) => key,
  allLabel: "Todos los tipos",
});

export const isChildSupportDeduction = (
  deduction?: Pick<DeductionDto, "type" | "child_support_detail"> | null,
): boolean =>
  Boolean(deduction?.child_support_detail) ||
  deduction?.type === "ChildSupportGarnishment" ||
  Number(deduction?.type) === 9;

export const deductionInputClassName =
  "w-full rounded-md! text-[15px]! text-slate-800! dark:text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export const deductionDropdownClassName =
  "w-full focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-slate-800! dark:text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const deductionLabelClassName = "text-black! dark:text-white!";

export const deductionPrimaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const deductionSecondaryButtonClassName =
  "w-full text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";

export const deductionModalPrimaryButtonClassName =
  "rounded-md! h-10 px-4! whitespace-nowrap text-sm! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";

export const deductionModalSecondaryButtonClassName =
  "rounded-md! h-10 px-4! whitespace-nowrap text-sm! text-white! bg-slate-500! dark:bg-slate-700!";

export const deductionApproveButtonClassName =
  "rounded-md! h-10 px-4! whitespace-nowrap text-sm! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";

export const deductionRejectButtonClassName =
  "rounded-md! h-10 px-4! whitespace-nowrap text-sm! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200 disabled:opacity-40";

export const deductionCancelOutlineClassName =
  "rounded-md! h-10 px-4! whitespace-nowrap text-sm! text-white! bg-slate-500! dark:bg-slate-700!";

export const deductionModalPanelClassName = [
  "flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
  "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
  "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
].join(" ");

export const deductionModalContentClassName = "flex min-h-0 flex-1 flex-col";

export const deductionModalFooterClassName =
  "-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl";

export const sectionTitleClassName =
  "m-0 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";
