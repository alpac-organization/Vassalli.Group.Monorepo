import { Pagination } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CancelFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/cancel-fault.request";
import type { GetFaultsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-faults.request";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import type { FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import type { FaultStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import { useFault } from "@app/modules/payroll/ui/hooks/fault/useFault";
import { FaultDetailsModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/fault-details-modal/fault-details-modal";
import { FaultsFilters } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-filters/faults-filters";
import type { FaultsFilterFormValues } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-filters/faults-filters.types";
import { FaultsTable } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-table/faults-table";
import { RegisterFaultModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-fault-modal/register-fault-modal";
import { RegisterSanctionModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-sanction-modal/register-sanction-modal";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useMemo, useState } from "react";
import { cancelConfirmActionClass, cancelConfirmExitClass } from "../../utils/disciplinary-managment.variants";
import type { FaultsTabProps } from "./faults-tab.types";

const PAGE_SIZE = 5;

export const FaultsTab = ({ canWrite = true }: FaultsTabProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const { AlertComponent, handleRequestSuccess, handleRequestError } =
		useAlertState();

	const [pageNumber, setPageNumber] = useState(1);
	const [appliedFilters, setAppliedFilters] = useState<FaultsFilterFormValues>({
		code: "",
		severity: "all",
		status: "all",
		source: "all",
	});

	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isSanctionOpen, setIsSanctionOpen] = useState(false);
	const [selectedFault, setSelectedFault] = useState<FaultDto | null>(null);
	const [faultToCancel, setFaultToCancel] = useState<FaultDto | null>(null);
	const [cancelConfirm, setCancelConfirm] = useState<{
		isOpen: boolean;
		type: ConfirmActionType;
	}>({
		isOpen: false,
		type: "CANCEL",
	});

	const faultsFilters = useMemo<GetFaultsRequest>(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			page_number: pageNumber,
			page_size: PAGE_SIZE,
			...(appliedFilters.code.trim() && { code: appliedFilters.code.trim() }),
			...(appliedFilters.severity !== "all" && {
				severity: appliedFilters.severity as FaultSeverityEnumMap,
			}),
			...(appliedFilters.status !== "all" && {
				status: appliedFilters.status as FaultStatusEnumMap,
			}),
			...(appliedFilters.source !== "all" && {
				source: appliedFilters.source as FaultSourceEnumMap,
			}),
		}),
		[companyId, moduleCode, pageNumber, appliedFilters],
	);



	const faultDetailFilters = useMemo(
		() => ({
			company_id: companyId,
			module_code: moduleCode,
			fault_id: selectedFault?.fault_id ?? "",
		}),
		[companyId, moduleCode, selectedFault?.fault_id],
	);

	const { GetFaults, GetFaultDetails, CancelFault } = useFault({
		faultsFilters,
		faultDetailFilters: isDetailOpen ? faultDetailFilters : undefined,
	});

	const handleApplyFilters = useCallback((values: FaultsFilterFormValues) => {
		setAppliedFilters(values);
		setPageNumber(1);
	}, []);

	const handleClearFilters = useCallback(() => {
		setAppliedFilters({
			code: "",
			severity: "all",
			status: "all",
			source: "all",
		});
		setPageNumber(1);
	}, []);

	const handleViewDetail = useCallback((row: FaultDto) => {
		setSelectedFault(row);
		setIsDetailOpen(true);
	}, []);

	const handlePageChange = useCallback((page: number) => {
		setPageNumber(page);
	}, []);

	const openCancelConfirm = useCallback((row: FaultDto) => {
		if (row.status !== "Open") {
			handleRequestError(
				"Solo se pueden anular faltas pendientes de sanción.",
			);
			return;
		}

		setFaultToCancel(row);
		setCancelConfirm({ isOpen: true, type: "CANCEL" });
	}, [handleRequestError]);

	const closeCancelConfirm = useCallback(() => {
		setCancelConfirm({ isOpen: false, type: "CANCEL" });
		setFaultToCancel(null);
	}, []);

	const handleConfirmCancelFault = useCallback(async () => {
		if (!faultToCancel?.fault_id) return;

		const payload: CancelFaultRequest = {
			company_id: companyId,
			module_code: moduleCode,
			fault_id: faultToCancel.fault_id,
		};

		try {
			await CancelFault.mutateAsync(payload);
			closeCancelConfirm();
			setIsDetailOpen(false);
			setSelectedFault(null);
			handleRequestSuccess("Falta anulada exitosamente");
		} catch (error) {
			closeCancelConfirm();
			const mapped = getMappedError(error as ApiErrorResponse);
			handleRequestError(
				mapped.description ||
					"No se pudo anular la falta. Intente de nuevo.",
			);
		}
	}, [
		CancelFault,
		closeCancelConfirm,
		companyId,
		faultToCancel?.fault_id,
		getMappedError,
		handleRequestError,
		handleRequestSuccess,
		moduleCode,
	]);

	return (
		<div className="flex flex-col gap-4">
			{(GetFaults.isLoading || GetFaults.isFetching) && (
				<Loader title="Cargando faltas disciplinarias..." />
			)}

			<FaultsFilters
				canWrite={canWrite}
				onApply={handleApplyFilters}
				onClear={handleClearFilters}
				onRegisterFault={() => setIsRegisterOpen(true)}
			/>

			<FaultsTable
				data={GetFaults.data?.data ?? []}
				canWrite={canWrite}
				onViewDetail={handleViewDetail}
				onCancel={openCancelConfirm}
				pagination={
					<Pagination
						currentPage={GetFaults.data?.page_number ?? pageNumber}
						pageSize={GetFaults.data?.page_size ?? PAGE_SIZE}
						totalRecords={GetFaults.data?.total ?? 0}
						onPageChange={handlePageChange}
						disabled={GetFaults.isFetching}
					/>
				}
			/>

			<RegisterFaultModal
				isOpen={isRegisterOpen}
				onClose={() => setIsRegisterOpen(false)}
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
			/>

			<FaultDetailsModal
				isOpen={isDetailOpen}
				onClose={() => {
					setIsDetailOpen(false);
					setSelectedFault(null);
				}}
				summary={selectedFault}
				detail={GetFaultDetails.data}
				isDetailLoading={GetFaultDetails.isLoading || GetFaultDetails.isFetching}
				canWrite={canWrite}
				onCancelFault={() => {
					if (!selectedFault) return;
					openCancelConfirm(selectedFault);
				}}
				onApplySanction={() => {
					setIsDetailOpen(false);
					setIsSanctionOpen(true);
				}}
			/>

			<RegisterSanctionModal
				isOpen={isSanctionOpen}
				onClose={() => {
					setIsSanctionOpen(false);
					setSelectedFault(null);
				}}
				faultSummary={selectedFault}
				onRequestError={handleRequestError}
				onRequestSuccess={handleRequestSuccess}
			/>

			<ConfirmModal
				variant="warning"
				title="¿Está seguro de anular esta falta disciplinaria?"
				buttonActionLabel="Anular falta"
				buttonActionClass={cancelConfirmActionClass}
				buttonCancelClass={cancelConfirmExitClass}
				isOpen={cancelConfirm.isOpen}
				onClose={closeCancelConfirm}
				type={cancelConfirm.type}
				isLoading={CancelFault.isPending}
				disabled={CancelFault.isPending}
				handleFinalAction={() => {
					void handleConfirmCancelFault();
				}}
			/>

			{AlertComponent}
		</div>
	);
};
