import { History, RotateCcw, User } from "lucide-react";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
	resolveReturnScopeLabel,
	resolveReturnSourceLabel,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-return-history/quote-return-history.labels";
import type { QuoteReturnHistoryProps } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-return-history/quote-return-history.types";

const TEXT_WRAP_CLASS =
	"min-w-0 max-w-full whitespace-normal [overflow-wrap:anywhere]";

const FIELD_LABEL_CLASS =
	"text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

export function QuoteReturnHistory({
	requotationCount,
	returnHistory,
}: QuoteReturnHistoryProps) {
	const entries = returnHistory ?? [];
	if (entries.length === 0) return null;

	const count = requotationCount ?? 0;

	return (
		<section className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:gap-4 sm:p-5 dark:border-slate-700/50 dark:bg-[#1e2229]">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
						<History className="h-4 w-4" />
					</span>
					<h4 className="m-0 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
						Historial de devoluciones
					</h4>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
					<RotateCcw className="h-3.5 w-3.5" />
					{count} recotización{count === 1 ? "" : "es"}
				</span>
			</div>

			<ol className="m-0 flex list-none flex-col gap-3 p-0">
				{entries.map((entry, index) => {
					const userName =
						entry.user_information?.fullname?.trim() || "Usuario";
					const userEmail = entry.user_information?.email?.trim();
					const isLast = index === entries.length - 1;
					const isFullProcess = entry.scope === "FullProcess";

					return (
						<li
							key={`${entry.returned_at}-${entry.scope}-${entry.source}-${index}`}
							className="relative flex min-w-0 gap-3"
						>
							<div className="flex w-5 shrink-0 flex-col items-center">
								<span
									className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
										isFullProcess ? "bg-red-500" : "bg-amber-500"
									}`}
								/>
								{isLast ? null : (
									<span
										className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-600"
										aria-hidden
									/>
								)}
							</div>

							<div
								className={`min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/50 dark:bg-[#272b34] ${
									isLast ? "" : "mb-1"
								}`}
							>
								<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
									<div className="flex min-w-0 flex-col gap-1">
										<span className={FIELD_LABEL_CLASS}>Alcance</span>
										<span
											className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
												isFullProcess
													? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300"
													: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
											}`}
										>
											{resolveReturnScopeLabel(entry.scope)}
										</span>
									</div>

									<div className="flex min-w-0 flex-col gap-1">
										<span className={FIELD_LABEL_CLASS}>Origen</span>
										<span className="w-fit rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-600/70 dark:text-slate-200">
											{resolveReturnSourceLabel(entry.source)}
										</span>
									</div>

									<div className="flex min-w-0 flex-col gap-1">
										<span className={FIELD_LABEL_CLASS}>Fecha</span>
										<span
											className={`${TEXT_WRAP_CLASS} text-sm font-medium text-slate-800 dark:text-slate-200`}
										>
											{formatDateToSpanishWords(entry.returned_at)}
										</span>
									</div>

									<div className="flex min-w-0 flex-col gap-1 sm:col-span-3">
										<span className={FIELD_LABEL_CLASS}>Motivo</span>
										<p
											className={`m-0 ${TEXT_WRAP_CLASS} text-sm text-slate-800 dark:text-slate-200`}
										>
											{entry.reason?.trim() || "Sin motivo"}
										</p>
									</div>

									<div className="flex min-w-0 flex-col gap-1 sm:col-span-3">
										<span className={FIELD_LABEL_CLASS}>Devuelto por</span>
										<div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-700 dark:text-slate-300">
											<User className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
											<span className={`${TEXT_WRAP_CLASS} font-medium`}>
												{userName}
											</span>
											{userEmail ? (
												<span className="min-w-0 break-all text-slate-500 dark:text-slate-400">
													{userEmail}
												</span>
											) : null}
										</div>
									</div>
								</div>
							</div>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
