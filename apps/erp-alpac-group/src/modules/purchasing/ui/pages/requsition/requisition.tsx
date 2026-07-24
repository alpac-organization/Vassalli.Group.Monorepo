import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	Tabs,
	type TabItem
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { RequisitionTab } from "./components/tabs/requisition-tab/requisition-tab";
import { MonthlyMaterialTab } from "./components/tabs/monthly-materials-tab/monthly-materials-tab";
import { OccasionalMaterialTab } from "./components/tabs/occasional-materials-tab/occasional-materials-tab";

export const Requisition = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();

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
			render: () =>
			(<RequisitionTab
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
			/>)
		},
		{
			id: "monthly-applications",
			label: "Solicitud de Materiales Mensuales",
			render: () =>
			(<MonthlyMaterialTab
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
			/>)
		},
		{
			id: "occasional-applications",
			label: "Solicitud de Materiales Eventuales",
			render: () =>
			(<OccasionalMaterialTab
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
			/>)
		},
	]

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

			<div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
				<Tabs tabItems={tabs ?? []} activeTab="requisitions" />
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
