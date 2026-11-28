import { Banner, Button, Modal } from "@alpac/design-system";
import { useLiquidation } from "@app/modules/payroll/ui/hooks/liquidation/useLiquidation";
import { LiquidationDetailSections } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidation-detail-sections/liquidation-detail-sections";
import type { LiquidationDetailModalProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidation-detail-modal/liquidation-detail-modal.types";
import {
  procesoBajaModalContentClassName,
  procesoBajaModalPanelClassName,
  procesoBajaSecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import { Loader } from "@app/shared/components/loaders/loader";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { BanIcon } from "lucide-react";
import { useMemo } from "react";

export const LiquidationDetailModal = ({
  isOpen,
  liquidationId,
  onClose,
}: LiquidationDetailModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();

  const detailFilters = useMemo(
    () =>
      isOpen && liquidationId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            liquidation_id: liquidationId,
          }
        : undefined,
    [companyId, isOpen, liquidationId, moduleCode],
  );

  const { GetLiquidationDetails } = useLiquidation({
    liquidationDetailFilters: detailFilters,
  });

  const detail = GetLiquidationDetails.data;
  const detailError = GetLiquidationDetails.error
    ? getMappedError(GetLiquidationDetails.error).description ||
      "No se pudo cargar el detalle de la liquidación."
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="7xl"
      title="Detalle de liquidación"
      description="Consulta los totales y el desglose de la liquidación"
      panelClassName={procesoBajaModalPanelClassName}
      contentClassName={procesoBajaModalContentClassName}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
          {GetLiquidationDetails.isLoading && (
            <Loader title="Cargando detalle de la liquidación..." />
          )}

          {detailError && (
            <Banner
              variant="error"
              title="Error al cargar el detalle"
              description={detailError}
            />
          )}

          {!GetLiquidationDetails.isLoading && !detail && !detailError && (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No se encontró la información solicitada.
            </p>
          )}

          {detail && (
            <div className="pb-2">
              <LiquidationDetailSections detail={detail} />
            </div>
          )}
        </div>

        <div className="-mx-4 -mb-4 mt-3 shrink-0 rounded-b-xl border-t border-t-slate-300 bg-white px-4 py-3 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              size="giant"
              label="Cerrar"
              className={`${procesoBajaSecondaryButtonClassName} w-full min-w-0 sm:w-auto`}
              icon={<BanIcon size={20} />}
              isHiddenLabelOnMobile
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
