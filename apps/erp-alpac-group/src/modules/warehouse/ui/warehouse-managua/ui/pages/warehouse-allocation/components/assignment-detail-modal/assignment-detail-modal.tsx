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
import { MachineryTypeEnum } from "@app/modules/warehouse/domain/enums/machinery-type.enum";
import { WarehouseTypeEnum } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { formatDateToSpanishWords, formatTime } from "@app/shared/utils/string.utils";
import { Loader } from "@app/shared/components/loaders/loader";
import type { AssignmentDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignment-detail-modal/types/assignment-detail-modal.types";

const inputClassName =
  "rounded-md! border-slate-300! dark:border-slate-600! bg-white! dark:bg-slate-800!";
const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

function resolveWarehouseTypeLabel(value: number): string {
  const option = Object.values(WarehouseTypeEnum).find((o) => o.value === value);
  return option?.label ?? "—";
}

function resolveMachineryTypeLabel(value: number): string {
  const option = Object.values(MachineryTypeEnum).find((o) => o.value === value);
  return option?.label ?? "—";
}

function formatTimestamp(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${formatDateToSpanishWords(date.toISOString().slice(0, 10))} - ${formatTime(date.toISOString())}`;
}

export function AssignmentDetailModal({
  isOpen,
  detail,
  companyId,
  moduleCode,
  machineries,
  staffs,
  isDetailLoading = false,
  isCreating = false,
  isCompleting = false,
  onCreateUnloadingCrew,
  onCreateUnloadingMachinery,
  onCompleteAssignment,
  onClose,
}: AssignmentDetailModalProps) {
  const [personaCount, setPersonaCount] = useState("");
  const [tercerizada, setTercerizada] = useState(false);
  const [machineryId, setMachineryId] = useState("");
  const [machineryStartTime, setMachineryStartTime] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPersonaCount("");
      setTercerizada(false);
      setMachineryId("");
      setMachineryStartTime("");
    }
  }, [isOpen]);

  const machineryOptions = useMemo<Option[]>(
    () =>
      machineries
        .filter((m) => m.is_active)
        .map((m) => ({
          value: m.id,
          label: `${m.code} — ${m.name} (${resolveMachineryTypeLabel(m.machinery_type)})`,
        })),
    [machineries],
  );

  const tabItems = useMemo<TabItem<string>[]>(() => {
    if (!detail) return [];
    const warehouseChief =
      detail.unloading_details?.warehouse_chief_user_id
        ? staffs.find((s) => s.id === detail.unloading_details?.warehouse_chief_user_id)
        : undefined;
    return [
      {
        id: "ubicacion",
        label: "Ubicación",
        render: () => (
          <div className="flex flex-col gap-2 text-[13px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <span><strong>Bodega:</strong> {detail.assignment?.warehouse_name ?? "—"}</span>
              <span><strong>Sección:</strong> {detail.assignment?.section_code ?? "—"}</span>
              <span><strong>Rack:</strong> {detail.assignment?.rack_code ?? "—"}</span>
              <span><strong>Lote:</strong> {detail.assignment?.lots_id ? "Seleccionado" : "—"}</span>
            </div>
            <span><strong>Asignado el:</strong> {formatTimestamp(detail.assignment?.assigned_at ?? null)}</span>
          </div>
        ),
      },
      {
        id: "descarga",
        label: "Descarga",
        render: () => (
          <div className="flex flex-col gap-2 text-[13px]">
            <span><strong>Inicio:</strong> {formatTimestamp(detail.unloading_details?.unloading_start_time ?? null)}</span>
            <span><strong>Fin:</strong> {formatTimestamp(detail.unloading_details?.unloading_end_time ?? null)}</span>
            <span><strong>Jefe de bodega:</strong> {warehouseChief?.full_name ?? "—"}</span>
            <span><strong>Pallets preparados:</strong> {detail.unloading_details?.prepared_pallets ?? "—"}</span>
          </div>
        ),
      },
      {
        id: "cuadrilla",
        label: "Cuadrilla",
        render: () => detail.crew ? (
          <div className="flex flex-col gap-2 text-[13px]">
            <span><strong>Personas:</strong> {detail.crew.persona_count}</span>
            <span><strong>Tercerizada:</strong> {detail.crew.tercerizada ? "Sí" : "No"}</span>
            <span><strong>Asignada el:</strong> {formatTimestamp(detail.crew.assigned_at)}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="m-0! text-[13px] text-slate-500 dark:text-slate-300">
              No hay cuadrilla registrada. Regístrala a continuación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputText
                label="Cantidad de personas"
                className={inputClassName}
                labelClassName={labelClassName}
                type="number"
                placeholder="Ej. 4"
                errorVariant="tooltip"
                value={personaCount}
                onChange={(e) => setPersonaCount(e.target.value)}
              />
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tercerizada}
                    onChange={(e) => setTercerizada(e.target.checked)}
                    className="w-4! h-4!"
                  />
                  Cuadrilla tercerizada
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                size="giant"
                className="rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                label={isCreating ? "Guardando..." : "Guardar cuadrilla"}
                disabled={
                  isCreating ||
                  !personaCount.trim() ||
                  Number(personaCount) <= 0
                }
                onClick={() =>
                  onCreateUnloadingCrew({
                    company_id: companyId,
                    module_code: moduleCode,
                    reception_id: detail.reception.id,
                    persona_count: Number(personaCount),
                    tercerizada,
                  })
                }
              />
            </div>
          </div>
        ),
      },
      {
        id: "maquinaria",
        label: "Maquinaria",
        render: () => (
          <div className="flex flex-col gap-3">
            {detail.machinery.length > 0 && (
              <div className="flex flex-col gap-1 text-[13px]">
                {detail.machinery.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md! border! border-slate-200! dark:border-slate-700! p-2"
                  >
                    <span>
                      {m.machinery_name} ({m.machinery_code}) —{" "}
                      {resolveMachineryTypeLabel(m.machinery_type)}
                    </span>
                    <span className="text-[12px] text-slate-500 dark:text-slate-300">
                      Inicio: {formatTimestamp(m.start_time)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Dropdown
                appearance="dark"
                label="Maquinaria"
                placeholder="Seleccionar maquinaria"
                options={machineryOptions}
                value={machineryId || undefined}
                onChange={(value) => setMachineryId(String(value ?? ""))}
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]!`}
              />
              <div className="flex flex-col min-w-0">
                <label className={labelClassName}>Hora de inicio</label>
                <input
                  type="datetime-local"
                  className={`${inputClassName} h-[42px]! px-3! text-sm!`}
                  value={machineryStartTime}
                  onChange={(e) => setMachineryStartTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                size="giant"
                className="rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                label={isCreating ? "Guardando..." : "Agregar maquinaria"}
                disabled={!machineryId || !machineryStartTime || isCreating}
                onClick={() =>
                  onCreateUnloadingMachinery({
                    company_id: companyId,
                    module_code: moduleCode,
                    reception_id: detail.reception.id,
                    machinery_code: machineryId,
                    start_time: new Date(machineryStartTime).toISOString(),
                  })
                }
              />
            </div>
          </div>
        ),
      },
    ];
  }, [
    detail,
    staffs,
    machineries,
    personaCount,
    tercerizada,
    machineryId,
    machineryStartTime,
    companyId,
    moduleCode,
    isCreating,
    onCreateUnloadingCrew,
    onCreateUnloadingMachinery,
  ]);

  if (!detail) {
    return (
      <Modal title="Detalle de asignación" isOpen={isOpen} onClose={onClose} size="lg">
        {isDetailLoading ? (
          <Loader title="Cargando detalle..." />
        ) : (
          <p className="m-0! text-center text-slate-500 dark:text-slate-300">
            No se encontró información.
          </p>
        )}
      </Modal>
    );
  }

  const reception = detail.reception;
  const isCompleted = Boolean(detail.unloading_details?.unloading_end_time);

  return (
    <Modal
      title={`Asignación — ${reception.plate_number || "Sin placa"}`}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="flex flex-col gap-4 min-w-0">
        <div className="flex flex-col gap-2 rounded-md! border! border-slate-200! dark:border-slate-700! bg-slate-50! dark:bg-slate-900! p-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
            <span><strong>Placa:</strong> {reception.plate_number || "—"}</span>
            <span><strong>Conductor:</strong> {reception.driver_name || "—"}</span>
            <span>
              <strong>Documento:</strong>{" "}
              {resolveDocumentTypeLabel(reception.document_type) ?? "—"}{" "}
              {reception.document_number ? `(${reception.document_number})` : ""}
            </span>
            <span><strong>Contenedor:</strong> {reception.container_number || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            {detail.assignment && (
              <Badges
                label={resolveWarehouseTypeLabel(detail.assignment.warehouse_type)}
                color="transparent"
                className="bg-alpac-primary-50! text-alpac-primary-700! dark:bg-alpac-primary-900! dark:text-alpac-primary-200!"
              />
            )}
            <Badges
              label={isCompleted ? "Completada" : "En proceso"}
              color={isCompleted ? "success" : "warning"}
            />
          </div>
        </div>

        <Tabs key={reception.id} activeTab="ubicacion" tabItems={tabItems} />

        <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-neutral-600">
          {!isCompleted && (
            <Button
              type="button"
              size="medium"
              label={isCompleting ? "Finalizando..." : "Completar asignación"}
              ariaLabel="Completar asignación"
              onClick={() =>
                onCompleteAssignment({
                  company_id: companyId,
                  module_code: moduleCode,
                  reception_id: reception.id,
                })
              }
              disabled={isCompleting}
              className="w-full! sm:w-auto! text-[13px]! text-white! bg-alpac-success-500! dark:bg-alpac-success-700!"
            />
          )}
        </div>
      </div>
    </Modal>
  );
}