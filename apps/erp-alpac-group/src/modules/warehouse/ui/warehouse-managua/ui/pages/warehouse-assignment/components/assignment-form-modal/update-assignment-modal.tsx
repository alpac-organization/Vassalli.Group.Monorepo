import { useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  InputText,
  Modal,
  Textarea,
  type Option,
} from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import {
  DestinationType,
  DestinationTypeLabels,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface UpdateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationalOrderId: string | null;
  assignment: AssignmentOperationalDto | null;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

const destinationOptions: Option[] = [
  {
    value: String(DestinationType.Warehouse),
    label: DestinationTypeLabels[DestinationType.Warehouse],
  },
  {
    value: String(DestinationType.CustomYard),
    label: DestinationTypeLabels[DestinationType.CustomYard],
  },
  {
    value: String(DestinationType.CustomSheld),
    label: DestinationTypeLabels[DestinationType.CustomSheld],
  },
];

function resolveDestinationTypeValue(val?: string | number | null): string {
  if (val == null) return String(DestinationType.Warehouse);
  const s = String(val).trim().toLowerCase();
  if (s === "1" || s === "warehouse" || s === "almacén" || s === "almacen")
    return String(DestinationType.Warehouse);
  if (s === "2" || s === "customyard" || s === "patio aduanero")
    return String(DestinationType.CustomYard);
  if (
    s === "3" ||
    s === "customsheld" ||
    s === "galerón aduanero" ||
    s === "galeron aduanero"
  )
    return String(DestinationType.CustomSheld);
  return String(DestinationType.Warehouse);
}

export function UpdateAssignmentModal({
  isOpen,
  onClose,
  operationalOrderId,
  assignment,
  onSuccess,
  onError,
}: UpdateAssignmentModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const [merchandise, setMerchandise] = useState("");
  const [merchandiseDescription, setMerchandiseDescription] = useState("");
  const [destinationType, setDestinationType] = useState<string>(
    String(DestinationType.Warehouse),
  );
  const [warehouseId, setWarehouseId] = useState<string>("");
  const [observations, setObservations] = useState("");

  const assignmentId = assignment?.assignment_id;

  const payloadAssignmentDetails = useMemo(() => {
    if (!isOpen || !operationalOrderId || !assignmentId)
      return null;
    return {
      company_id: companyId,
      module_code: moduleCode,
      operational_order_id: operationalOrderId,
      assignment_id: assignmentId,
    };
  }, [
    isOpen,
    operationalOrderId,
    assignmentId,
    companyId,
    moduleCode,
  ]);

  const { GetAssignmentDetails, UpdateAssignment } = useWarehouseAssignment({
    payloadAssignmentDetails,
  });

  const { data: detail, isLoading: isLoadingDetails } = GetAssignmentDetails;

  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload: {
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const warehouseOptions: Option[] = useMemo(() => {
    return (GetWarehouses.data?.data ?? []).map((w) => ({
      value: w.warehouse_id,
      label: w.code ?? "-",
    }));
  }, [GetWarehouses.data]);

  const [prevAssignmentId, setPrevAssignmentId] = useState<string | null>(null);
  const [prevDetail, setPrevDetail] = useState<typeof detail | null>(null);

  // Mapear datos al abrir o cambiar de asignación
  if (isOpen && assignment && assignment.assignment_id !== prevAssignmentId) {
    setPrevAssignmentId(assignment.assignment_id);
    setPrevDetail(null);
    setMerchandise(assignment.merchandise || "");
    setMerchandiseDescription(assignment.merchandise_description || "");
    setDestinationType(
      resolveDestinationTypeValue(assignment.destination_type),
    );
    setWarehouseId("");
    setObservations("");
  }

  // Mapear datos detallados cuando el backend responda con el detalle completo
  if (isOpen && detail && detail !== prevDetail) {
    setPrevDetail(detail);
    setMerchandise(detail.merchandise || "");
    setMerchandiseDescription(detail.merchandise_description || "");
    setDestinationType(resolveDestinationTypeValue(detail.destination_type));
    setWarehouseId(detail.warehouse_information?.warehouse_id || "");
    setObservations(detail.observations || "");
  }

  const resetForm = () => {
    setMerchandise("");
    setMerchandiseDescription("");
    setDestinationType(String(DestinationType.Warehouse));
    setWarehouseId("");
    setObservations("");
    setPrevAssignmentId(null);
    setPrevDetail(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isWarehouseSelected =
    Number(destinationType) === DestinationType.Warehouse;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operationalOrderId || !assignment?.assignment_id) return;

    const trimmedMerchandise = merchandise.trim();
    if (!trimmedMerchandise) {
      onError?.("El nombre de la mercancía es requerido");
      return;
    }

    try {
      await UpdateAssignment.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: operationalOrderId,
        assignment_id: assignment.assignment_id,
        merchandise: trimmedMerchandise,
        merchandise_description: merchandiseDescription.trim() || undefined,
        destination_type: Number(destinationType),
        warehouse_id:
          isWarehouseSelected && warehouseId ? warehouseId : undefined,
        observations: observations.trim() || undefined,
      });

      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message ||
        "Error al actualizar la asignación operativa";
      onError?.(errorMsg);
    }
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(assignment)}
      onClose={handleClose}
      variant="default"
      size="4xl"
      title="Editar Asignación Operativa"
      description="Modifica los datos de la mercancía, destino y observaciones de la asignación."
      panelClassName="flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden !mx-2 !my-2 sm:!mx-4 sm:!my-6 rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {isLoadingDetails ? (
          <div className="px-3 py-16 text-center">
            <Loader title="Cargando datos de la asignación..." />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="scrollbar-dashboard flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col min-w-0">
                  <InputText
                    label="Mercancía"
                    labelClassName={labelClassName}
                    placeholder="Ej. Contenedor 40ft"
                    isRequired
                    value={merchandise}
                    onChange={(e) => setMerchandise(e.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <Dropdown
                    appearance="dark"
                    label="Tipo de Destino"
                    labelClassName={labelClassName}
                    placeholder="Seleccionar destino"
                    options={destinationOptions}
                    value={destinationType}
                    onChange={(val) => setDestinationType(String(val || ""))}
                    className={dropdownClassName}
                  />
                </div>
              </div>

              {isWarehouseSelected && (
                <div className="flex flex-col min-w-0">
                  <Dropdown
                    appearance="dark"
                    label="Almacén de Destino"
                    labelClassName={labelClassName}
                    placeholder="Seleccionar almacén..."
                    options={warehouseOptions}
                    value={warehouseId || undefined}
                    onChange={(val) => setWarehouseId(String(val || ""))}
                    className={dropdownClassName}
                  />
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <InputText
                  label="Descripción de Mercancía"
                  labelClassName={labelClassName}
                  placeholder="Descripción detallada de la carga"
                  value={merchandiseDescription}
                  onChange={(e) => setMerchandiseDescription(e.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col min-w-0">
                <Textarea
                  label="Observaciones"
                  labelClassName={labelClassName}
                  placeholder="Observaciones de la actualización..."
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Separador de footer */}
            <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mt-3" />

            {/* Botones de acción estándar */}
            <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3 pt-3">
              <Button
                type="button"
                size="giant"
                label="Cancelar"
                onClick={handleClose}
                disabled={UpdateAssignment.isPending}
                className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
              />
              <Button
                type="submit"
                size="giant"
                label="Guardar Cambios"
                isLoading={UpdateAssignment.isPending}
                disabled={UpdateAssignment.isPending}
                className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
              />
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
