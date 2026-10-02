import { ProgressBarProps } from "./progress-bar.type";

const DEFAULT_TOTAL_LABEL = "Total";
const DEFAULT_COMPLETED_LABEL = "Ocupación";
const DEFAULT_REMAINING_LABEL = "Libre";

const toSafeNumber = (value: number | undefined, fallback = 0): number =>
	typeof value === "number" && Number.isFinite(value) ? value : fallback;

const clamp = (value: number, min: number, max: number): number =>
	Math.min(max, Math.max(min, value));

export const ProgressBar = ({
	total,
	completed,
	remaining,
	color,
	totalLabel = DEFAULT_TOTAL_LABEL,
	completedLabel = DEFAULT_COMPLETED_LABEL,
	remainingLabel = DEFAULT_REMAINING_LABEL,
	unitOfMeasurement,
}: ProgressBarProps) => {

	const safeTotal = Math.max(0, toSafeNumber(total));
	const safeCompleted = clamp(toSafeNumber(completed), 0, 100);
	const safeRemaining = Math.max(0, toSafeNumber(remaining));
	const unitSuffix = unitOfMeasurement?.trim()
		? ` ${unitOfMeasurement.trim()}`
		: "";

	return (
		<div className="flex w-45 flex-col gap-1.5">
			<div className="flex justify-between flex-wrap gap-1 text-xs text-slate-500 dark:text-slate-400">
				<span>
					{totalLabel}: {safeTotal}{unitSuffix}
				</span>
				<span>
					{remainingLabel}: {safeRemaining}{unitSuffix}
				</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
				<div
					className={`h-full w-full origin-left rounded-full ${color ?? "bg-green-700 dark:bg-[#40e07a]"}`}
					style={{ transform: `scaleX(${safeCompleted / 100})` }}
				/>
			</div>
			<span className="text-xs text-slate-500 dark:text-slate-400">
				{completedLabel}: {safeCompleted}%
			</span>
		</div>
	);
};
