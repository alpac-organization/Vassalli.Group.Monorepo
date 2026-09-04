import { Button } from "@alpac/design-system";
import type { SelectedAssignmentTarget } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";
import type { AssignmentSummaryData } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/assignment-modal";

type StepConfirmarProps = {
  target: SelectedAssignmentTarget;
  summaryData: AssignmentSummaryData;
  isSubmitting: boolean;
  onConfirm: () => void;
  onBack: () => void;
};

export function StepConfirmar({
  target,
  summaryData,
  isSubmitting,
  onConfirm,
  onBack,
}: StepConfirmarProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-slate-600 dark:text-slate-300 text-sm">
        Todo está listo. Al confirmar se cerrará la etapa de asignación y la
        recepción avanzará al siguiente paso del flujo.
      </p>

      {/* Resumen */}
      <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-4 flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
        <h4 className="m-0! p-0! font-semibold text-base">Resumen</h4>
        <div className="flex flex-col gap-1 mt-1">
          {/* Target Info */}
          <span>
            <strong>Placa:</strong> {target.license_plate}
          </span>
          <span>
            <strong>Conductor:</strong> {target.driver_name}
          </span>
          {target.ducat_number ? (
            <span>
              <strong>DUCA:</strong> {target.ducat_number}
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">
              Tipo: Declaración Aduanera (sin DUCA)
            </span>
          )}

          {/* User selected info */}
          <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
          <span>
            <strong>Bodega Seleccionada:</strong> {summaryData.bodega?.warehouseName || "N/A"}
          </span>
          <span>
            <strong>Jefe de Bodega:</strong> {summaryData.bodega?.chiefName || "N/A"}
          </span>
          <span>
            <strong>Cuadrilla:</strong> {summaryData.cuadrilla?.text || "N/A"}
          </span>
          <span>
            <strong>Maquinaria:</strong> {summaryData.maquinaria?.text || "N/A"}
          </span>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button
          type="button"
          label="← Volver"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-transparent! border! border-slate-300! text-slate-700! dark:border-slate-600! dark:text-slate-300!"
        />
        <Button
          type="button"
          label={isSubmitting ? "Finalizando..." : "✓ Finalizar Asignación"}
          onClick={onConfirm}
          disabled={isSubmitting}
          className="bg-emerald-600! hover:bg-emerald-700! text-white!"
        />
      </div>
    </div>
  );
}

