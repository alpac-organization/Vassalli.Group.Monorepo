import { AccountingReviewStatus } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import {
	PriorityLevelEnum,
	type PriorityLevelType,
} from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";

const FALLBACK_BADGE = {
  label: "—",
  color: "bg-slate-100 text-slate-800 dark:bg-slate-700/60 dark:text-slate-200",
};

export const STATUS_BADGE_VARIANTS: Record<
  accountingReviewStatusType,
  { label: string; color: string }
> = {
  [AccountingReviewStatus.Pending.textValue]: {
    label: AccountingReviewStatus.Pending.label,
    color:
      "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  },
  [AccountingReviewStatus.Approved.textValue]: {
    label: AccountingReviewStatus.Approved.label,
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  [AccountingReviewStatus.Rejected.textValue]: {
    label: AccountingReviewStatus.Rejected.label,
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  },
  [AccountingReviewStatus.Returned.textValue]: {
    label: AccountingReviewStatus.Returned.label,
    color:
      "bg-slate-100 text-slate-800 dark:bg-slate-700/60 dark:text-slate-200",
  },
};

export function getStatusBadge(status: accountingReviewStatusType) {
  return STATUS_BADGE_VARIANTS[status] ?? FALLBACK_BADGE;
}

const PRIORITY_LEVEL_COLORS: Record<PriorityLevelType, string> = {
	None: "bg-slate-500/10 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20",
	Critical: "bg-[#8B0000]/12 text-[#8B0000] ring-1 ring-inset ring-[#8B0000]/25 dark:bg-red-900/35 dark:text-red-300 dark:ring-red-700/50",
	Unforeseen: "bg-amber-500/12 text-amber-800 ring-1 ring-inset ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/25",
	Normal: "bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/25",
};

export function getPriorityLevelBadge(priority?: PriorityLevelType | null) {
	const item = priority ? PriorityLevelEnum[priority] : PriorityLevelEnum.None;
	const resolved = item ?? PriorityLevelEnum.None;

	return {
		label: resolved.label,
		color: PRIORITY_LEVEL_COLORS[resolved.textValue],
	};
}