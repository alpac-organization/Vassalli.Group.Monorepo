import { useEffect, useMemo, useState } from "react";
import {
  Badges,
  Button,
  Dropdown,
  Modal,
  Tabs,
  type Option,
  type TabItem,
} from "@alpac/design-system";
import { Eye, X } from "lucide-react";
import dayjs from "dayjs";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { missingDataInInputClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/field-missing";
import {
  baseInputClasses,
  fieldsGridClasses,
  mobileOnlyScrollClasses,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import type { MerchandiseDucatDetailDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";
import type { MerchandiseDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/types/merchandise-detail-modal.types";
import { DucatDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/ducat-detail-modal/ducat-detail-modal";
import { ObservationDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/observation-detail-modal/observation-detail-modal";
import { ReadOnlyField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/read-only-field/read-only-field";
import { RegisterDucatGeneralForm } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-ducat-general-form/register-ducat-general-form";
import { AssignServiceOrderForm } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/assign-service-order-form/assign-service-order-form";
import {
  isDucaMerchandiseDocument,
  mapMerchandiseDetailToDisplay,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/utils/map-merchandise-detail";
import { Loader } from "@app/shared/components/loaders/loader";
import { getDucaStatusBadgeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/ducat-detail-modal/utils/duca-status";

export function MerchandiseDetailModal({
  isOpen,
  detail,
  isLoading = false,
  company_id,
  module_code,
  onClose,
}: MerchandiseDetailModalProps) {
  const [selectedDucatId, setSelectedDucatId] = useState("");
  const [viewingDucat, setViewingDucat] =
    useState<MerchandiseDucatDetailDto | null>(null);
  const [isViewingObservation, setIsViewingObservation] = useState(false);

  const values = useMemo(
    () => (detail ? mapMerchandiseDetailToDisplay(detail) : null),
    [detail],
  );

  const isDucaDocument = detail ? isDucaMerchandiseDocument(detail) : false;
  const showCustomsDeclaration = detail ? !isDucaDocument : false;

  const merchandiseStart = useMemo(() => {
    const registration = detail?.merchandise_registration;
    const dateStr = registration?.merchandise_registration_date;
    const timeStr = registration?.merchandise_registration_time;
    if (dateStr) {
      const date = dayjs(dateStr);
      if (timeStr) {
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return date
          .hour(hours ?? 0)
          .minute(minutes ?? 0)
          .second(seconds ?? 0);
      }
      return date;
    }
    return dayjs();
  }, [detail]);

  const ducats = detail?.duca_registry?.ducats;

  const ducatOptions = useMemo<Option[]>(
    () =>
      (ducats ?? []).map((ducat) => ({
        value: ducat.id,
        label: `${ducat.ducat_number} (${getDucaStatusBadgeLabel(ducat.status ?? "")})`,
      })),
    [ducats],
  );

  const ducatsMissing = ducatOptions.length === 0;

  useEffect(() => {
    if (!isOpen) {
      setSelectedDucatId("");
      setViewingDucat(null);
      setIsViewingObservation(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedDucatId && ducatOptions[0]?.value != null) {
      setSelectedDucatId(String(ducatOptions[0].value));
    }
  }, [ducatOptions, selectedDucatId]);

  const handleViewDucat = (option: Option) => {
    const ducat =
      ducats?.find((item) => item.id === String(option.value)) ?? null;
    setViewingDucat(ducat);
  };

  const viewingDucatId = viewingDucat?.id ?? null;
  const freshViewingDucat = useMemo(
    () =>
      viewingDucatId
        ? (ducats?.find((item) => item.id === viewingDucatId) ?? viewingDucat)
        : null,
    [ducats, viewingDucatId, viewingDucat],
  );

  const tabItems: TabItem<string>[] = values
    ? [
        {
          id: "recepcion",
          label: "Recepción",
          render: () => (
            <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
              <ReadOnlyField
                label="Tipo de documento"
                value={values.documentType}
                missingMessage="Tipo de documento no registrado"
              />
              <ReadOnlyField
                label="País de origen"
                value={values.countryOfOrigin}
                missingMessage="País no registrado"
              />
              <ReadOnlyField
                label="Aduana"
                value={values.aduana}
                missingMessage="Aduana no registrada"
              />
              <ReadOnlyField
                label="Numero de Placa"
                value={values.plateNumber}
                missingMessage="Placa no registrada"
              />
              <ReadOnlyField
                label="Chasis del remolque"
                value={values.trailerChassis}
                missingMessage="Chasis no registrado"
              />
              <ReadOnlyField
                label="Licencia"
                value={values.driverLicense}
                missingMessage="Licencia no registrada"
              />
              <ReadOnlyField
                label="Transportista"
                value={values.transportista}
                missingMessage="Transportista no registrado"
              />
              <ReadOnlyField
                label="Unidad de transporte"
                value={values.transportUnitName}
                missingMessage="Unidad no registrada"
              />
              <ReadOnlyField
                label="Conductor"
                value={values.driverName}
                missingMessage="Conductor no registrado"
              />
              <ReadOnlyField
                label="Número de sello"
                value={values.sealNumber}
                missingMessage="Sello no registrado"
              />
              <ReadOnlyField
                label="Número de contenedor"
                value={values.containerNumber}
                missingMessage="Contenedor no registrado"
              />
              <ReadOnlyField
                label="Fecha de salida del vehículo"
                value={values.vehicleExitDate}
                missingMessage="No registrado"
              />
              <ReadOnlyField
                label="Hora de salida del vehículo"
                value={values.vehicleExitTime}
                missingMessage="No registrado"
              />
              <ReadOnlyField
                label="Fecha de salida del contenedor"
                value={values.containerExitDate}
                missingMessage="No registrado"
              />
              <ReadOnlyField
                label="Hora de salida del contenedor"
                value={values.containerExitTime}
                missingMessage="No registrado"
              />
            </div>
          ),
        },
        {
          id: "registro",
          label: "Registro de mercancía",
          render: () => (
            <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
              <ReadOnlyField
                label="Fecha de registro"
                value={values.registrationDate}
                missingMessage="Fecha no registrada"
              />
              <ReadOnlyField
                label="Hora inicial registro"
                value={values.registrationTime}
                missingMessage="Hora inicial no registrada"
              />
              <ReadOnlyField
                label="Hora final registro"
                value={values.registrationEndTime}
                missingMessage="Hora final no registrada"
              />
              <ReadOnlyField
                label="Duración"
                value={values.durationFormatted}
                missingMessage="Duración no registrada"
              />
              <ReadOnlyField
                label="Registrado por"
                value={values.registeredByUserName}
                missingMessage="Responsable no registrado"
              />
              <ReadOnlyField
                label="Finalizado por"
                value={values.finishedByUserName}
                missingMessage="Responsable no registrado"
              />
            </div>
          ),
        },
        ...(isDucaDocument
          ? [
              {
                id: "duca",
                label: "Registro DUCA",
                render: () =>
                  detail && !detail.duca_registry ? (
                    <div className="min-w-0 pt-1 sm:pt-2">
                      <RegisterDucatGeneralForm
                        reception_id={detail.id}
                        company_id={company_id}
                        module_code={module_code}
                        defaultContainerNumber={
                          detail.reception?.container_number ?? ""
                        }
                        initialStartDate={merchandiseStart}
                        initialStartTime={merchandiseStart}
                      />
                    </div>
                  ) : (
                  <div className="min-w-0 pt-1 sm:pt-2">
                    <div className={fieldsGridClasses}>
                      <div className="min-w-0">
                        <Dropdown
                          appearance="dark"
                          label="DUCAs del registro"
                          labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                          placeholder={
                            ducatsMissing
                              ? "DUCAs no registradas"
                              : "Seleccione una DUCA"
                          }
                          options={ducatOptions}
                          value={
                            ducatsMissing
                              ? undefined
                              : selectedDucatId || undefined
                          }
                          onChange={(value) =>
                            setSelectedDucatId(String(value))
                          }
                          renderOptionAction={(option) => (
                            <button
                              type="button"
                              title="Ver detalle"
                              aria-label={`Ver detalle de ${option.label}`}
                              onClick={() => handleViewDucat(option)}
                              className="h-7 w-7 flex items-center ml-auto! justify-center rounded-md border transition-colors border-slate-500/40 text-slate-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                          valueClassName={
                            ducatsMissing
                              ? missingDataInInputClassName
                              : "text-white! dark:text-white!"
                          }
                        />
                      </div>
                      <ReadOnlyField
                        label="Empresa"
                        value={values.ducaEmpresa}
                        missingMessage="Empresa no registrada"
                      />
                      <div className="min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <ReadOnlyField
                              label="Observaciones generales"
                              value={values.ducaObservations}
                              missingMessage="Observaciones no registradas"
                            />
                          </div>
                          <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
                            <Button
                              type="button"
                              ariaLabel="Ver observaciones generales"
                              onClick={() => setIsViewingObservation(true)}
                              icon={<Eye size={16} />}
                              className="h-[42px]! w-[42px]! sm:h-[46px]! sm:w-[46px]! min-w-0! shrink-0! p-0! md:p-0! rounded-lg! shadow-none! border! border-slate-200! dark:border-slate-700/50! bg-white! dark:bg-[#1e2229]! text-slate-500! dark:text-slate-400! hover:text-blue-600! dark:hover:text-white! hover:border-cyan-300! dark:hover:border-blue-600! hover:bg-cyan-50! dark:hover:bg-cyan-500/10! transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                      <ReadOnlyField
                        label="Registrado por"
                        value={values.ducaRegisteredBy}
                        missingMessage="Responsable no registrado"
                      />
                      <ReadOnlyField
                        label="Fecha inicio"
                        value={values.ducaRegisteredStartDate}
                        missingMessage="Fecha no registrada"
                      />
                      <ReadOnlyField
                        label="Hora inicio"
                        value={values.ducaRegisteredStartTime}
                        missingMessage="Hora no registrada"
                      />
                      <ReadOnlyField
                        label="Hora fin"
                        value={values.ducaRegisteredEndTime}
                        missingMessage="Hora no registrada"
                      />
                      <ReadOnlyField
                        label="Duración registro"
                        value={values.ducaDuration}
                        missingMessage="Duración no registrada"
                      />
                      <ReadOnlyField
                        label="Actualizado por"
                        value={values.ducaUpdatedBy}
                        missingMessage="No registrado"
                      />
                      <ReadOnlyField
                        label="Fecha de actualización"
                        value={values.ducaUpdatedDate}
                        missingMessage="No registrado"
                      />
                      <ReadOnlyField
                        label="Hora de actualización"
                        value={values.ducaUpdatedTime}
                        missingMessage="No registrado"
                      />
                    </div>
                  </div>
                  ),
              } satisfies TabItem<string>,
            ]
          : []),
        ...(showCustomsDeclaration
          ? [
              {
                id: "declaracion",
                label: "Declaración aduanera",
                render: () => (
                  <div className="min-w-0 pt-1 sm:pt-2 flex flex-col gap-4">
                    {detail && !detail.customs_declaration?.service_order_id && (
                      <div className="p-4 rounded-xl border border-amber-200! dark:border-amber-500/30! bg-amber-50! dark:bg-amber-500/10!">
                        <AssignServiceOrderForm
                          reception_id={detail.id}
                          company_id={company_id}
                          module_code={module_code}
                          customsDeclarationNumber={
                            values.customsDeclarationNumber
                          }
                        />
                      </div>
                    )}
                    <div className={fieldsGridClasses}>
                      <ReadOnlyField
                        label="Número de declaración"
                        value={values.customsDeclarationNumber}
                        missingMessage="Declaración no registrada"
                      />
                      <ReadOnlyField
                        label="Paquetes"
                        value={values.packages}
                        missingMessage="Bultos no registrados"
                      />
                      <ReadOnlyField
                        label="Cliente"
                        value={values.customer}
                        missingMessage="Cliente no registrado"
                      />
                      <ReadOnlyField
                        label="Producto"
                        value={values.product}
                        missingMessage="Producto no registrado"
                      />
                      <ReadOnlyField
                        label="Número de contenedor"
                        value={values.containerNumber}
                        missingMessage="Contenedor no registrado"
                      />
                      <ReadOnlyField
                        label="Orden de servicio"
                        value={values.serviceOrderCode}
                        missingMessage="Orden no registrada"
                      />
                    </div>
                  </div>
                ),
              } satisfies TabItem<string>,
            ]
          : []),
      ]
    : [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalle de mercancía"
        variant="info"
        size="5xl"
        panelClassName="max-md:max-h-[min(92dvh,56rem)]! md:max-h-none! flex! flex-col! max-md:overflow-hidden! md:overflow-visible! p-4! sm:p-6!"
      >
        {isLoading || !detail || !values ? (
          <div className="min-h-40 flex items-center justify-center py-8">
            <Loader title="Cargando detalle..." />
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 gap-4 max-md:overflow-hidden md:overflow-visible">
            <div className={`flex-1 min-h-0 ${mobileOnlyScrollClasses}`}>
              <div className="w-full max-w-full">
                <section className="w-full dark:bg-[#272b34] bg-white border border-slate-200 dark:border-neutral-700 shadow-sm rounded-xl">
                  <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
                    <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:justify-end">
                      <Badges
                        label={getStatusBadgeLabel(detail.status)}
                        color="transparent"
                        className={getStatusBadgeClass(detail.status)}
                      />
                    </div>

                    <Tabs
                      key={detail.id}
                      activeTab="recepcion"
                      tabItems={tabItems}
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="shrink-0 flex justify-end pt-3 border-t border-slate-200 dark:border-neutral-600">
              <Button
                type="button"
                size="medium"
                label="Cerrar"
                icon={<X size={16} />}
                ariaLabel="Cerrar detalle"
                onClick={onClose}
                className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
              />
            </div>
          </div>
        )}
      </Modal>

      <DucatDetailModal
        isOpen={Boolean(viewingDucat)}
        ducat={freshViewingDucat}
        receptionId={detail?.id ?? ""}
        companyId={company_id}
        moduleCode={module_code}
        initialStartDate={merchandiseStart}
        initialStartTime={merchandiseStart}
        onClose={() => setViewingDucat(null)}
      />

      <ObservationDetailModal
        isOpen={isViewingObservation}
        observation={values?.ducaObservations ?? ""}
        onClose={() => setIsViewingObservation(false)}
      />
    </>
  );
}
