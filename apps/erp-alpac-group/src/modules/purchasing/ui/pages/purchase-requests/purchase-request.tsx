import { useCallback, useState } from "react";
import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	Button,
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
import { SelectBranchModal } from "./components/select-branch-modal/select-branch-modal";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

export const PurchaseRequest = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const {
		alertState,
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
	const [selectedBranchName, setSelectedBranchName] = useState("");
	const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

	const isBranchSelected = selectedBranchId !== null;

	const handleBranchModalClose = useCallback(() => {
		if (!isBranchSelected) {
			navigate(`${baseUrl}/`);
			return;
		}
		setIsBranchModalOpen(false);
	}, [baseUrl, isBranchSelected, navigate]);

	const handleBranchConfirm = useCallback(
		(branchId: string, branchName: string) => {
			setSelectedBranchId(branchId);
			setSelectedBranchName(branchName);
			setIsBranchModalOpen(false);
		},
		[],
	);

	const tabs: TabItem<string>[] = [
		{
			id: "requisitions",
			label: "Requisiciones",
			render: () => (
				<RequisitionTab
					currentBranchId={selectedBranchId!}
					onRequestError={handleRequestError}
					onRequestSuccess={handleRequestSuccess}
				/>
			),
		},
		{
			id: "monthly-applications",
			label: "Solicitud de Materiales Mensuales",
			disabled: true,
			render: () => (
				<MonthlyMaterialTab
					currentBranchId={selectedBranchId!}
					onRequestError={handleRequestError}
					onRequestSuccess={handleRequestSuccess}
				/>
			),
		},
		{
			id: "occasional-applications",
			label: "Solicitud de Materiales Eventuales",
			render: () => (
				<OccasionalMaterialTab
					currentBranchId={selectedBranchId!}
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
			<SelectBranchModal
				isOpen={!isBranchSelected || isBranchModalOpen}
				onClose={handleBranchModalClose}
				onConfirm={handleBranchConfirm}
				currentBranchId={selectedBranchId}
			/>

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

			{isBranchSelected ? (
				<>
					<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
						<div className="min-w-0">
							<p className="m-0 text-sm text-slate-500 dark:text-slate-300">
								Sucursal seleccionada:{" "}
								<span className="font-medium text-slate-800 dark:text-white">
									{selectedBranchName}
								</span>
							</p>
						</div>
						<Button
							type="button"
							size="giant"
							label="Cambiar sucursal"
							onClick={() => setIsBranchModalOpen(true)}
							className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-primary!"
						/>
					</div>

					<div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
						<Tabs tabItems={tabs ?? []} activeTab="requisitions" animation="slide" />
					</div>
				</>
			) : null}

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
