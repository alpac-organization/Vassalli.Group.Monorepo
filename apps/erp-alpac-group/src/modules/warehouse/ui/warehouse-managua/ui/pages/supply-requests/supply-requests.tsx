import { useEffect } from "react";
import { Breadcrumb, SectionHeader, Tabs, useTheme } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useParams } from "@app/shared/hooks/useParams";
import { useAlertState } from "@app/shared/hooks/useAlertState";

import { GetSectionViewsToSupplyRequests } from "./supply-requests.variants";

export const SupplyRequests = function () {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { moduleBasePath } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { theme } = useTheme();
  const { AlertComponent } = useAlertState();

  const { setParam, searchParams } = useParams();

  const tabsItems = GetSectionViewsToSupplyRequests();

  const tabFromUrl = searchParams.get("tab");

  const isValidTab = tabsItems.some((item) => item.id === tabFromUrl);

  const activeTab = isValidTab ? tabFromUrl! : "insumos";

  useEffect(() => {
    if (!isValidTab) {
      setParam("tab", "insumos");
    }
  }, [isValidTab, setParam]);

  const handleTabChange = (tabId: string) => {
    setParam("tab", tabId);
  };

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start min-w-0 overflow-x-auto">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Almacén",
              url: `${baseUrl}/${moduleBasePath}`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Solicitudes a inventario",
              url: `${baseUrl}/${moduleBasePath}/supply-requests`,
            },
          ]}
        />
      </div>

      <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
        <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
          <SectionHeader
            title="Solicitudes a inventario"
            subtitle="Consulta y gestiona las solicitudes de inventario."
          />
        </div>

        {activeLogo && (
          <img
            className="h-10 sm:h-16 md:h-20 w-auto max-w-[35%] sm:max-w-none object-contain shrink-0 self-start sm:self-center"
            src={activeLogo}
            alt="vassalli group"
          />
        )}
      </div>

      <Tabs
        activeTab={activeTab}
        tabItems={tabsItems}
        onTabChange={handleTabChange}
      />

      {AlertComponent}
    </div>
  );
};