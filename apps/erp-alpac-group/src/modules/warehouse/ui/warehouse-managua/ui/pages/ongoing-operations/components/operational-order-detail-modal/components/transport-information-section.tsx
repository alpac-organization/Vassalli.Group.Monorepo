import { FileText, Package, Ship, Truck, User } from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { ReceptionTransportEntranceDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";
import { resolveTransportUnitLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/utils/operational-order-detail.utils";

type TransportInformationSectionProps = {
	transportInfo: ReceptionTransportEntranceDto;
};

export function TransportInformationSection({
	transportInfo,
}: TransportInformationSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<h4 className={sectionTitleClassName}>Vehículo y conductor</h4>
			<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DetailField
					label="Placa de Vehículo"
					value={
						transportInfo.vehicle_plate_number ? (
							<span className="font-semibold tracking-wider text-slate-800 dark:text-slate-100">
								{transportInfo.vehicle_plate_number}
							</span>
						) : (
							"—"
						)
					}
					icon={<Truck size={18} />}
				/>
				<DetailField
					label="Chasis / Remolque"
					value={transportInfo.vehicle_chassis_number || "—"}
					icon={<Truck size={18} />}
				/>
				<DetailField
					label="Unidad de transporte"
					value={resolveTransportUnitLabel(transportInfo.transport_unit)}
					icon={<Package size={18} />}
				/>
				<DetailField
					label="Conductor"
					value={transportInfo.driver_name || "—"}
					icon={<User size={18} />}
				/>
				<DetailField
					label="Licencia"
					value={transportInfo.driver_license || "—"}
					icon={<FileText size={18} />}
				/>
				<DetailField
					label="Transportista"
					value={transportInfo.transportista || "—"}
					icon={<Ship size={18} />}
				/>
			</div>
		</section>
	);
}
