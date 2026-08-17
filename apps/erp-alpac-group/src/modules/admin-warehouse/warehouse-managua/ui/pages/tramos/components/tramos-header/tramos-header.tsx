import { Breadcrumb, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useNavigate } from "react-router-dom";

type TramosHeaderProps = {
  warehouseId: string;
  sectionId: string;
};

export function TramosHeader({ warehouseId, sectionId }: TramosHeaderProps) {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  return (
    <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
      <div className="flex justify-start min-w-0 overflow-x-auto">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Lista de bodegas",
              url: `${baseUrl}/warehouse-mga/warehouse`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Secciones",
              url: `${baseUrl}/warehouse-mga/warehouse/${warehouseId}/sections`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Tramos",
              url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${sectionId}`,
            },
          ]}
        />
      </div>

      <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
        <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
          <h3 className="p-0! m-0! text-lg sm:text-xl md:text-2xl">
            Tramos de la sección
          </h3>
          <small className="text-gray-500 dark:text-gray-300">
            Consulte y registre tramos de la sección seleccionada
          </small>
        </div>
        {activeLogo && (
          <img
            className="h-10 sm:h-16 md:h-20 w-auto max-w-[35%] sm:max-w-none object-contain shrink-0 self-start sm:self-center"
            src={activeLogo}
            alt="vasalli group"
          />
        )}
      </div>
    </div>
  );
}
