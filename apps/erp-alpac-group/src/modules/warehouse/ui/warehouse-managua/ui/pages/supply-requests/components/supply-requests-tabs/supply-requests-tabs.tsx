import type { TabItem } from "@alpac/design-system";

import { OperationalRequests } from "./../operational-requests/operational-requests";
import { CombustibleRequests } from "./../combustibles/combustible-requests";

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