import { useCallback, useMemo } from "react";
import { useTheme } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { ModulePageHeaderItem } from "@app/shared/hooks/module-page-header.types";

export const useModulePageHeader = (
  buildItems: (baseUrl: string) => ModulePageHeaderItem[],
) => {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const goTo = useCallback(
    (url: string) => {
      navigate(url);
    },
    [navigate],
  );

  const breadcrumbItems = useMemo(
    () =>
      buildItems(baseUrl).map((item) => ({
        ...item,
        onClick: goTo,
      })),
    [baseUrl, buildItems, goTo],
  );

  return {
    activeLogo,
    breadcrumbItems,
  };
};