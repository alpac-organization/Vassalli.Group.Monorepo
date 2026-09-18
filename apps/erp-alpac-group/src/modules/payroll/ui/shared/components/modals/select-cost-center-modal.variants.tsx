import { RadioButton, type TableColumn } from "@alpac/design-system";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";

type GetColumnConfigParams = {
  selectedCostCenter: GetCostCentersResponse | null;
  onSelect: (costCenter: GetCostCentersResponse) => void;
};
export const getColumnConfig = ({ selectedCostCenter, onSelect }: GetColumnConfigParams): TableColumn<GetCostCentersResponse>[] => {
  return [
    {
      key: "select",
      label: "Selector",
      render: (row: GetCostCentersResponse) => (
        <RadioButton
          name="select-cost-center"
          checked={selectedCostCenter?.cost_center_id === row.cost_center_id}
          onChange={() => onSelect(row)}
          aria-label={`Seleccionar ${row.cost_center_name}`}
        />
      ),
    },
    {
      key: "cost_center_name",
      label: "Centro de costo",
    },
    {
      key: "coil_code",
      label: "Codigo Coil",
      render: (row: GetCostCentersResponse) => row.coil_code ?? "—",
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (row: GetCostCentersResponse) => row.description ?? "—",
    },
  ];
};