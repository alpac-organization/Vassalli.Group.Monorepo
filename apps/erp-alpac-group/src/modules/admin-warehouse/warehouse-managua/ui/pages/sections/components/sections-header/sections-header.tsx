import { useCallback, useMemo } from "react";
import { Breadcrumb, SectionHeader, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useNavigate } from "react-router-dom";
import type { SectionsHeaderProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-header/types/section-header.types";

export function SectionsHeader({ warehouseId }: SectionsHeaderProps) {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();

	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

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
		<div className="flex flex-col gap-3 sm:gap-4 min-w-0">
			<div className="flex justify-start min-w-0 overflow-x-auto">
				<Breadcrumb items={breadcrumbItems} />
			</div>
			<SectionHeader title="Secciones de la bodega" logoImage={activeLogo}/>			
		</div>
	);
}
