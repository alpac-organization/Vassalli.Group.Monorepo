import { Badges } from "@alpac/design-system";
import {
	CheckCircle2,
	FileSpreadsheet,
	FileText,
	Info,
	Package,
	Scale,
	Ship,
	Truck,
	User,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { GetOperationalOrderDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";
import { getOperationalOrderStatusLabel } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";
import { formatOptionalNumber } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/utils/operational-order-detail.utils";
import { AlertedMerchandiseBadge } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/alerted-merchandise-badge";

type GeneralInformationSectionProps = {
	detail: GetOperationalOrderDetailResponse;
};

export function GeneralInformationSection({
	detail,
}: GeneralInformationSectionProps) {
	const isAlerted = Boolean(detail.is_alerted);

	return (
		<section className="relative flex flex-col gap-3">
			{isAlerted ? <AlertedMerchandiseBadge /> : null}
			<h4
				className={`${sectionTitleClassName} ${
					isAlerted ? "pr-40 sm:pr-50" : ""
				}`}
			>
				Información general
			</h4>
			<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DetailField
					label="Código PO"
					value={
						<span className="font-semibold text-slate-800 dark:text-slate-100">
							{detail.po_code || "—"}
						</span>
					}
					icon={<FileSpreadsheet size={18} />}
				/>
				<DetailField
					label="No. Documento"
					value={detail.document_number || "—"}
					icon={<FileText size={18} />}
				/>
				<DetailField
					label="Tipo de Documento"
					value={resolveDocumentTypeLabel(detail.document_type) || "—"}
					icon={<FileText size={18} />}
				/>
				<DetailField
					label="Estado"
					value={
						detail.status != null ? (
							<Badges
								label={getOperationalOrderStatusLabel(detail.status)}
								color="warning"
								className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 w-fit! px-2.5! py-0.5! text-xs font-semibold"
							/>
						) : (
							"—"
						)
					}
					icon={<CheckCircle2 size={18} />}
				/>
				<DetailField
					label="Cantidad de Bultos"
					value={formatOptionalNumber(detail.packages_count, "bultos")}
					icon={<Package size={18} />}
				/>
				<DetailField
					label="Peso Total"
					value={formatOptionalNumber(detail.weight, "kg")}
					icon={<Scale size={18} />}
				/>
				<DetailField
					label="Naviera / Compañía de envío"
					value={detail.shipping_company || "—"}
					icon={<Ship size={18} />}
				/>
				<DetailField
					label="Consignatario"
					value={detail.consignee || "—"}
					icon={<User size={18} />}
				/>
				<DetailField
					label="Remitente"
					value={detail.sender || "—"}
					icon={<Truck size={18} />}
				/>
				<DetailField
					label="No. Póliza"
					value={detail.policy_number || "—"}
					icon={<FileText size={18} />}
				/>
				<DetailField
					label="Descripción"
					value={detail.description || "—"}					
					icon={<Info size={18} />}
					containerClass={(detail.description?.length && detail.description?.length > 80) ? "col-span-3" : ""}
				/>
			</div>
		</section>
	);
}
