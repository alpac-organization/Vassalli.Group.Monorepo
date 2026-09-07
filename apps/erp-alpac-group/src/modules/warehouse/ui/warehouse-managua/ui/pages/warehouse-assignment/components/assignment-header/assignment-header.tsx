import { Breadcrumb, Button, useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useNavigate } from "react-router-dom";
import type { AssignmentPageView } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";

type AssignmentHeaderProps = {
  activeView: AssignmentPageView;
  onViewChange: (view: AssignmentPageView) => void;
};

export function AssignmentHeader({ activeView, onViewChange }: AssignmentHeaderProps) {
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
              label: "Asignación de Bodegas, cuadrilla y maquinaria",
              url: `${baseUrl}/warehouse-assignment`,
            },
          ]}
        />
      </div>

      <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
        <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
          <h3 className="p-0! m-0! text-lg sm:text-xl md:text-2xl">
            Asignación
          </h3>
          <small className="text-gray-500 dark:text-gray-300">
            Asignación de bodega, cuadrilla y maquinaria por recepción
          </small>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle vista pendientes / historial */}
          <div className="flex rounded-md overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0">
            <Button
              type="button"
              label="Pendientes"
              onClick={() => onViewChange("pending")}
              className={`rounded-none! text-sm! px-3! py-2! ${
                activeView === "pending"
                  ? "bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700!"
                  : "bg-transparent! text-slate-600! dark:text-slate-300!"
              }`}
            />
            <Button
              type="button"
              label="Historial"
              onClick={() => onViewChange("history")}
              className={`rounded-none! text-sm! px-3! py-2! border-l! border-slate-300! dark:border-slate-600! ${
                activeView === "history"
                  ? "bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700!"
                  : "bg-transparent! text-slate-600! dark:text-slate-300!"
              }`}
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
      </div>
    </div>
  );
}

