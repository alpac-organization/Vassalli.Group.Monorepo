import { FileText, User } from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { CustomerInformation } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";

type CustomerInformationSectionProps = {
	customer: CustomerInformation | null | undefined;
};

export function CustomerInformationSection({
	customer,
}: CustomerInformationSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<h4 className={sectionTitleClassName}>Cliente</h4>
			<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DetailField
					label="Cliente"
					value={customer?.legal_name || "—"}
					icon={<User size={18} />}
				/>
				<DetailField
					label="Identificación"
					value={
						customer?.identification_number || customer?.cif || "—"
					}
					icon={<FileText size={18} />}
				/>
				<DetailField
					label="Tipo de identificación"
					value={
						customer?.identification_type != null
							? String(customer.identification_type)
							: "—"
					}
					icon={<FileText size={18} />}
				/>
				<DetailField
					label="Tipo de cliente"
					value={customer?.customer_type || "—"}
					icon={<User size={18} />}
				/>
			</div>
		</section>
	);
}
