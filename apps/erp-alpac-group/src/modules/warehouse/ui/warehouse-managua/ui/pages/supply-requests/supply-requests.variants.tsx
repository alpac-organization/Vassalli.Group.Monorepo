import type { TabItem } from "@alpac/design-system";

import { OperationalRequests } from "./views/operational/operational-requests";
import { AdministrativeRequests } from "./views/administrative/administrative-requests";

export const GetSectionViewsToSupplyRequests = function (): TabItem<string>[] {
  return [
    {
      id: "operational",
      label: "Operacionales",
      render: () => <OperationalRequests />,
    },
    {
      id: "administrative",
      label: "Administrativas",
      render: () => <AdministrativeRequests />,
    },
  ];
};
