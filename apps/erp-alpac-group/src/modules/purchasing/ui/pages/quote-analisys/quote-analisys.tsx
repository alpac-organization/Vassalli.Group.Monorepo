import { useMemo, useState } from "react";
import { m } from "framer-motion";
import {
	Breadcrumb,
	Dropdown,
	StatsCard,
} from "@alpac/design-system";
import {
	BanknoteIcon,
	PackageIcon,
	TrendingDownIcon,
	UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { QuoteAnalysisTable } from "@app/modules/purchasing/ui/pages/quote-analisys/components/quote-analysis-table/quote-analysis-table";

export function QuoteAnalisys() {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();

	const [selectedQuoteId, setSelectedQuoteId] = useState();

	const quoteOptions = useMemo(
		() => [], [],
	);

	const selectedQuote = useMemo(
		() => [],
		[selectedQuoteId],
	);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>
			<div className="flex flex-col gap-4">
				<div className="flex justify-start">
					<Breadcrumb
						items={[
							{
								label: "Dashboard",
								url: `${baseUrl}/`,
								onClick: (url) => navigate(url),
							},
							{
								label: "Análisis comparativo",
								url: `${baseUrl}/purchasing/analisys`,
								onClick: (url) => navigate(url),
							},
						]}
					/>
				</div>

				<QuotesPageHeader
					title="Análisis comparativo"
					subtitle="Compare precios por producto entre proveedores de una cotización"
				/>

				<div className="max-w-md">
					<Dropdown
						label="Cotización a analizar"
						appearance="dark"
						placeholder="Seleccione una cotización"
						options={quoteOptions}
						value={selectedQuoteId}
						onChange={(value) => setSelectedQuoteId(value)}
						labelClassName="text-black! dark:text-white!"
						valueClassName="text-black! dark:text-white!"
						className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600!"
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<StatsCard
						title="Proveedores cotizados"
						value={""}
						icon={<UsersIcon size={28} />}
						borderColor="border-blue-600! dark:border-blue-400!"
					/>
					<StatsCard
						title="Productos comparados"
						value={""}
						icon={<PackageIcon size={28} />}
						borderColor="border-violet-600! dark:border-violet-400!"
					/>
					<StatsCard
						title="Mejor total"
						value={""}
						icon={<BanknoteIcon size={28} />}
						borderColor="border-emerald-600! dark:border-emerald-400!"
					/>
					<StatsCard
						title="Ahorro potencial"
						value={""}
						icon={<TrendingDownIcon size={28} />}
						borderColor="border-amber-600! dark:border-amber-400!"
					/>
				</div>

				{selectedQuote ? (
					<div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
						<p className="m-0 text-sm text-slate-600 dark:text-slate-300">
							<span className="font-semibold text-slate-900 dark:text-white">
								Observaciones:
							</span>{" "}
							{"Sin observaciones"}
						</p>
					</div>
				) : null}


				<div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
					<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
						Seleccione una cotización con productos para ver el cuadro
						comparativo.
					</p>
				</div>

			</div>
		</m.div>
	);
}
