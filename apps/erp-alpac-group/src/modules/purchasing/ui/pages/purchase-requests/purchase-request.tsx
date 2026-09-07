import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	SectionHeader,
	Tabs,
	useTheme,
	type TabItem,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { RequisitionTab } from "./components/tabs/requisition-tab/requisition-tab";
import { MonthlyMaterialTab } from "./components/tabs/monthly-materials-tab/monthly-materials-tab";
import { OccasionalMaterialTab } from "./components/tabs/occasional-materials-tab/occasional-materials-tab";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";

export const PurchaseRequest = () => {

	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const { branchId } = useUserStore();

	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const {
		alertState,
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const tabs: TabItem<string>[] = [
		{
			id: "requisitions",
			label: "Requisiciones",
			render: () => (
				<RequisitionTab
					currentBranchId={branchId!}
					onRequestError={handleRequestError}
					onRequestSuccess={handleRequestSuccess}
				/>
			),
		},
		{
			id: "monthly-applications",
			label: "Solicitudes Mensuales",
			render: () => (
				<MonthlyMaterialTab
					currentBranchId={branchId!}
					onRequestError={handleRequestError}
					onRequestSuccess={handleRequestSuccess}
				/>
			),
		},
		{
			id: "occasional-applications",
			label: "Solicitudes Eventuales",
			render: () => (
				<OccasionalMaterialTab
					currentBranchId={branchId!}
					onRequestError={handleRequestError}
					onRequestSuccess={handleRequestSuccess}
				/>
			),
		},
	];

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>

			<div className="flex justify-start">
				<Breadcrumb
					items={[
						{
							label: "Dashboard",
							url: `${baseUrl}/`,
							onClick: (url) => navigate(url),
						},
						{
							label: "Solicitudes de compras",
							url: `${baseUrl}/purchasing/requisitions`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<SectionHeader
				title={"Solicitudes de compras"}
				subtitle={"Gestione requisiciones, solicitudes mensuales y eventuales"}
				logoImage={activeLogo}
			/>

			<div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
				<Tabs tabItems={tabs ?? []} activeTab="requisitions" animation="slide" />
			</div>

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>
		</m.div>
	);
};
