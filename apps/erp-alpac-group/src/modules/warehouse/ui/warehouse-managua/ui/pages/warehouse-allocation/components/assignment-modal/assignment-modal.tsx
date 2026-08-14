import { useEffect, useMemo, useState } from "react";
import {
  Badges,
  Button,
  Dropdown,
  InputText,
  Modal,
  type Option,
} from "@alpac/design-system";
import { WarehouseTypeEnum } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import { SectionStorageTypeEnum } from "@app/modules/warehouse/domain/enums/section-storage-type.enum";
import { MachineryTypeEnum } from "@app/modules/warehouse/domain/enums/machinery-type.enum";
import { DocumentEnum } from "@app/core/enums/document.enum";
import type { AvailableSection } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-available-warehouses";
import type { AssignmentModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignment-modal/types/assignment-modal.types";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";

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

function isDucaDocument(documentType: unknown): boolean {
  const value =
    typeof documentType === "object" && documentType !== null
      ? (documentType as { value?: unknown }).value
      : documentType;
  return value === DocumentEnum.DUCA.value;
}

export function AssignmentModal({
  isOpen,
  item,
  companyId,
  moduleCode,
  step,
  warehouses,
  machineries,
  staffs,
  isLoadingWarehouses = false,
  isCreating = false,
  isCompleting = false,
  onStepChange,
  onRequestPositions,
  onCreateAssignment,
  onCreateUnloadingDetails,
  onCreateUnloadingCrew,
  onCreateUnloadingMachinery,
  onCompleteAssignment,
  onClose,
}: AssignmentModalProps) {
  const [warehouseId, setWarehouseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [rackId, setRackId] = useState("");
  const [lotId, setLotId] = useState("");
  const [rackPositionId, setRackPositionId] = useState("");
  const [lotPositionId, setLotPositionId] = useState("");
  const [unloadingStartTime, setUnloadingStartTime] = useState("");
  const [warehouseChiefUserId, setWarehouseChiefUserId] = useState("");
  const [preparedPallets, setPreparedPallets] = useState("");
  const [personaCount, setPersonaCount] = useState("");
  const [tercerizada, setTercerizada] = useState(false);
  const [machineryId, setMachineryId] = useState("");
  const [machineryStartTime, setMachineryStartTime] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setWarehouseId("");
      setSectionId("");
      setRackId("");
      setLotId("");
      setRackPositionId("");
      setLotPositionId("");
      setUnloadingStartTime("");
      setWarehouseChiefUserId("");
      setPreparedPallets("");
      setPersonaCount("");
      setTercerizada(false);
      setMachineryId("");
      setMachineryStartTime("");
    }
  }, [isOpen]);

  const selectedWarehouse = useMemo(
    () => warehouses.find((w) => w.id === warehouseId),
    [warehouses, warehouseId],
  );

  const selectedSection = useMemo<AvailableSection | null>(
    () =>
      selectedWarehouse?.sections.find((s) => s.id === sectionId) ?? null,
    [selectedWarehouse, sectionId],
  );

  const warehouseOptions = useMemo<Option[]>(
    () =>
      warehouses.map((w) => ({
        value: w.id,
        label: `${w.name} (${w.code})`,
      })),
    [warehouses],
  );

  const sectionOptions = useMemo<Option[]>(
    () =>
      (selectedWarehouse?.sections ?? []).map((s) => ({
        value: s.id,
        label: `${s.code} — ${Object.values(SectionStorageTypeEnum).find((o) => o.value === s.storage_type)?.label ?? "—"}`,
      })),
    [selectedWarehouse],
  );

  const rackOptions = useMemo<Option[]>(
    () =>
      (selectedSection?.racks ?? []).map((r) => ({
        value: r.id,
        label: r.code,
      })),
    [selectedSection],
  );

  const lotOptions = useMemo<Option[]>(
    () =>
      (selectedSection?.lots ?? []).map((l) => ({
        value: l.id,
        label: l.code,
      })),
    [selectedSection],
  );

  const rackPositionOptions = useMemo<Option[]>(
    () =>
      (selectedSection?.racks.find((r) => r.id === rackId)?.positions ?? []).map(
        (p) => ({ value: p.id, label: p.position_code }),
      ),
    [selectedSection, rackId],
  );

  const lotPositionOptions = useMemo<Option[]>(
    () =>
      (selectedSection?.lots.find((l) => l.id === lotId)?.positions ?? []).map(
        (p) => ({ value: p.id, label: p.position_code }),
      ),
    [selectedSection, lotId],
  );

  const staffOptions = useMemo<Option[]>(
    () =>
      staffs
        .filter((s) => s.is_active)
        .map((s) => ({
          value: s.id,
          label: s.full_name,
        })),
    [staffs],
  );

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

  if (!item) return null;

  const isLotsSection = selectedSection?.storage_type === SectionStorageTypeEnum.Lots.value;
  const canSaveAssignment =
    Boolean(warehouseId) && Boolean(sectionId) && Boolean(rackId);
  const canSaveUnloadingDetails =
    Boolean(unloadingStartTime) && Boolean(warehouseChiefUserId);
  const canSaveCrew = Boolean(personaCount) && Number(personaCount) > 0;
  const canSaveMachinery = Boolean(machineryId) && Boolean(machineryStartTime);

  const handleSaveAssignment = () => {
    onCreateAssignment({
      company_id: companyId,
      module_code: moduleCode,
      reception_id: item.id,
      warehouse_id: warehouseId,
      section_id: sectionId || undefined,
      rack_id: rackId,
      lots_id: lotId || undefined,
      lots_positions_id: lotPositionId || undefined,
      rack_positions_id: rackPositionId || undefined,
    });
  };

  const handleSelectWarehouse = (value: string) => {
    setWarehouseId(value);
    setSectionId("");
    setRackId("");
    setLotId("");
    setRackPositionId("");
    setLotPositionId("");
  };

  const handleSelectSection = (value: string) => {
    setSectionId(value);
    setRackId("");
    setLotId("");
    setRackPositionId("");
    setLotPositionId("");
    const section = selectedWarehouse?.sections.find((s) => s.id === value);
    if (section?.storage_type === SectionStorageTypeEnum.Racks.value) {
      const firstRack = section.racks[0];
      if (firstRack) {
        setRackId(firstRack.id);
        onRequestPositions({ rack_id: firstRack.id });
      }
    } else if (section?.storage_type === SectionStorageTypeEnum.Lots.value) {
      const firstLot = section.lots[0];
      if (firstLot) {
        setLotId(firstLot.id);
        onRequestPositions({ lot_id: firstLot.id });
      }
    }
  };

  const handleSelectRack = (value: string) => {
    setRackId(value);
    setRackPositionId("");
    onRequestPositions({ rack_id: value });
  };

  const handleSelectLot = (value: string) => {
    setLotId(value);
    setLotPositionId("");
    onRequestPositions({ lot_id: value });
  };

  const handleSaveUnloadingDetails = () => {
    onCreateUnloadingDetails({
      company_id: companyId,
      module_code: moduleCode,
      reception_id: item.id,
      unloading_start_time: new Date(unloadingStartTime).toISOString(),
      warehouse_chief_user_id: warehouseChiefUserId,
      prepared_pallets: preparedPallets
        ? Number(preparedPallets)
        : undefined,
    });
  };

  const handleSaveCrew = () => {
    onCreateUnloadingCrew({
      company_id: companyId,
      module_code: moduleCode,
      reception_id: item.id,
      persona_count: Number(personaCount),
      tercerizada,
    });
  };

  const handleSaveMachinery = () => {
    onCreateUnloadingMachinery({
      company_id: companyId,
      module_code: moduleCode,
      reception_id: item.id,
      machinery_code: machineryId,
      start_time: new Date(machineryStartTime).toISOString(),
    });
  };

  const documentLabel = resolveDocumentTypeLabel(item.document_type) ?? "—";

  return (
    <Modal
      title="Asignación de bodega"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="flex flex-col gap-5 p-1">
        <div className="flex flex-col gap-2 rounded-md! border! border-slate-200! dark:border-slate-700! bg-slate-50! dark:bg-slate-900! p-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
            <span>
              <strong>Placa:</strong> {item.plate_number || "—"}
            </span>
            <span>
              <strong>Conductor:</strong> {item.driver_name || "—"}
            </span>
            <span>
              <strong>Documento:</strong> {documentLabel}{" "}
              {item.document_number ? `(${item.document_number})` : ""}
            </span>
            <span>
              <strong>Contenedor:</strong> {item.container_number || "—"}
            </span>
          </div>
          <Badges
            label={`Documentos completados: ${item.completed_documents}/${item.total_documents}`}
            color={item.completed_documents === item.total_documents ? "success" : "warning"}
            className="w-fit!"
          />
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="m-0!">1. Seleccionar ubicación</h4>
              <small className="text-gray-500 dark:text-gray-300 text-[12px]">
                {isDucaDocument(item.document_type)
                  ? "Los documentos DUCA solo pueden asignarse a bodegas de tipo Fiscal."
                  : "Las declaraciones aduaneras solo pueden asignarse a bodegas de tipo General."}
              </small>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col min-w-0 gap-1">
                <Dropdown
                  appearance="dark"
                  label="Bodega"
                  placeholder={isLoadingWarehouses ? "Cargando..." : "Seleccionar bodega"}
                  options={warehouseOptions}
                  value={warehouseId || undefined}
                  onChange={(value) => handleSelectWarehouse(String(value ?? ""))}
                  labelClassName={labelClassName}
                  className={`${inputClassName} h-[42px]!`}
                />
                {selectedWarehouse && (
                  <small className="text-[12px] text-gray-500 dark:text-gray-300">
                    {resolveWarehouseTypeLabel(selectedWarehouse.warehouse_type)}
                  </small>
                )}
              </div>

              <Dropdown
                appearance="dark"
                label="Sección"
                placeholder="Seleccionar sección"
                options={sectionOptions}
                value={sectionId || undefined}
                onChange={(value) => handleSelectSection(String(value ?? ""))}
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]!`}
              />

              {isLotsSection ? (
                <Dropdown
                  appearance="dark"
                  label="Lote"
                  placeholder="Seleccionar lote"
                  options={lotOptions}
                  value={lotId || undefined}
                  onChange={(value) => handleSelectLot(String(value ?? ""))}
                  labelClassName={labelClassName}
                  className={`${inputClassName} h-[42px]!`}
                />
              ) : (
                <Dropdown
                  appearance="dark"
                  label="Rack"
                  placeholder="Seleccionar rack"
                  options={rackOptions}
                  value={rackId || undefined}
                  onChange={(value) => handleSelectRack(String(value ?? ""))}
                  labelClassName={labelClassName}
                  className={`${inputClassName} h-[42px]!`}
                />
              )}

              {isLotsSection ? (
                <Dropdown
                  appearance="dark"
                  label="Posición del lote"
                  placeholder="Seleccionar posición"
                  options={lotPositionOptions}
                  value={lotPositionId || undefined}
                  onChange={(value) => setLotPositionId(String(value ?? ""))}
                  labelClassName={labelClassName}
                  className={`${inputClassName} h-[42px]!`}
                />
              ) : (
                <Dropdown
                  appearance="dark"
                  label="Posición del rack"
                  placeholder="Seleccionar posición"
                  options={rackPositionOptions}
                  value={rackPositionId || undefined}
                  onChange={(value) => setRackPositionId(String(value ?? ""))}
                  labelClassName={labelClassName}
                  className={`${inputClassName} h-[42px]!`}
                />
              )}
            </div>

            <div className="flex justify-end">
              <Button
                size="giant"
                className="w-full! sm:w-auto! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                label={isCreating ? "Guardando..." : "Guardar y continuar"}
                disabled={!canSaveAssignment || isCreating}
                onClick={handleSaveAssignment}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="m-0!">2. Detalles de descarga</h4>
              <small className="text-gray-500 dark:text-gray-300 text-[12px]">
                Registra el inicio de la descarga y el jefe de bodega responsable.
              </small>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col min-w-0">
                <label className={labelClassName}>Fecha y hora de inicio</label>
                <input
                  type="datetime-local"
                  className={`${inputClassName} h-[42px]! px-3! text-sm!`}
                  value={unloadingStartTime}
                  onChange={(e) => setUnloadingStartTime(e.target.value)}
                />
              </div>

              <Dropdown
                appearance="dark"
                label="Jefe de bodega"
                placeholder="Seleccionar responsable"
                options={staffOptions}
                value={warehouseChiefUserId || undefined}
                onChange={(value) => setWarehouseChiefUserId(String(value ?? ""))}
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]!`}
              />

              <div className="flex flex-col min-w-0">
                <InputText
                  label="Pallets preparados (opcional)"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  type="number"
                  placeholder="Cantidad de pallets"
                  errorVariant="tooltip"
                  value={preparedPallets}
                  onChange={(e) => setPreparedPallets(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                size="giant"
                className="rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                label="Atrás"
                onClick={() => onStepChange(1)}
              />
              <Button
                size="giant"
                className="rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                label={isCreating ? "Guardando..." : "Guardar y continuar"}
                disabled={!canSaveUnloadingDetails || isCreating}
                onClick={handleSaveUnloadingDetails}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="m-0!">3. Cuadrilla y maquinaria</h4>
              <small className="text-gray-500 dark:text-gray-300 text-[12px]">
                Asigna la cuadrilla de descarga y la maquinaria utilizada.
              </small>
            </div>

            <div className="flex flex-col gap-3 rounded-md! border! border-slate-200! dark:border-slate-700! p-3">
              <h5 className="m-0! text-[14px]!">Cuadrilla</h5>
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
                  disabled={!canSaveCrew || isCreating}
                  onClick={handleSaveCrew}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-md! border! border-slate-200! dark:border-slate-700! p-3">
              <h5 className="m-0! text-[14px]!">Maquinaria</h5>
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
                  label={isCreating ? "Guardando..." : "Guardar maquinaria"}
                  disabled={!canSaveMachinery || isCreating}
                  onClick={handleSaveMachinery}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                size="giant"
                className="rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                label="Atrás"
                onClick={() => onStepChange(2)}
              />
              <Button
                size="giant"
                className="rounded-md! text-white! bg-alpac-success-500! dark:bg-alpac-success-700!"
                label="Continuar al resumen"
                onClick={() => onStepChange(4)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="m-0!">4. Resumen y finalización</h4>
              <small className="text-gray-500 dark:text-gray-300 text-[12px]">
                Confirma los datos registrados y finaliza la asignación.
              </small>
            </div>

            <div className="flex flex-col gap-1 text-[13px] rounded-md! border! border-slate-200! dark:border-slate-700! p-3">
              <span>
                <strong>Bodega:</strong> {selectedWarehouse?.name ?? "—"}
              </span>
              <span>
                <strong>Sección:</strong> {selectedSection?.code ?? "—"}
              </span>
              <span>
                <strong>{isLotsSection ? "Lote" : "Rack"}:</strong>{" "}
                {isLotsSection
                  ? (selectedSection?.lots.find((l) => l.id === lotId)?.code ??
                    "—")
                  : (selectedSection?.racks.find((r) => r.id === rackId)?.code ??
                    "—")}
              </span>
              <span>
                <strong>Inicio de descarga:</strong>{" "}
                {unloadingStartTime
                  ? new Date(unloadingStartTime).toLocaleString("es-NI")
                  : "—"}
              </span>
              <span>
                <strong>Jefe de bodega:</strong>{" "}
                {staffs.find((s) => s.id === warehouseChiefUserId)?.full_name ??
                  "—"}
              </span>
              {personaCount && (
                <span>
                  <strong>Cuadrilla:</strong> {personaCount} personas{" "}
                  {tercerizada ? "(tercerizada)" : ""}
                </span>
              )}
              {machineryId && (
                <span>
                  <strong>Maquinaria:</strong>{" "}
                  {machineries.find((m) => m.id === machineryId)?.name ?? "—"}
                </span>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                size="giant"
                className="rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                label="Atrás"
                onClick={() => onStepChange(3)}
                disabled={isCompleting}
              />
              <Button
                size="giant"
                className="rounded-md! text-white! bg-alpac-success-500! dark:bg-alpac-success-700!"
                label={isCompleting ? "Finalizando..." : "Completar asignación"}
                disabled={isCompleting}
                onClick={() =>
                  onCompleteAssignment({
                    company_id: companyId,
                    module_code: moduleCode,
                    reception_id: item.id,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}