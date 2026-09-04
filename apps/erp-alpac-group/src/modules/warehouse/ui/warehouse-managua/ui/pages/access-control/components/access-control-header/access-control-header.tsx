import { Breadcrumb, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useNavigate } from "react-router-dom";

export function AccessControlHeader() {
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
              label: "Control de Acceso",
              url: `${baseUrl}/warehouse-mga/access-control`,
            },
          ]}
        />
      </div>

      <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
        <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
          <h3 className="p-0! m-0! text-lg sm:text-xl md:text-2xl">
            Ingreso Vehicular
          </h3>
          <small className="text-gray-500 dark:text-gray-300">
            Control de Acceso y Gestión de Cola vehicular
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
