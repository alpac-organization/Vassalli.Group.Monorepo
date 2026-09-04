import { useEffect, useState } from "react";
import { Button, DatePicker, Dropdown, Modal } from "@alpac/design-system";
import { FileTextIcon } from "lucide-react";
import dayjs, { type Dayjs } from "dayjs";
import {
	PurchaseRequestReportsOptions,
	PurchaseRequestReportType,
	PurchaseRequestConsolidationType,
	type PurchaseRequestReportsModalProps,
} from "./purchase-request-reports-modal.types";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!";
const datePickerClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

export const PurchaseRequestReportsModal = ({
	isOpen,
	onClose,
	onGenerate,
}: PurchaseRequestReportsModalProps) => {

	const { companyId, moduleCode } = useUserStore();

	const { GetPurchaseRequestDocument } = usePurchase();
	const { getMappedError } = useMappedError();

	const [selectedReport, setSelectedReport] = useState<PurchaseRequestReportType | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null);

	const isLoading = GetPurchaseRequestDocument.isPending;

	const isMonthlyReport =
		selectedReport === PurchaseRequestReportType.ConsolidatedProducts ||
		selectedReport === PurchaseRequestReportType.TotalProducts;

	useEffect(() => {
		if (isOpen) return;

		setSelectedReport(null);
		setSelectedMonth(null);
	}, [isOpen]);

	const canGenerate =
		isMonthlyReport &&
		Boolean(selectedMonth?.isValid()) &&
		!isLoading;

	const handleClose = () => {
		if (isLoading) return;
		onClose();
	};

	const handleGenerate = async () => {
		if (!isMonthlyReport || !selectedMonth?.isValid()) {
			return;
		}

		const payload = {
			company_id: companyId,
			module_code: moduleCode,
			document_type: PurchaseRequestEnum.Monthly.value,
			...(selectedReport === PurchaseRequestReportType.TotalProducts
				? { consolidation_type: PurchaseRequestConsolidationType.TotalProducts }
				: {}),
			month: selectedMonth.month() + 1,
			year: selectedMonth.year(),
		};

		GetPurchaseRequestDocument.mutate(
			payload,
			{
				onSuccess: (response) => {
					if (response?.document_url) {
						window.open(response.document_url, "_blank", "noopener,noreferrer");
					}
					onClose();
				},
				onError: (error) => {
					onGenerate(getMappedError(error).description);
				},
			},
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="default"
			size="lg"
			title="Reportes"
			description="Seleccione un reporte y el mes a generar"
		>
			<div className="flex flex-col gap-4">

				<Dropdown
					label="Reporte a generar"
					placeholder="Seleccione un reporte..."
					appearance="dark"
					options={PurchaseRequestReportsOptions ?? []}
					value={selectedReport}
					onChange={(value) => setSelectedReport(value)}
					className={dropdownClassName}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
				/>

				{isMonthlyReport && (
					<DatePicker
						views={["year", "month"]}
						openTo="month"
						format="MMMM YYYY"
						fieldWidth="large"
						label="Mes"
						labelAbove
						isRequired
						disableFuture
						value={selectedMonth}
						onChange={(value) => {
							setSelectedMonth(value ? dayjs(value) : null);
						}}
						className={datePickerClassName}
						labelClassName={labelClassName}
					/>
				)}

				<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						className={secondaryButtonClassName}
						disabled={isLoading}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Generar PDF"
						icon={<FileTextIcon size={20} />}
						className={primaryButtonClassName}
						disabled={!canGenerate}
						isLoading={isLoading}
						onClick={handleGenerate}
					/>
				</div>
			</div>
		</Modal>
	);
};
