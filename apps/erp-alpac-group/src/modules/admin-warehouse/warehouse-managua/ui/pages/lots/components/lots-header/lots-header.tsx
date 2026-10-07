import { Breadcrumb } from "@alpac/design-system";
import type { LotsHeaderProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-header/types/lots-header.types";
import { useModulePageHeader } from "@app/shared/hooks/useModulePageHeader";

export function LotsHeader({
	warehouseId,
	sectionId,
	sectionCode,
	totalArea,
	lotQuantity,
	registerButton
}: LotsHeaderProps) {

	const { breadcrumbItems } = useModulePageHeader((baseUrl) => [
		{ label: "Dashboard", url: baseUrl },
		{
			label: "Lista de bodegas",
			url: `${baseUrl}/warehouse-admin/management`,
		},
		{
			label: "Secciones",
			url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}`,
		},
		{
			label: "Tramos",
			url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${sectionId}`,
		},
	]);

	return (
		<>
			<Breadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-4 rounded-lg border border-slate-600 bg-white px-4 py-4 hover:border-neutral-600 dark:bg-[#272b34] sm:gap-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-col gap-1">
					<h2 className="m-0 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
						{sectionCode ?? "Ninguno"}
					</h2>
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
								{lotQuantity ?? 0}
							</span>
							<span className="mt-1 text-[10px] text-slate-500 sm:text-xs">
								Tramos
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