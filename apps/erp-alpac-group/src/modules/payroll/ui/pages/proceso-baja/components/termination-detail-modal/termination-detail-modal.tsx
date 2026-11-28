import { Banner, Button, Modal } from "@alpac/design-system";
import type { LiquidationDto } from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";
import type { TerminationUserDto } from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";
import { useLiquidation } from "@app/modules/payroll/ui/hooks/liquidation/useLiquidation";
import { useTermination } from "@app/modules/payroll/ui/hooks/termination/useTermination";
import { LiquidationDetailSections } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidation-detail-sections/liquidation-detail-sections";
import type { TerminationDetailModalProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/termination-detail-modal/termination-detail-modal.types";
import {
  procesoBajaModalContentClassName,
  procesoBajaModalPanelClassName,
  procesoBajaSecondaryButtonClassName,
  procesoBajaSectionTitleClassName,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import {
  getTerminationStatusLabel,
  getTerminationTypeLabel,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.labels";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { Loader } from "@app/shared/components/loaders/loader";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDate } from "@app/shared/utils/string.utils";
import { BanIcon, CalendarIcon, MailIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";

const showDate = (value?: string | null) => (value ? formatDate(value) : "—");

const pickLinkedLiquidation = (rows: LiquidationDto[]) =>
  rows.find((row) => row.status !== "Cancelled") ?? rows[0] ?? null;

const UserFields = ({ user }: { user: TerminationUserDto }) => (
  <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2">
    <DetailField
      label="Nombre"
      value={user.full_name?.trim() || "—"}
      icon={<UserIcon size={18} />}
    />
    <DetailField
      label="Correo"
      value={user.email?.trim() || "—"}
      icon={<MailIcon size={18} />}
    />
  </div>
);

export const TerminationDetailModal = ({
  isOpen,
  terminationId,
  onClose,
}: TerminationDetailModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();

  const detailFilters = useMemo(
    () =>
      isOpen && terminationId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            termination_id: terminationId,
          }
        : undefined,
    [companyId, isOpen, moduleCode, terminationId],
  );

  const liquidationFilters = useMemo(
    () =>
      isOpen && terminationId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            termination_id: terminationId,
            page_number: 1,
            page_size: 5,
          }
        : undefined,
    [companyId, isOpen, moduleCode, terminationId],
  );

  const { GetTerminationDetails } = useTermination({
    terminationDetailFilters: detailFilters,
  });

  const { GetLiquidations } = useLiquidation({
    liquidationsFilters: liquidationFilters,
  });

  const linkedLiquidation = useMemo(
    () => pickLinkedLiquidation(GetLiquidations.data?.data ?? []),
    [GetLiquidations.data?.data],
  );

  const liquidationDetailFilters = useMemo(
    () =>
      isOpen && linkedLiquidation
        ? {
            company_id: companyId,
            module_code: moduleCode,
            liquidation_id: linkedLiquidation.liquidation_id,
          }
        : undefined,
    [companyId, isOpen, linkedLiquidation, moduleCode],
  );

  const { GetLiquidationDetails } = useLiquidation({
    liquidationDetailFilters,
  });

  const detail = GetTerminationDetails.data;
  const evidences = detail?.evidences ?? [];
  const detailError = GetTerminationDetails.error
    ? getMappedError(GetTerminationDetails.error).description ||
      "No se pudo cargar el detalle de la baja."
    : "";
  const liquidationLookupError = GetLiquidations.error
    ? getMappedError(GetLiquidations.error).description ||
      "No se pudo consultar la liquidación asociada."
    : "";
  const liquidationError = GetLiquidationDetails.error
    ? getMappedError(GetLiquidationDetails.error).description ||
      "No se pudo cargar el detalle de la liquidación."
    : "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="7xl"
      title="Detalle de baja"
      description="Consulta el expediente y, si existe, la liquidación asociada"
      panelClassName={procesoBajaModalPanelClassName}
      contentClassName={procesoBajaModalContentClassName}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
          {GetTerminationDetails.isLoading && (
            <Loader title="Cargando detalle de la baja..." />
          )}

          {detailError && (
            <Banner
              variant="error"
              title="Error al cargar el detalle"
              description={detailError}
            />
          )}

          {!GetTerminationDetails.isLoading && !detail && !detailError && (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No se encontró la información solicitada.
            </p>
          )}

          {detail && (
            <div className="flex flex-col gap-5 pb-2">
              <section className="flex flex-col gap-3">
                <h4 className={procesoBajaSectionTitleClassName}>Información general</h4>
                <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailField
                    label="Colaborador"
                    value={detail.collaborator_name?.trim() || "—"}
                    icon={<UserIcon size={18} />}
                  />
                  <DetailField
                    label="Cédula"
                    value={detail.identification_number?.trim() || "—"}
                  />
                  <DetailField
                    label="Tipo"
                    value={getTerminationTypeLabel(detail.termination_type)}
                  />
                  <DetailField
                    label="Estado"
                    value={getTerminationStatusLabel(detail.termination_status)}
                  />
                  <DetailField label="Motivo" value={detail.reason?.trim() || "—"} />
                  <DetailField
                    label="Fecha de preaviso"
                    value={showDate(detail.notice_date)}
                    icon={<CalendarIcon size={18} />}
                  />
                  <DetailField
                    label="Días de preaviso"
                    value={
                      detail.notice_days === null || detail.notice_days === undefined
                        ? "—"
                        : String(detail.notice_days)
                    }
                  />
                  <DetailField
                    label="Fecha de egreso"
                    value={showDate(detail.departure_date)}
                    icon={<CalendarIcon size={18} />}
                  />
                  <DetailField
                    label="Registrada"
                    value={showDate(detail.created_at)}
                    icon={<CalendarIcon size={18} />}
                  />
                  {detail.cancellation_reason?.trim() && (
                    <DetailField
                      label="Motivo de cancelación"
                      value={detail.cancellation_reason}
                    />
                  )}
                </div>
              </section>

              {detail.registered_by_user && (
                <section className="flex flex-col gap-3">
                  <h4 className={procesoBajaSectionTitleClassName}>Registro</h4>
                  <UserFields user={detail.registered_by_user} />
                </section>
              )}

              {(detail.closed_by_user || detail.closed_at) && (
                <section className="flex flex-col gap-3">
                  <h4 className={procesoBajaSectionTitleClassName}>Cierre</h4>
                  {detail.closed_by_user && <UserFields user={detail.closed_by_user} />}
                  {detail.closed_at && (
                    <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2">
                      <DetailField
                        label="Fecha de cierre"
                        value={showDate(detail.closed_at)}
                        icon={<CalendarIcon size={18} />}
                      />
                    </div>
                  )}
                </section>
              )}

              <section className="flex flex-col gap-3">
                <h4 className={procesoBajaSectionTitleClassName}>Evidencias</h4>
                {evidences.length > 0 ? (
                  <ImagePreviewGallery
                    images={evidences}
                    title=""
                    imageAlt="Evidencia de la baja"
                  />
                ) : (
                  <p className="m-0 p-1 text-sm text-slate-500 dark:text-slate-400">
                    Sin evidencias
                  </p>
                )}
              </section>

              {liquidationLookupError && (
                <Banner
                  variant="error"
                  title="Error al consultar la liquidación"
                  description={liquidationLookupError}
                />
              )}

              {linkedLiquidation && (
                <section className="flex flex-col gap-3">
                  <h4 className={procesoBajaSectionTitleClassName}>Liquidación</h4>
                  {GetLiquidationDetails.isLoading && (
                    <Loader title="Cargando detalle de la liquidación..." />
                  )}
                  {liquidationError && (
                    <Banner
                      variant="error"
                      title="Error al cargar la liquidación"
                      description={liquidationError}
                    />
                  )}
                  {GetLiquidationDetails.data && (
                    <LiquidationDetailSections detail={GetLiquidationDetails.data} />
                  )}
                </section>
              )}
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
