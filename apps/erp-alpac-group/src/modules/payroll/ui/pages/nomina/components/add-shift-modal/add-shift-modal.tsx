import { Button, Checkbox, InputText, Modal } from "@alpac/design-system";
import { useMemo, useState } from "react";
import type {
  AddShiftCell,
  AddShiftCollaborator,
  AddShiftModalProps,
  ShiftSelections,
  ShiftValue,
  TeCarryOverFlags,
} from "./add-shift-modal.types";
import {
  buildDateColumns,
  formatDateLabel,
  formatShiftCount,
  getContractTypeLabel,
  getShiftStorageKey,
  getShiftValueLabel,
  getTeHours,
} from "./add-shift-modal.utils";

const SHIFT_OPTIONS: { value: ShiftValue; label: string }[] = [
  { value: 12, label: "Turno de 12 horas" },
  { value: 24, label: "Turno de 24 horas" },
  { value: "TE", label: "TE (Tiempo extra)" },
  { value: "Vac", label: "Vac" },
];

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-[14px] font-medium text-slate-800 dark:text-white">
        {value}
      </span>
    </div>
  );
}

export function AddShiftModal({
  isOpen,
  onClose,
  onSave,
  selections,
  onSelectionsChange,
  carryOverFlags,
  onCarryOverFlagsChange,
  items,
  startDate,
  endDate,
  branchName,
  companyName,
  payrollType,
}: AddShiftModalProps): React.ReactNode {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCell, setSelectedCell] = useState<AddShiftCell | null>(null);

  const dateColumns = useMemo(
    () => buildDateColumns(startDate, endDate),
    [startDate, endDate],
  );

  const collaborators = useMemo<AddShiftCollaborator[]>(() => {
    return items.reduce<AddShiftCollaborator[]>((acc, item, index) => {
      const collaborator = item.collaborator;
      if (!collaborator) return acc;

      const id =
        collaborator.collaborator_code?.trim() ||
        collaborator.identification_number?.trim() ||
        `colaborador-${index}`;

      acc.push({
        id,
        fullName: collaborator.full_name?.trim() || "—",
        identificationNumber:
          collaborator.identification_number?.trim() || "—",
        workArea: collaborator.work_area?.trim() || "—",
        contractType: getContractTypeLabel(payrollType),
      });

      return acc;
    }, []);
  }, [items, payrollType]);

  const filteredCollaborators = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return collaborators;

    return collaborators.filter(
      (collaborator) =>
        collaborator.fullName.toLowerCase().includes(term) ||
        collaborator.identificationNumber.toLowerCase().includes(term) ||
        collaborator.workArea.toLowerCase().includes(term),
    );
  }, [collaborators, searchTerm]);

  const getSelection = (collaboratorId: string, dateKey: string) =>
    selections[getShiftStorageKey(collaboratorId, dateKey)] ?? null;

  const handleSelectShift = (value: ShiftValue | null) => {
    if (!selectedCell) return;

    const key = getShiftStorageKey(
      selectedCell.collaborator.id,
      selectedCell.date.key,
    );

    const next: ShiftSelections = { ...selections };
    if (value === null) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onSelectionsChange(next);
    setSelectedCell(null);
  };

  const getPreviousShift = (collaboratorId: string, dateKey: string) => {
    const dateIndex = dateColumns.findIndex((date) => date.key === dateKey);

    for (let index = dateIndex - 1; index >= 0; index -= 1) {
      const value = getSelection(collaboratorId, dateColumns[index].key);
      if (value !== null && value !== "Vac") return value;
    }

    return carryOverFlags[collaboratorId] ? 24 : null;
  };

  const getRegularHoursBefore = (collaboratorId: string, dateKey: string) => {
    const dateIndex = dateColumns.findIndex((date) => date.key === dateKey);
    let hours = 0;

    for (let index = 0; index < dateIndex; index += 1) {
      const value = getSelection(collaboratorId, dateColumns[index].key);
      if (value === 12 || value === 24) hours += value;
    }

    return hours;
  };

  const previousShift =
    selectedCell !== null
      ? getPreviousShift(
          selectedCell.collaborator.id,
          selectedCell.date.key,
        )
      : null;

  const canRegisterTe =
    selectedCell !== null &&
    (previousShift === 24 ||
      (previousShift === 12 &&
        getRegularHoursBefore(
          selectedCell.collaborator.id,
          selectedCell.date.key,
        ) >= 36));

  const handleCancel = () => {
    setSelectedCell(null);
    onClose();
  };

  const handleSave = () => {
    setSelectedCell(null);
    onSave();
  };

  const getTotals = (collaboratorId: string) => {
    let hoursFrom12 = 0;
    let hoursFrom24 = 0;
    let teCount = 0;

    dateColumns.forEach((date) => {
      const value = getSelection(collaboratorId, date.key);
      if (value === null) return;

      if (value === "TE") {
        teCount += 1;
      } else if (value === 12) {
        hoursFrom12 += 12;
      } else if (value === 24) {
        hoursFrom24 += 24;
      }
    });

    const totalHours = hoursFrom12 + hoursFrom24;
    const teHours = getTeHours(teCount);

    return {
      totalHours,
      teHours,
      totalShifts: formatShiftCount((totalHours + teHours) / 24),
    };
  };

  const hasData = filteredCollaborators.length > 0 && dateColumns.length > 0;
  const registeredShifts = Object.values(selections).filter(
    (value) => value !== null && value !== "Vac",
  ).length;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        variant="default"
        size="7xl"
        title="Agregar Turno"
        description="Seleccione el turno de cada colaborador por fecha. Use Vac para vacaciones y marque “Inicia con TE” si terminó la quincena anterior con 24 horas. Los cambios se conservan solo en esta sesión."
      >
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-600 dark:bg-[#272b34] sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            label="Empresa"
            value={companyName?.trim() || "Vigilancia Empresarial, S.A."}
          />
          <InfoItem label="Sucursal" value={branchName?.trim() || "—"} />
          <InfoItem
            label="Corte de quincena"
            value={`${formatDateLabel(startDate)} – ${formatDateLabel(endDate)}`}
          />
          <InfoItem
            label="Tipo de contrato"
            value={getContractTypeLabel(payrollType)}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <InputText
            placeholder="Buscar colaborador"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="dark:bg-[#272b34]! dark:text-white!"
          />
          <span className="shrink-0 text-[13px] text-slate-500 dark:text-slate-400">
            {registeredShifts} turno{registeredShifts === 1 ? "" : "s"}{" "}
            registrado{registeredShifts === 1 ? "" : "s"}
          </span>
        </div>

        {hasData ? (
          <div className="max-h-[55vh] overflow-auto rounded-lg border border-slate-200 dark:border-neutral-600">
            <table
              className="w-full border-collapse text-[13px]"
              style={{ minWidth: `${dateColumns.length * 3.5 + 46}rem` }}
            >
              <thead>
                <tr className="bg-slate-100 text-slate-700 dark:bg-[#2f3440] dark:text-slate-200">
                  <th
                    colSpan={5}
                    className="sticky left-0 top-0 z-30 border-b border-r border-slate-200 px-3 py-2 text-left font-semibold dark:border-neutral-600"
                  >
                    Colaborador
                  </th>
                  <th
                    colSpan={dateColumns.length}
                    className="sticky top-0 z-20 border-b border-slate-200 px-3 py-2 text-center font-semibold dark:border-neutral-600"
                  >
                    Fechas
                  </th>
                  <th
                    colSpan={3}
                    className="sticky top-0 z-20 border-b border-l border-slate-200 px-3 py-2 text-center font-semibold dark:border-neutral-600"
                  >
                    Resumen
                  </th>
                </tr>
                <tr className="bg-slate-50 text-slate-600 dark:bg-[#2a2f3a] dark:text-slate-300">
                  <th className="sticky left-0 top-[38px] z-30 min-w-[220px] border-b border-r border-slate-200 px-3 py-2 text-left font-semibold dark:border-neutral-600">
                    Nombres y Apellidos
                  </th>
                  <th className="sticky top-[38px] z-20 min-w-[160px] border-b border-slate-200 px-3 py-2 text-left font-semibold dark:border-neutral-600">
                    Identificación
                  </th>
                  <th className="sticky top-[38px] z-20 min-w-[140px] border-b border-slate-200 px-3 py-2 text-left font-semibold dark:border-neutral-600">
                    Bodega
                  </th>
                  <th className="sticky top-[38px] z-20 min-w-[140px] border-b border-slate-200 px-3 py-2 text-left font-semibold dark:border-neutral-600">
                    Tipo de Contrato
                  </th>
                  <th className="sticky top-[38px] z-20 min-w-[110px] border-b border-slate-200 px-3 py-2 text-center font-semibold dark:border-neutral-600">
                    Inicia con TE
                  </th>
                  {dateColumns.map((date) => (
                    <th
                      key={date.key}
                      className="sticky top-[38px] z-20 min-w-[56px] border-b border-slate-200 px-2 py-2 text-center font-semibold dark:border-neutral-600"
                      title={`${date.fullLabel} de ${date.month}`}
                    >
                      <span className="block text-[11px] font-normal uppercase text-slate-400">
                        {date.weekday}
                      </span>
                      <span>{date.day}</span>
                    </th>
                  ))}
                  <th className="sticky top-[38px] z-20 min-w-[100px] border-b border-l border-slate-200 px-3 py-2 text-center font-semibold dark:border-neutral-600">
                    Total Horas
                  </th>
                  <th className="sticky top-[38px] z-20 min-w-[90px] border-b border-slate-200 px-3 py-2 text-center font-semibold dark:border-neutral-600">
                    Suma TE
                  </th>
                  <th className="sticky top-[38px] z-20 min-w-[100px] border-b border-slate-200 px-3 py-2 text-center font-semibold dark:border-neutral-600">
                    Total Turnos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-neutral-600">
                {filteredCollaborators.map((collaborator) => {
                  const totals = getTotals(collaborator.id);

                  return (
                    <tr
                      key={collaborator.id}
                      className="bg-white dark:bg-[#272b34]"
                    >
                      <td className="sticky left-0 z-10 max-w-[260px] truncate border-r border-slate-200 px-3 py-2 font-medium text-slate-800 dark:border-neutral-600 dark:text-white">
                        {collaborator.fullName}
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                        {collaborator.identificationNumber}
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                        {collaborator.workArea}
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                        {collaborator.contractType}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Checkbox
                          aria-label={`Iniciar con TE para ${collaborator.fullName}`}
                          checked={Boolean(carryOverFlags[collaborator.id])}
                          onChange={(event) => {
                            const next: TeCarryOverFlags = {
                              ...carryOverFlags,
                              [collaborator.id]: event.target.checked,
                            };
                            onCarryOverFlagsChange(next);
                          }}
                        />
                      </td>
                      {dateColumns.map((date) => {
                        const value = getSelection(collaborator.id, date.key);

                        return (
                          <td
                            key={date.key}
                            className="px-2 py-1.5 text-center"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCell({ collaborator, date })
                              }
                              aria-label={`${collaborator.fullName}, ${date.fullLabel} de ${date.month}: ${
                                value === null
                                  ? "sin turno"
                                  : getShiftValueLabel(value)
                              }`}
                              className={`h-9 w-11 rounded-md border text-[13px] font-semibold transition-colors ${
                                value === null
                                  ? "border-slate-200 bg-slate-50! text-slate-400! hover:bg-slate-100 dark:border-neutral-600 dark:bg-[#272b34]! dark:text-slate-500! dark:hover:bg-[#343a46]!"
                                  : value === "Vac"
                                    ? "border-amber-200 bg-amber-50! text-amber-700! hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/30! dark:text-amber-300! dark:hover:bg-amber-900/50!"
                                    : "border-transparent bg-alpac-primary-500! text-white! hover:bg-alpac-primary-600! dark:bg-alpac-primary-700!"
                              }`}
                            >
                              {value ?? "—"}
                            </button>
                          </td>
                        );
                      })}
                      <td className="border-l border-slate-200 px-3 py-2 text-center font-semibold text-slate-800 dark:border-neutral-600 dark:text-white">
                        {totals.totalHours}
                      </td>
                      <td className="px-3 py-2 text-center font-semibold text-slate-800 dark:text-white">
                        {totals.teHours}
                      </td>
                      <td className="px-3 py-2 text-center font-semibold text-slate-800 dark:text-white">
                        {totals.totalShifts}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-[14px] text-slate-500 dark:border-neutral-600 dark:text-slate-400">
            No hay colaboradores o fechas disponibles para registrar turnos.
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCancel}
            className="w-full! min-h-[44px]! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Guardar turnos"
            onClick={handleSave}
            disabled={!hasData}
            className="w-full! min-h-[44px]! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isOpen && selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        variant="default"
        size="sm"
        title="Seleccionar turno"
        description={
          selectedCell
            ? `${selectedCell.collaborator.fullName} · ${selectedCell.date.fullLabel} de ${selectedCell.date.month}`
            : undefined
        }
      >
        <div className="mt-4 flex flex-col gap-3">
          {selectedCell && (
            <p
              className={`text-[13px] ${
                canRegisterTe
                  ? "text-slate-500 dark:text-slate-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {canRegisterTe
                ? "El TE está disponible porque hay un turno de 24 horas o 36 horas acumuladas antes de esta fecha."
                : "El TE requiere un turno de 24 horas o 36 horas acumuladas antes de esta fecha."}
            </p>
          )}
          {SHIFT_OPTIONS.map((option) => {
            const isTeOption = option.value === "TE";
            const isDisabled = isTeOption && !canRegisterTe;

            return (
              <Button
                key={option.value}
                type="button"
                size="giant"
                label={option.label}
                disabled={isDisabled}
                onClick={() => handleSelectShift(option.value)}
                className={`w-full! min-h-[48px]! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! ${
                  isDisabled
                    ? "disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
                    : ""
                }`}
              />
            );
          })}
          <Button
            type="button"
            size="giant"
            label="Quitar turno"
            onClick={() => handleSelectShift(null)}
            className="w-full! min-h-[48px]! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={() => setSelectedCell(null)}
            className="w-full! min-h-[48px]! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
          />
        </div>
      </Modal>
    </>
  );
}
