import type { TabItem } from "@alpac/design-system";

import { OperationalRequests } from "./views/operational/operational-requests";
import { CombustibleRequests } from "./views/combustibles/combustible-requests";

export const GetSectionViewsToSupplyRequests = function (): TabItem<string>[] {
  return [
    {
      id: "insumos",
      label: "Insumos",
      render: () => <OperationalRequests />,
    },
    {
      id: "combustibles",
      label: "Combustibles",
      render: () => <CombustibleRequests />,
    },
  ];
};