import { useCallback, useMemo } from "react";
import { Breadcrumb } from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useNavigate } from "react-router-dom";
import type { SectionsHeaderProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-header/types/section-header.types";

export function SectionsHeader({
	warehouseId,
	warehouseCode,
	location,
	totalArea,
	sectionQuantity,
	ocuppation,
	registerButton,
}: SectionsHeaderProps) {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();

	const goTo = useCallback(
		(url: string) => {
			navigate(url);
		},
		[navigate],
	);

	const breadcrumbItems = useMemo(
		() => [
			{
				label: "Dashboard",
				url: baseUrl,
				onClick: goTo,
			},
			{
				label: "Lista de bodegas",
				url: `${baseUrl}/warehouse-admin/management`,
				onClick: goTo,
			},
			{
				label: "Secciones",
				url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}`,
			},
		],
		[baseUrl, goTo, warehouseId],
	);

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-4 rounded-lg border border-slate-600 bg-white px-4 py-4 hover:border-neutral-600 dark:bg-[#272b34] sm:gap-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-col gap-1">
					<h2 className="m-0 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
						{warehouseCode ?? "Ninguno"}
					</h2>
					<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
						{location ?? "Ninguno"}
					</p>
				</div>

				<div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:gap-10">
					<div className="grid w-full grid-cols-3 gap-3 sm:gap-8 lg:w-auto lg:flex lg:items-center lg:gap-14">
						<div className="flex flex-col items-center text-center">
							<span className="text-base font-semibold text-slate-900 dark:text-white sm:text-xl">
								{totalArea ?? 0} m²
							</span>
							<span className="mt-1 text-[10px] text-slate-500 sm:text-xs">
								Área total
							</span>
						</div>
						<div className="flex flex-col items-center text-center">
							<span className="text-base font-semibold text-slate-900 dark:text-white sm:text-xl">
								{sectionQuantity ?? 0}
							</span>
							<span className="mt-1 text-[10px] text-slate-500 sm:text-xs">
								Secciones
							</span>
						</div>
						<div className="flex flex-col items-center text-center">
							<span className="text-base font-semibold text-slate-900 dark:text-white sm:text-xl">
								{ocuppation ?? 0}%
							</span>
							<span className="mt-1 text-[10px] text-slate-500 sm:text-xs">
								Ocupación
							</span>
						</div>
					</div>

					{registerButton ? (
						<div className="w-full shrink-0 lg:w-auto">{registerButton}</div>
					) : null}
				</div>
			</div>
		</>
	);
}
