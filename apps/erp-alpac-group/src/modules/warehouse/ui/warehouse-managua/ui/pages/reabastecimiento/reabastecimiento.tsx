import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, SectionHeader, useTheme } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useRegisterFuelRequest } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useRegisterFuelRequest";
import type { RegisterFuelRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/register-fuel-request.request";
import { FuelRequestForm } from "./components/fuel-request-form/fuel-request-form";

export function ReabastecimientoPage() {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode, moduleBasePath } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { theme } = useTheme();
  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();
  const { RegisterFuelRequest } = useRegisterFuelRequest();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const handleSubmitFuelRequest = async (data: {
    machinery_id: string;
    product_stock_id: string;
    requested_quantity: number;
    mileage?: number;
    engine_hours?: number;
    justification: string;
  }): Promise<boolean> => {
    if (!companyId || !moduleCode) return false;

    const payload: RegisterFuelRequest = {
      company_id: companyId,
      module_code: moduleCode,
      justification: data.justification,
      machinery_id: data.machinery_id,
      product_stock_id: data.product_stock_id,
      requested_quantity: data.requested_quantity,
      mileage: data.mileage,
      engine_hours: data.engine_hours,
    };

    try {
      await RegisterFuelRequest.mutateAsync(payload);
      handleRequestSuccess("Solicitud de combustible registrada exitosamente.");
      return true;
    } catch (error) {
      handleRequestError(error);
      return false;
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
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
              label: "Reabastecimiento",
              url: `${baseUrl}/${moduleBasePath}/reabastecimiento`,
            },
          ]}
        />
      </div>

      <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
        <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
          <SectionHeader
            title="Reabastecimiento"
            subtitle="Gestión de solicitudes de combustible."
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

      <div className="w-full md:w-1/3 min-w-0 box-border flex flex-col gap-3
      rounded-lg border border-slate-200 dark:border-slate-500 p-4 sm:p-6">
        <h3 className="p-0! m-0!">Solicitud de combustible</h3>
        <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
          Registra una solicitud de combustible para una maquinaria.
        </small>
        <FuelRequestForm
          isSubmitting={RegisterFuelRequest.isPending}
          onSubmit={handleSubmitFuelRequest}
        />
      </div>

      {AlertComponent}
    </m.div>
  );
}

export default ReabastecimientoPage;