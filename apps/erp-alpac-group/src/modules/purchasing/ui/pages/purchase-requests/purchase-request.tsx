import { useEffect, useState } from "react";
import {
	Breadcrumb,
	Button,
	SectionHeader,
	Tabs,
	useTheme,
	type TabItem,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { AnimatePresence, m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { RequisitionTab } from "@app/modules/purchasing/ui/pages/purchase-requests/components/tabs/requisition-tab/requisition-tab";
import { MonthlyMaterialTab } from "@app/modules/purchasing/ui/pages/purchase-requests/components/tabs/monthly-materials-tab/monthly-materials-tab";
import { OccasionalMaterialTab } from "@app/modules/purchasing/ui/pages/purchase-requests/components/tabs/occasional-materials-tab/occasional-materials-tab";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { MONTHLY_TAB_ID, shouldShowMonthlyNote, dismissMonthlyNote } from "@app/modules/purchasing/ui/pages/purchase-requests/utils/get-notification-req-mensual";


export const PurchaseRequest = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const { branchId, companyId,  userName, email } = useUserStore();
	const noteUserKey = userName || email || "anonymous";

	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const {
		AlertComponent,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const [activeTab, setActiveTab] = useState("requisitions");
	const [isMonthlyNoteVisible, setIsMonthlyNoteVisible] = useState(false);

	useEffect(() => {
		if (activeTab !== MONTHLY_TAB_ID) {
			setIsMonthlyNoteVisible(false);
			return;
		}
		setIsMonthlyNoteVisible(shouldShowMonthlyNote(noteUserKey));
	}, [activeTab, noteUserKey]);

	const handleAcceptMonthlyNote = () => {
		dismissMonthlyNote(noteUserKey);
		setIsMonthlyNoteVisible(false);
	};

	const tabs: TabItem<string>[] = [
		{
			id: "requisitions",
			label: "Requisiciones",
			render: () => (
				<RequisitionTab
					key={`requisition-${companyId}-${branchId}`}
					currentBranchId={branchId ?? ""}
					onRequestError={handleRequestError}
					onRequestSuccess={handleRequestSuccess}
				/>
			),
		},
		{
			id: MONTHLY_TAB_ID,
			label: "Solicitudes Mensuales",
			render: () => (
				<MonthlyMaterialTab
					key={`monthly-${companyId}-${branchId}`}
					currentBranchId={branchId ?? ""}
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
					key={`occasional-${companyId}-${branchId}`}
					currentBranchId={branchId ?? ""}
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
				<Tabs
					tabItems={tabs ?? []}
					activeTab="requisitions"
					animation="slide"
					onTabChange={setActiveTab}
				/>
			</div>

			<AnimatePresence>
				{isMonthlyNoteVisible ? (
					<m.div
						key="monthly-request-note"
						initial={{ opacity: 0, y: 24, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 16, scale: 0.96 }}
						transition={{ duration: 0.35, ease: "easeOut" }}
						className="fixed bottom-4 left-1/2 z-50 w-[min(calc(100vw-2.5rem),16.5rem)] -translate-x-1/2 sm:left-auto sm:right-4 sm:w-[min(calc(100vw-2rem),20rem)] sm:translate-x-0"
						role="status"
					>
						<div className="rounded-xl border border-yellow-500 bg-yellow-50 p-2.5 text-yellow-900 shadow-xl sm:p-3 dark:border-yellow-500/50 dark:bg-[#3a3428] dark:text-yellow-100">
							<div className="flex items-start gap-2 sm:gap-2.5">
								<svg
									className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<div className="min-w-0">
									<h3 className="m-0 text-[13px] font-semibold sm:text-[14px]">
										Nota
									</h3>
									<p className="mt-0.5 mb-0 text-[12px] font-medium leading-snug sm:text-[13px]">
										Recuerda llenar tu solicitud 2 días antes de finalizar el mes
									</p>
								</div>
							</div>
							<Button
								type="button"
								size="small"
								label="Aceptar"
								onClick={handleAcceptMonthlyNote}
								className="mt-2 w-full! rounded-md! text-[12px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:mt-2.5 sm:text-[13px]!"
							/>
						</div>
					</m.div>
				) : null}
			</AnimatePresence>

			<AnimatePresence>
				{isMonthlyNoteVisible ? (
					<m.div
						key="monthly-request-note"
						initial={{ opacity: 0, y: 24, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 16, scale: 0.96 }}
						transition={{ duration: 0.35, ease: "easeOut" }}
						className="fixed bottom-4 left-1/2 z-50 w-[min(calc(100vw-2.5rem),16.5rem)] -translate-x-1/2 sm:left-auto sm:right-4 sm:w-[min(calc(100vw-2rem),20rem)] sm:translate-x-0"
						role="status"
					>
						<div className="rounded-xl border border-yellow-500 bg-yellow-50 p-2.5 text-yellow-900 shadow-xl sm:p-3 dark:border-yellow-500/50 dark:bg-[#3a3428] dark:text-yellow-100">
							<div className="flex items-start gap-2 sm:gap-2.5">
								<svg
									className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<div className="min-w-0">
									<h3 className="m-0 text-[13px] font-semibold sm:text-[14px]">
										Nota
									</h3>
									<p className="mt-0.5 mb-0 text-[12px] font-medium leading-snug sm:text-[13px]">
										Recuerda llenar tu solicitud 2 días antes de finalizar el mes
									</p>
								</div>
							</div>
							<Button
								type="button"
								size="small"
								label="Aceptar"
								onClick={handleAcceptMonthlyNote}
								className="mt-2 w-full! rounded-md! text-[12px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:mt-2.5 sm:text-[13px]!"
							/>
						</div>
					</m.div>
				) : null}
			</AnimatePresence>

			{AlertComponent}
		</m.div>
	);
};
