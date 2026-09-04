import { Badges, Button, Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatDateToSpanishWords, formatTime } from "@app/shared/utils/string.utils";
import {
  Building2,
  Calendar,
  CalendarCheck,
  FileSpreadsheet,
  FileText,
  Truck,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import type {
  WarehouseAssignmentDetailResponse,
  CrewDetailDto,
  MachineryDetailDto,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-detail";
import type { SelectedAssignmentTarget } from "../../types/assignment.types";

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: WarehouseAssignmentDetailResponse | undefined;
  target?: SelectedAssignmentTarget | null;
  isLoading: boolean;
}

const sectionTitleClassName =
  "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

const badgeStyles = {
  internal:
    "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800",
  outsourced:
    "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800",
  duca:
    "bg-[#123C69]! text-[#D6ECFF]! border border-[#2F6FB2]!",
  customsDeclaration:
    "bg-[#234A2F]! text-[#D9FBE2]! border border-[#4FA56A]!",
  inProgress:
    "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800",
};

const formatDateTime = (dateTime?: string | null): string => {
  if (!dateTime) return "—";
  const datePart = dateTime.includes("T")
    ? dateTime.split("T")[0]
    : dateTime.split(" ")[0];
  const timePart = dateTime.includes("T")
    ? dateTime.split("T")[1]?.slice(0, 8)
    : dateTime.split(" ")[1]?.slice(0, 8);
  const formattedDate = datePart ? formatDateToSpanishWords(datePart) : "";
  const formattedTime = timePart ? formatTime(timePart) : "";
  if (formattedDate && formattedTime) return `${formattedDate}, ${formattedTime}`;
  return formattedDate || formattedTime || dateTime;
};

export function AssignmentDetailModal({
  isOpen,
  onClose,
  detail,
  target,
  isLoading,
}: AssignmentDetailModalProps) {
  const rawDetail = detail as
    | (WarehouseAssignmentDetailResponse & {
        data?: WarehouseAssignmentDetailResponse;
      })
    | undefined;
  const activeDetail = rawDetail?.data ?? rawDetail;

  const warehouseName =
    activeDetail?.warehouse_name || "—";
  const licensePlate =
    activeDetail?.license_plate || target?.license_plate || "—";
  const ducatNumber =
    activeDetail?.ducat_number || target?.ducat_number || null;
  const isDuca = Boolean(
    ducatNumber ||
      target?.document_type === "DUCA" ||
      target?.ducat_number,
  );
  const serviceOrderCode =
    activeDetail?.service_order_code || target?.service_order_code || null;
  const startTime =
    activeDetail?.unloading_start_time || null;
  const endTime =
    activeDetail?.unloading_end_time || null;
  const crews = activeDetail?.crews ?? [];
  const machineries = activeDetail?.machineries ?? [];
  const hasData = Boolean(activeDetail || target);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="5xl"
      title="Detalle de Asignación"
      description="Información detallada de la cuadrilla y maquinaria de descarga asignada"
      panelClassName={[
        "flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {isLoading && !hasData ? (
          <div className="px-3 py-12 text-center">
            <Loader title="Cargando detalle de la asignación..." />
          </div>
        ) : !hasData ? (
          <div className="px-3 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No se encontró información de la asignación.
          </div>
        ) : (
          <>
            <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
              <div className="flex flex-col gap-5 pb-2">
                {/* Sección 1: Información General */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Información general</h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Bodega"
                      value={warehouseName}
                      icon={<Building2 size={18} />}
                    />
                    <DetailField
                      label="Placa de Vehículo"
                      value={
                        licensePlate !== "—" ? (
                          <span className="font-semibold tracking-wider text-slate-800 dark:text-slate-100">
                            {licensePlate}
                          </span>
                        ) : (
                          "—"
                        )
                      }
                      icon={<Truck size={18} />}
                    />
                    <DetailField
                      label="No. Documento"
                      value={
                        <Badges
                          label={ducatNumber ? `DUCA: ${ducatNumber}` : "D. Aduanera"}
                          color="transparent"
                          className={`w-fit! min-w-[7.5rem]! justify-center! px-3! ${
                            isDuca ? badgeStyles.duca : badgeStyles.customsDeclaration
                          }`}
                        />
                      }
                      icon={<FileText size={18} />}
                    />
                    <DetailField
                      label="Orden de Servicio"
                      value={
                        serviceOrderCode ? (
                          <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {serviceOrderCode}
                          </span>
                        ) : (
                          "—"
                        )
                      }
                      icon={<FileSpreadsheet size={18} />}
                    />
                    <DetailField
                      label="Inicio de Descarga"
                      value={formatDateTime(startTime)}
                      icon={<Calendar size={18} />}
                    />
                    <DetailField
                      label="Fin de Descarga"
                      value={
                        endTime ? (
                          formatDateTime(endTime)
                        ) : (
                          <Badges
                            label="En proceso"
                            color="transparent"
                            className={`w-fit! px-2.5! ${badgeStyles.inProgress}`}
                          />
                        )
                      }
                      icon={<CalendarCheck size={18} />}
                    />
                  </div>
                </section>

                {/* Sección 2: Cuadrillas de Trabajo */}
                <section className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-500 dark:text-slate-400" />
                    <h4 className={sectionTitleClassName + " flex-1"}>
                      Cuadrillas de trabajo ({crews.length})
                    </h4>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
                    <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-12 dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="col-span-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Tipo de Cuadrilla
                      </div>
                      <div className="col-span-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Total Personas
                      </div>
                      <div className="col-span-4 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Personal / Colaboradores
                      </div>
                      <div className="col-span-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Proveedor / Factura
                      </div>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                      {crews.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                          No hay cuadrillas asignadas.
                        </div>
                      ) : (
                        crews.map((crew: CrewDetailDto, index: number) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 gap-3 px-3 py-3 sm:grid-cols-12 sm:items-center"
                          >
                            {/* Tipo */}
                            <div className="sm:col-span-3 flex items-center justify-between sm:justify-start">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Tipo:
                              </span>
                              <Badges
                                label={crew.is_outsourced ? "Tercerizada" : "Interna"}
                                color="transparent"
                                className={`w-fit! px-2.5! ${
                                  crew.is_outsourced
                                    ? badgeStyles.outsourced
                                    : badgeStyles.internal
                                }`}
                              />
                            </div>

                            {/* Total Personas */}
                            <div className="sm:col-span-2 flex items-center justify-between sm:justify-start">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Personas:
                              </span>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {crew.total_person_count}{" "}
                                {crew.total_person_count === 1 ? "persona" : "personas"}
                              </span>
                            </div>

                            {/* Colaboradores / Integrantes */}
                            <div className="sm:col-span-4 flex flex-col gap-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Colaboradores:
                              </span>
                              {!crew.is_outsourced ? (
                                crew.collaborator_names && crew.collaborator_names.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {crew.collaborator_names.map((name, i) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-neutral-700"
                                      >
                                        <User size={12} className="text-slate-400" />
                                        {name}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-sm text-slate-400 dark:text-slate-500">
                                    Sin nombres registrados
                                  </span>
                                )
                              ) : (
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  Personal externo contratado
                                </span>
                              )}
                            </div>

                            {/* Proveedor / Factura */}
                            <div className="sm:col-span-3 flex flex-col gap-0.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Proveedor:
                              </span>
                              {crew.is_outsourced ? (
                                <>
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {crew.provider_name || "Sin proveedor"}
                                  </span>
                                  {crew.invoice_number && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      Factura: {crew.invoice_number}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>

                {/* Sección 3: Maquinaria Utilizada */}
                <section className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-slate-500 dark:text-slate-400" />
                    <h4 className={sectionTitleClassName + " flex-1"}>
                      Maquinaria Utilizada ({machineries.length})
                    </h4>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
                    <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-12 dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="col-span-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Maquinaria
                      </div>
                      <div className="col-span-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Tipo
                      </div>
                      <div className="col-span-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Operador
                      </div>
                      <div className="col-span-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Horario
                      </div>
                      <div className="col-span-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Proveedor / Factura
                      </div>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                      {machineries.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                          No hay maquinaria asignada.
                        </div>
                      ) : (
                        machineries.map((machinery: MachineryDetailDto, index: number) => (
                          <div
                            key={machinery.machinery_assignment_id || index}
                            className="grid grid-cols-1 gap-3 px-3 py-3 sm:grid-cols-12 sm:items-center"
                          >
                            {/* Maquinaria */}
                            <div className="sm:col-span-3 flex flex-col gap-0.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Maquinaria:
                              </span>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {machinery.machinery_name ||
                                  machinery.machinery_description ||
                                  "Maquinaria"}
                              </span>
                              {machinery.machinery_code && (
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  Cód: {machinery.machinery_code}
                                </span>
                              )}
                            </div>

                            {/* Tipo */}
                            <div className="sm:col-span-2 flex items-center justify-between sm:justify-start">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Tipo:
                              </span>
                              <Badges
                                label={machinery.is_outsourced ? "Alquilada" : "Propia"}
                                color="transparent"
                                className={`w-fit! px-2.5! ${
                                  machinery.is_outsourced
                                    ? badgeStyles.outsourced
                                    : badgeStyles.internal
                                }`}
                              />
                            </div>

                            {/* Operador */}
                            <div className="sm:col-span-3 flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Operador:
                              </span>
                              <User size={14} className="text-slate-400 shrink-0" />
                              <span>{machinery.operator_name || "Sin operador"}</span>
                            </div>

                            {/* Horario */}
                            <div className="sm:col-span-2 flex flex-col gap-0.5 text-xs text-slate-600 dark:text-slate-300">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Horario:
                              </span>
                              <div>
                                <span className="text-slate-400">Inicio: </span>
                                {machinery.start_time
                                  ? formatDateTime(machinery.start_time)
                                  : "—"}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Fin: </span>
                                {machinery.end_time ? (
                                  formatDateTime(machinery.end_time)
                                ) : (
                                  <Badges
                                    label="En proceso"
                                    color="transparent"
                                    className={`w-fit! px-2! text-xs! ${badgeStyles.inProgress}`}
                                  />
                                )}
                              </div>
                            </div>

                            {/* Proveedor / Factura / Detalle */}
                            <div className="sm:col-span-2 flex flex-col gap-0.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:hidden">
                                Proveedor / Factura:
                              </span>
                              {machinery.is_outsourced ? (
                                <>
                                  {machinery.provider_name && (
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                      {machinery.provider_name}
                                    </span>
                                  )}
                                  {machinery.invoice_number && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      Factura: {machinery.invoice_number}
                                    </span>
                                  )}
                                  {machinery.machinery_description && (
                                    <span className="text-xs text-slate-400">
                                      {machinery.machinery_description}
                                    </span>
                                  )}
                                  {!machinery.provider_name &&
                                    !machinery.invoice_number &&
                                    !machinery.machinery_description && (
                                      <span className="text-sm text-slate-400 dark:text-slate-500">
                                        —
                                      </span>
                                    )}
                                </>
                              ) : (
                                <span className="text-sm text-slate-400 dark:text-slate-500">
                                  —
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer con botón Cerrar */}
            <div className="-mx-4 -mb-4 mt-4 shrink-0 border-t border-t-slate-200 bg-white px-4 py-3 dark:border-t-neutral-700 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl flex justify-end">
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
          </>
        )}
      </div>
    </Modal>
  );
}
