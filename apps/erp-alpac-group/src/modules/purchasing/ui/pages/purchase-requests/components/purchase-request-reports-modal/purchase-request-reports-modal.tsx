import { useEffect, useState, type JSXElementConstructor, type ReactElement } from "react";
import { Button, DatePicker, Dropdown, Modal } from "@alpac/design-system";
import { FileTextIcon } from "lucide-react";
import dayjs, { type Dayjs } from "dayjs";
import {
	PurchaseRequestReportsOptions,
	PurchaseRequestReportType,
	type PurchaseRequestReportsModalProps,
} from "./purchase-request-reports-modal.types";
import { PurchaseRequestConsolidatedPDF } from "../reports/purchase-request-consolidated-pdf/purchase-request-consolidated-pdf";
import { pdf, type DocumentProps } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";

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
	isGenerating = false,
}: PurchaseRequestReportsModalProps) => {

	const { companyAlias, } = useUserStore();
	const { urlImage } = useCompanyStore();

	const [selectedReport, setSelectedReport] = useState<PurchaseRequestReportType | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null);

	useEffect(() => {
		if (isOpen) return;

		setSelectedReport(null);
		setSelectedMonth(null);
	}, [isOpen]);

	const canGenerate =
		selectedReport === PurchaseRequestReportType.ConsolidatedProducts &&
		Boolean(selectedMonth?.isValid()) &&
		!isGenerating;

	const handleClose = () => {
		if (isGenerating) return;
		onClose();
	};

	const handleGenerate = async () => {
		if (
			selectedReport !== PurchaseRequestReportType.ConsolidatedProducts ||
			!selectedMonth?.isValid()
		) {
			return;
		}

		let report: ReactElement<DocumentProps, string | JSXElementConstructor<any>> | undefined = undefined;

		if (selectedReport === PurchaseRequestReportType.ConsolidatedProducts) {
			report = (<PurchaseRequestConsolidatedPDF
				companyAlias={companyAlias}
				logoUrl={urlImage}
				periodLabel=""
				data={[]}
				requestTypeLabel=""
				requestCount={0}
				totalQuantity={0}
			/>);
		}

		if (!report) {
			onGenerate("Error al generar el PDF de la solicitud de compra.");
			return;
		}

		try {
			const blob = await pdf(report).toBlob();
			const url = URL.createObjectURL(blob);
			window.open(url, "_blank");
		} catch (error) {
			onGenerate("Error al generar el PDF de la solicitud de compra.");
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			variant="default"
			size="lg"
			title="Reportes"
			description="Seleccione un reporte para generarlo"
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

				{selectedReport === PurchaseRequestReportType.ConsolidatedProducts && (
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
						disabled={isGenerating}
						onClick={handleClose}
					/>
					<Button
						type="button"
						size="giant"
						label="Generar PDF"
						icon={<FileTextIcon size={20} />}
						className={primaryButtonClassName}
						disabled={!canGenerate}
						isLoading={isGenerating}
						onClick={handleGenerate}
					/>
				</div>
			</div>
		</Modal>
	);
};
