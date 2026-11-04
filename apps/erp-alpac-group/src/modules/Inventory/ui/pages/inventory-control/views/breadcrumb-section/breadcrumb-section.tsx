import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";

import type { BreadcrumbSectionProps } from "./breadcrumb-section.types";

export const BreadcrumbSection = function ({ currentLabel = "", onInventoryClick }: BreadcrumbSectionProps) {
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();

   return (
      <div className="flex justify-start">
         <Breadcrumb
            items={[
               {
                  label: "Dashboard",
                  url: `${baseUrl}/`,
                  onClick: (url) => navigate(url),
               },
               {
                  label: "Control de inventario",
                  url: `${baseUrl}/inventory/inventory-control`,
                  onClick: (url) => onInventoryClick ? onInventoryClick() : navigate(url),
               },
               {
                  label: currentLabel,
                  url: `${baseUrl}/inventory/inventory-control`
               },
            ]}
         />
      </div>
   );
};