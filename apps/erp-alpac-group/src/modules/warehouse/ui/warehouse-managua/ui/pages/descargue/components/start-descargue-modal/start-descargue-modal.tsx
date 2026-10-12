import {
  Button,
  InputText,
  Modal,
} from "@alpac/design-system";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import { getDestinationLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/assignment-page.utils";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface StartDescargueModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: AssignmentOperationalDto | null;
  isSubmitting?: boolean;
  onConfirm: (
    assignment: AssignmentOperationalDto,
    warehouseId: string,
    warehouseName: string,
  ) => Promise<void>;
}

export function StartDescargueModal({
  isOpen,
  onClose,
  assignment,
  isSubmitting = false,
  onConfirm,
}: StartDescargueModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { GetAssignmentDetails } = useWarehouseAssignment({
    payloadAssignmentDetails:
      isOpen && assignment && companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
            operational_order_id: assignment.operational_order_id,
            assignment_id: assignment.assignment_id,
          }
        : null,
  });

  if (!assignment) return null;

  const warehouseInfo = GetAssignmentDetails.data?.warehouse_information;
  const warehouseId =
    warehouseInfo?.warehouse_id || assignment.warehouse_id || "";
  const warehouseCode =
    warehouseInfo?.code ||
    assignment.warehouse_code ||
    assignment.warehouse_name ||
    "Bodega no disponible";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseId || GetAssignmentDetails.isLoading) return;
    await onConfirm(assignment, warehouseId, warehouseCode);
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(assignment)}
      onClose={onClose}
      variant="form"
      size="4xl"
      title="Iniciar Descarga de Mercancía"
      description="Verifica los datos de la mercancía y confirma el inicio de la descarga para asignar posiciones en el visor 3D."
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
              label="Bodega de Destino"
              labelClassName={labelClassName}
              value={
                GetAssignmentDetails.isLoading
                  ? "Cargando bodega..."
                  : warehouseCode
              }
              disabled
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col min-w-0">
            <InputText
              label="Tipo de Destino"
              labelClassName={labelClassName}
              value={getDestinationLabel(assignment.destination_type)}
              disabled
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <InputText
              label="Descripción de Mercancía"
              labelClassName={labelClassName}
              value={assignment.merchandise_description || "Sin descripción"}
              disabled
              className={inputClassName}
            />
          </div>
        </div>

        {assignment.is_alerted && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-semibold">
            <ShieldAlert size={18} className="text-red-500 shrink-0" />
            <span>Esta mercancía cuenta con alerta activa. Se debe registrar con especial atención.</span>
          </div>
        )}

        {/* Mensaje descriptivo del flujo hacia Bodega 3D */}
        <div className="rounded-lg border border-sky-200 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/30 p-3.5 flex items-start gap-3">
          <CheckCircle2 className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-sky-900 dark:text-sky-200 space-y-1">
            <p className="font-semibold m-0">Flujo de Descarga</p>
            <p className="m-0 leading-relaxed text-sky-800 dark:text-sky-300">
              Al confirmar, la tarea pasará al estado <strong>En Proceso</strong> y serás redirigido a la <strong>Bodega 3D</strong> para seleccionar y ubicar las posiciones de almacenamiento.
            </p>
          </div>
        </div>

        {/* Separador de footer estándar */}
        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mt-2" />

        {/* Botones de acción estándar */}
        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
          />
          <Button
            type="submit"
            size="giant"
            label={isSubmitting ? "Iniciando descarga..." : "Iniciar Descarga y Asignar en 3D"}
            isLoading={isSubmitting}
            disabled={
              isSubmitting ||
              GetAssignmentDetails.isLoading ||
              !warehouseId
            }
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
}
