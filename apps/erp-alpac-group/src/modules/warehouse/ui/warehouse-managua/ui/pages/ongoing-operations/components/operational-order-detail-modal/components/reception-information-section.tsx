import {
	Info,
	Landmark,
	Package,
	ShieldCheck,
	Ship,
	Truck,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { AdditionalDataDocumentNumber } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import type { ReceptionEntranceInformation } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { ConsolidatedInformationSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/consolidated-information-section";

type ReceptionInformationSectionProps = {
	receptionInfo: ReceptionEntranceInformation;
	isConsolidated: boolean | null | undefined;
	documentNumbers: AdditionalDataDocumentNumber[];
};

export function ReceptionInformationSection({
	receptionInfo,
	isConsolidated,
	documentNumbers,
}: ReceptionInformationSectionProps) {
	const customBranch = receptionInfo.custom_branches_information;

	return (
		<section className="flex flex-col gap-3">
			<h4 className={sectionTitleClassName}>Información de recepción</h4>
			<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DetailField
					label="Código de Recepción"
					value={receptionInfo.reception_code || "—"}
					icon={<ShieldCheck size={18} />}
				/>
				<DetailField
					label="Sello"
					value={receptionInfo.seal_number || "—"}
					icon={<ShieldCheck size={18} />}
				/>
				<DetailField
					label="Contenedor"
					value={receptionInfo.container_number || "—"}
					icon={<Package size={18} />}
				/>
				<DetailField
					label="País de origen"
					value={receptionInfo.country_of_origin || "—"}
					icon={<Ship size={18} />}
				/>
				<DetailField
					label="Aduana / Sucursal"
					value={
						customBranch?.customs_branch_name ||
						customBranch?.code ||
						"—"
					}
					icon={<Landmark size={18} />}
				/>
				<DetailField
					label="Fecha de registro"
					value={
						receptionInfo.created_at
							? formatDateToSpanishWords(receptionInfo.created_at)
							: "—"
					}
					icon={<Info size={18} />}
				/>
				<DetailField
					label="Hora salida vehículo"
					value={receptionInfo.vehicle_exit_time || "—"}
					icon={<Truck size={18} />}
				/>
				<DetailField
					label="Hora salida contenedor"
					value={receptionInfo.container_exit_time || "—"}
					icon={<Package size={18} />}
				/>
			</div>

			<ConsolidatedInformationSection
				isConsolidated={isConsolidated}
				documentNumbers={documentNumbers}
			/>
		</section>
	);
}
