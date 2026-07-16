import { Button } from "@alpac/design-system";
import { Warehouse } from "lucide-react";
import { useCallback, useState } from "react";
import type { WarehouseTabProps } from "./warehouse-tab.types";
import { WarehouseModal } from "@app/modules/warehouse/ui/warehouse/components/warehouse-modal/warehouse-modal";
import { WarehouseTable } from "./components/warehouse-table/warehouse-table";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";

export const WarehouseTab = ({ }: WarehouseTabProps) => {

	const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);

	const { companyId, moduleCode } = useUserStore();

	const initialFilter: GetWarehouseRequest = {
		company_id: companyId,
		module_code: moduleCode
	};

	const { GetWarehouses } = useWarehouse({
		getWarehousesPayload: initialFilter
	});

	const { data } = GetWarehouses;

	console.log("Datos de las warehouse : ", data);

	const handleCreateWarehouse = useCallback(() => {
		setIsWarehouseModalOpen(true);
	}, []);

	return (
		<div>
			<Button
				type="button"
				size="giant"
				label="Registrar Nueva Bodega"
				icon={<Warehouse size={20} />}
				className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				onClick={handleCreateWarehouse}
			/>

			<WarehouseTable data={[]} />

			<WarehouseModal
				isOpen={isWarehouseModalOpen}
				onSubmit={(data) => { console.log(data) }}
				onClose={() => { setIsWarehouseModalOpen(false) }}
			/>
		</div>
	);
}