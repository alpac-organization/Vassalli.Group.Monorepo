import { useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  InputText,
  Modal,
  Textarea,
  type Option,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import {
  DestinationType,
  DestinationTypeLabels,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationalOrderId: string | null;
  poCode?: string;
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

export function CreateAssignmentModal({
  isOpen,
  onClose,
  operationalOrderId,
  poCode,
  onSuccess,
  onError,
}: CreateAssignmentModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const [merchandise, setMerchandise] = useState("");
  const [merchandiseDescription, setMerchandiseDescription] = useState("");
  const [destinationType, setDestinationType] = useState<string>(
    String(DestinationType.Warehouse),
  );
  const [warehouseId, setWarehouseId] = useState<string>("");
  const [observations, setObservations] = useState("");

  const resetForm = () => {
    setMerchandise("");
    setMerchandiseDescription("");
    setDestinationType(String(DestinationType.Warehouse));
    setWarehouseId("");
    setObservations("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  
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

  const { CreateAssignment } = useWarehouseAssignment();

  const isWarehouseSelected =
    Number(destinationType) === DestinationType.Warehouse;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operationalOrderId) return;

    try {
      await CreateAssignment.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: operationalOrderId,
        merchandise: merchandise.trim() || undefined,
        merchandise_description: merchandiseDescription.trim() || undefined,
        destination_type: Number(destinationType),
        warehouse_id:
        isWarehouseSelected && warehouseId ? warehouseId : undefined,
        observations: observations.trim() || undefined,
        has_assigned_machinery: false,
        has_assigned_collaborators: false,
      });

      resetForm();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message ||
        "Error al crear la asignación operativa";
      onError?.(errorMsg);
    }
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(operationalOrderId)}
      onClose={handleClose}
      variant="form"
      size="4xl"
      title={`Nueva Asignación ${poCode ? `— Orden ${poCode}` : ""}`}
      description="Registra la información de mercancía, tipo de destino y almacén para la orden."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col min-w-0">
            <InputText
              label="Mercancía"
              labelClassName={labelClassName}
              placeholder="Ej. Contenedor 40ft / Mercancía General"
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
              placeholder="Seleccionar almacén"
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
            placeholder="Descripción detallada de la carga o embalaje"
            value={merchandiseDescription}
            onChange={(e) => setMerchandiseDescription(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Textarea
            label="Observaciones"
            labelClassName={labelClassName}
            placeholder="Observaciones adicionales sobre la asignación..."
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className={inputClassName}
          />
        </div>

        {/* Separador de footer */}
        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mt-2" />

        {/* Botones de acción estándar */}
        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleClose}
            disabled={CreateAssignment.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
          />
          <Button
            type="submit"
            size="giant"
            label="Crear Asignación"
            isLoading={CreateAssignment.isPending}
            disabled={CreateAssignment.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
}
