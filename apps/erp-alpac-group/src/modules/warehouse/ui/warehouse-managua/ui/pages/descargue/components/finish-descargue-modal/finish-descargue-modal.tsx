import { Button, Dropdown, InputText, Modal, type Option } from "@alpac/design-system";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import { getDestinationLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/assignment-page.utils";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface FinishDescargueModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentOperationalDto | null;
  isSubmitting?: boolean;
  onConfirm: (
    assignment: AssignmentOperationalDto,
    positioning: PositioningInformation,
  ) => Promise<void>;
}

export interface PositioningInformation {
  merchandiseType: 1 | 2;
  palletType: 1 | 2;
  palletCount: string;
  bulksPerPallet: string;
  palletWidth: string;
  palletLength: string;
}

const merchandiseTypeOptions: Option[] = [
  { value: "1", label: "Granel" },
  { value: "2", label: "Armada / empolinada" },
];

const palletTypeOptions: Option[] = [
  { value: "1", label: "Estándar" },
  { value: "2", label: "Sobredimensionado" },
];

export function FinishDescargueModal({
  isOpen,
  onClose,
  assignment,
  isSubmitting = false,
  onConfirm,
}: FinishDescargueModalProps) {
  const [positioning, setPositioning] = useState<PositioningInformation>({
    merchandiseType: 1,
    palletType: 1,
    palletCount: "1",
    bulksPerPallet: "1",
    palletWidth: "1",
    palletLength: "1.2",
  });

  if (!assignment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(assignment, positioning);
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(assignment)}
      onClose={onClose}
      variant="form"
      size="3xl"
      title="Finalizar Descarga de Mercancía"
      description="Completa la tarea de descarga de esta asignación operativa."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col min-w-0">
            <InputText
              label="Mercancía"
              labelClassName={labelClassName}
              value={assignment.merchandise || "Sin especificar"}
              disabled
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <InputText
              label="Destino"
              labelClassName={labelClassName}
              value={getDestinationLabel(assignment.destination_type)}
              disabled
              className={inputClassName}
            />
          </div>
        </div>

        {assignment.merchandise_description && (
          <div className="flex flex-col min-w-0">
            <InputText
              label="Descripción de Mercancía"
              labelClassName={labelClassName}
              value={assignment.merchandise_description}
              disabled
              className={inputClassName}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 sm:grid-cols-2">
          <Dropdown
            appearance="dark"
            label="Tipo de mercancía"
            labelClassName={labelClassName}
            options={merchandiseTypeOptions}
            value={String(positioning.merchandiseType)}
            onChange={(value) =>
              setPositioning((current) => ({
                ...current,
                merchandiseType: Number(value) as 1 | 2,
              }))
            }
            className={dropdownClassName}
          />
          <Dropdown
            appearance="dark"
            label="Tipo de polín"
            labelClassName={labelClassName}
            options={palletTypeOptions}
            value={String(positioning.palletType)}
            onChange={(value) =>
              setPositioning((current) => ({
                ...current,
                palletType: Number(value) as 1 | 2,
              }))
            }
            className={dropdownClassName}
          />
          <InputText
            label="Cantidad de polines"
            labelClassName={labelClassName}
            value={positioning.palletCount}
            onChange={(event) =>
              setPositioning((current) => ({
                ...current,
                palletCount: event.target.value,
              }))
            }
            className={inputClassName}
          />
          {positioning.merchandiseType === 1 && (
            <InputText
              label="Bultos por polín"
              labelClassName={labelClassName}
              value={positioning.bulksPerPallet}
              onChange={(event) =>
                setPositioning((current) => ({
                  ...current,
                  bulksPerPallet: event.target.value,
                }))
              }
              className={inputClassName}
            />
          )}
          {positioning.palletType === 2 && (
            <>
              <InputText
                label="Ancho"
                labelClassName={labelClassName}
                value={positioning.palletWidth}
                onChange={(event) =>
                  setPositioning((current) => ({
                    ...current,
                    palletWidth: event.target.value,
                  }))
                }
                className={inputClassName}
              />
              <InputText
                label="Largo"
                labelClassName={labelClassName}
                value={positioning.palletLength}
                onChange={(event) =>
                  setPositioning((current) => ({
                    ...current,
                    palletLength: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </>
          )}
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/30 p-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
              Confirmación de Finalización
            </span>
            <p className="m-0 leading-relaxed text-emerald-700 dark:text-emerald-300">
              Al finalizar esta tarea, la asignación pasará a estado <b>Descargada (Downloaded)</b> y todas las posiciones reservadas en la bodega quedarán registradas formalmente como <b>Ocupadas (Occupied)</b>.
            </p>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            label="Cancelar"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg! text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 cursor-pointer"
          />

          <Button
            type="submit"
            label={isSubmitting ? "Finalizando..." : "Finalizar Descarga"}
            disabled={isSubmitting}
            className="rounded-lg! bg-emerald-600! hover:bg-emerald-500! text-white! font-semibold px-5! cursor-pointer shadow-md shadow-emerald-950/30"
          />
        </div>
      </form>
    </Modal>
  );
}
