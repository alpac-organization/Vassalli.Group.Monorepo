import { Checkbox, type TableColumn } from "@alpac/design-system";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";

export const getColumnConfig = function(): TableColumn<GetCostCentersResponse>[]{
	return [
		{
			key: "cost_center_name",
			label: "Centro costo",
			render: () => (
				<Checkbox
					name="select-service-order-multiple"
					aria-label={`Seleccionar`}
				/>
			)
		}
	]   
}
