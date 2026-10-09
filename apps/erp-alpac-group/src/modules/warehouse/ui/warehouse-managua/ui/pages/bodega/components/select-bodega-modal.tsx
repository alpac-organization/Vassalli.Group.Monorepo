import { useMemo, useState } from "react";
import { Modal, Button, Dropdown } from "@alpac/design-system";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

interface SelectBodegaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bodega: { id: string; name: string }) => void;
  allowDismiss: boolean;
  initialBodegaId?: string | null;
  warehouses?: WarehouseDto[];
  isLoadingWarehouses?: boolean;
}

export function SelectBodegaModal({
  isOpen,
  onClose,
  onSelect,
  allowDismiss,
  initialBodegaId = null,
  warehouses = [],
  isLoadingWarehouses = false,
}: SelectBodegaModalProps) {
  const [tempBodegaId, setTempBodegaId] = useState<string | null>(
    initialBodegaId,
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialId, setPrevInitialId] = useState(initialBodegaId);

  if (isOpen !== prevIsOpen || initialBodegaId !== prevInitialId) {
    setPrevIsOpen(isOpen);
    setPrevInitialId(initialBodegaId);
    if (isOpen) {
      setTempBodegaId(initialBodegaId);
    }
  }

  const bodegaOptions = useMemo(
    () =>
      warehouses.map((bodega) => ({
        label: bodega.code || "Bodega",
        value: bodega.warehouse_id,
      })),
    [warehouses],
  );

  const handleConfirm = () => {
    if (!tempBodegaId) return;
    const bodega = warehouses.find((b) => b.warehouse_id === tempBodegaId);
    if (!bodega) return;
    onSelect({
      id: bodega.warehouse_id,
      name: bodega.code || "Bodega",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (allowDismiss) onClose();
      }}
      variant="default"
      size="sm"
      title="Seleccionar bodega"
      description="Por favor, seleccione la bodega que desea inspeccionar en la vista 3D."
      closeButtonClassName={
        allowDismiss ? undefined : "pointer-events-none opacity-0"
      }
    >
      <div className="mt-4 flex flex-col gap-4">
        <Dropdown
          label="Bodega"
          appearance="dark"
          options={bodegaOptions}
          value={tempBodegaId || undefined}
          onChange={(val) => setTempBodegaId(val)}
          placeholder={isLoadingWarehouses ? "Cargando bodegas..." : "Selecciona una bodega"}
          disabled={isLoadingWarehouses || bodegaOptions.length === 0}
        />

        <div className="flex justify-end gap-2 pt-2">
          {allowDismiss && (
            <Button
              type="button"
              size="medium"
              label="Cancelar"
              onClick={onClose}
              className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
            />
          )}
          <Button
            type="button"
            size="medium"
            label="Confirmar Selección"
            disabled={!tempBodegaId}
            onClick={handleConfirm}
            className="rounded-md bg-alpac-primary-500 text-white"
          />
        </div>
      </div>
    </Modal>
  );
}
