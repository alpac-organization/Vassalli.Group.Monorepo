import { useEffect, useMemo, useState } from "react";
import {
  Badges,
  Button,
  Dropdown,
  InputText,
  Modal,
  Tabs,
  type Option,
  type TabItem,
} from "@alpac/design-system";
import { X } from "lucide-react";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/field-missing";
import {
  baseInputClasses,
  fieldsGridClasses,
  mobileOnlyScrollClasses,
  sectionTitleClasses,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";
import type { MerchandiseDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/types/merchandise-detail-modal.types";
import {
  isDucaMerchandiseDocument,
  mapDucatToDisplay,
  mapMerchandiseDetailToDisplay,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/utils/map-merchandise-detail";
import { Loader } from "@app/shared/components/loaders/loader";

function ReadOnlyField({
  label,
  value,
  missingMessage,
}: {
  label: string;
  value: string;
  missingMessage: string;
}) {
  const missing = isValueMissing(value);

  return (
    <InputText
      label={label}
      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
      disabled
      editable={false}
      value={missing ? missingMessage : value}
      className={`${baseInputClasses} ${
        missing
          ? missingDataInInputClassName
          : "text-slate-800 dark:text-white!"
      }`}
    />
  );
}

export function MerchandiseDetailModal({
  isOpen,
  detail,
  isLoading = false,
  onClose,
}: MerchandiseDetailModalProps) {
  const [selectedDucatId, setSelectedDucatId] = useState("");

  const values = useMemo(
    () => (detail ? mapMerchandiseDetailToDisplay(detail) : null),
    [detail],
  );

  const showCustomsDeclaration = detail
    ? !isDucaMerchandiseDocument(detail)
    : false;

  const ducatOptions = useMemo<Option[]>(
    () =>
      (detail?.duca_registry?.ducats ?? []).map((ducat) => ({
        value: ducat.id,
        label: ducat.ducat_number,
      })),
    [detail?.duca_registry?.ducats],
  );

  const ducatsMissing = ducatOptions.length === 0;

  const selectedDucat = useMemo(() => {
    const ducats = detail?.duca_registry?.ducats ?? [];
    return ducats.find((ducat) => ducat.id === selectedDucatId) ?? null;
  }, [detail?.duca_registry?.ducats, selectedDucatId]);

  const selectedDucatValues = useMemo(
    () => (selectedDucat ? mapDucatToDisplay(selectedDucat) : null),
    [selectedDucat],
  );

  useEffect(() => {
    if (!isOpen) {
      setSelectedDucatId("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedDucatId && ducatOptions[0]?.value != null) {
      setSelectedDucatId(String(ducatOptions[0].value));
    }
  }, [ducatOptions, selectedDucatId]);

  const tabItems: TabItem<string>[] = values
    ? [
        {
          id: "resumen",
          label: "Resumen de ingreso",
          render: () => (
            <div className="min-w-0 pt-1 sm:pt-2">
              <div className={fieldsGridClasses}>
                <ReadOnlyField
                  label="Tipo de documento"
                  value={values.documentType}
                  missingMessage="Tipo de documento no registrado"
                />

                {!showCustomsDeclaration && (
                  <div className="min-w-0">
                    <Dropdown
                      appearance="dark"
                      label="DUCAs del registro"
                      optional
                      labelClassName="text-[13px]! sm:text-[14px]! font-medium! text-white! ml-0.5!"
                      placeholder={
                        ducatsMissing
                          ? "DUCAs no registradas"
                          : "Seleccione una DUCA"
                      }
                      options={ducatOptions}
                      value={
                        ducatsMissing ? undefined : selectedDucatId || undefined
                      }
                      onChange={(value) => setSelectedDucatId(String(value))}
                      className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                      valueClassName={
                        ducatsMissing
                          ? missingDataInInputClassName
                          : "text-white! dark:text-white!"
                      }
                    />
                  </div>
                )}

                <ReadOnlyField
                  label="País de origen"
                  value={values.countryOfOrigin}
                  missingMessage="País no registrado"
                />
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
                  label="Fecha final registro"
                  value={values.registrationEndDate}
                  missingMessage="Fecha final no registrada"
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

              {!showCustomsDeclaration && selectedDucatValues ? (
                <div className="min-w-0 border-t border-slate-200 dark:border-neutral-600 mt-6 sm:mt-8 pt-6 sm:pt-8">
                  <h4 className={sectionTitleClasses}>Detalle de DUCA</h4>
                  <div className={fieldsGridClasses}>
                    <ReadOnlyField
                      label="Número DUCA"
                      value={selectedDucatValues.ducatNumber}
                      missingMessage="DUCA no registrada"
                    />
                    <ReadOnlyField
                      label="Estado"
                      value={selectedDucatValues.status}
                      missingMessage="Estado no registrado"
                    />
                    <ReadOnlyField
                      label="Mercancía"
                      value={selectedDucatValues.merchandiseName}
                      missingMessage="Mercancía no registrada"
                    />
                    <ReadOnlyField
                      label="Total bultos"
                      value={selectedDucatValues.totalBultos}
                      missingMessage="Bultos no registrados"
                    />
                    <ReadOnlyField
                      label="Peso total"
                      value={selectedDucatValues.totalWeight}
                      missingMessage="Peso no registrado"
                    />
                    <ReadOnlyField
                      label="Descripción del producto"
                      value={selectedDucatValues.productDescription}
                      missingMessage="Descripción no registrada"
                    />
                    <ReadOnlyField
                      label="Remitente"
                      value={selectedDucatValues.remitente}
                      missingMessage="Remitente no registrado"
                    />
                    <ReadOnlyField
                      label="Observación área destino"
                      value={selectedDucatValues.destinationAreaObservation}
                      missingMessage="Observación no registrada"
                    />
                    <ReadOnlyField
                      label="Orden de servicio"
                      value={selectedDucatValues.serviceOrderCode}
                      missingMessage="Orden no registrada"
                    />
                    <ReadOnlyField
                      label="Registrado por"
                      value={selectedDucatValues.registeredByUserName}
                      missingMessage="Responsable no registrado"
                    />
                    <ReadOnlyField
                      label="Fecha inicio"
                      value={selectedDucatValues.registeredStartDate}
                      missingMessage="Fecha no registrada"
                    />
                    <ReadOnlyField
                      label="Hora inicio"
                      value={selectedDucatValues.registeredStartTime}
                      missingMessage="Hora no registrada"
                    />
                    <ReadOnlyField
                      label="Fecha fin"
                      value={selectedDucatValues.registeredEndDate}
                      missingMessage="Fecha no registrada"
                    />
                    <ReadOnlyField
                      label="Hora fin"
                      value={selectedDucatValues.registeredEndTime}
                      missingMessage="Hora no registrada"
                    />
                    <ReadOnlyField
                      label="Duración"
                      value={selectedDucatValues.durationFormatted}
                      missingMessage="Duración no registrada"
                    />
                  </div>

                  <div className="min-w-0 border-t border-slate-200 dark:border-neutral-600 mt-6 sm:mt-8 pt-6 sm:pt-8">
                    <h4 className={sectionTitleClasses}>Registro DUCA</h4>
                    <div className={fieldsGridClasses}>
                      <ReadOnlyField
                        label="Empresa"
                        value={values.ducaEmpresa}
                        missingMessage="Empresa no registrada"
                      />
                      <ReadOnlyField
                        label="Observaciones generales"
                        value={values.ducaObservations}
                        missingMessage="Observaciones no registradas"
                      />
                      <ReadOnlyField
                        label="En tránsito"
                        value={values.ducaIsInTransit}
                        missingMessage="No registrado"
                      />
                      <ReadOnlyField
                        label="Registrado por"
                        value={values.ducaRegisteredBy}
                        missingMessage="Responsable no registrado"
                      />
                      <ReadOnlyField
                        label="Duración registro"
                        value={values.ducaDuration}
                        missingMessage="Duración no registrada"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {showCustomsDeclaration ? (
                <div className="min-w-0 border-t border-slate-200 dark:border-neutral-600 mt-6 sm:mt-8 pt-6 sm:pt-8">
                  <h4 className={sectionTitleClasses}>Declaración aduanera</h4>
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
              ) : null}
            </div>
          ),
        },
        {
          id: "vehiculo",
          label: "Datos del vehículo y conductor",
          render: () => (
            <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
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
                label="Conductor"
                value={values.driverName}
                missingMessage="Conductor no registrado"
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
                label="Número de sello"
                value={values.sealNumber}
                missingMessage="Sello no registrado"
              />
              <ReadOnlyField
                label="Aduana"
                value={values.aduana}
                missingMessage="Aduana no registrada"
              />
              <ReadOnlyField
                label="Número de contenedor"
                value={values.containerNumber}
                missingMessage="Contenedor no registrado"
              />
            </div>
          ),
        },
        {
          id: "salida",
          label: "Actualización y salida",
          render: () => (
            <div className={`min-w-0 pt-1 sm:pt-2 ${fieldsGridClasses}`}>
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
              <ReadOnlyField
                label="Fecha de salida"
                value={values.transportUnitExitDate}
                missingMessage="No registrado"
              />
              <ReadOnlyField
                label="Hora de salida"
                value={values.transportUnitExitTime}
                missingMessage="No registrado"
              />
            </div>
          ),
        },
      ]
    : [];

  return (
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
                    activeTab="resumen"
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
  );
}
