import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Dropdown, useTheme } from "@alpac/design-system";
import { AVAILABLE_BODEGAS } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/data/bodega-2-fiscal.layout";
interface SelectBodegaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bodega: { id: string; name: string }) => void;
  allowDismiss: boolean;
  initialBodegaId?: string | null;
}
export function SelectBodegaModal({
  isOpen,
  onClose,
  onSelect,
  allowDismiss,
  initialBodegaId = null,
}: SelectBodegaModalProps) {
  const { theme } = useTheme();
  const [tempBodegaId, setTempBodegaId] = useState<string | null>(
    initialBodegaId,
  );

  const bodegaOptions = useMemo(
    () =>
      AVAILABLE_BODEGAS.map((bodega) => ({
        label: bodega.name,
        value: bodega.id,
      })),
    [],
  );

  useEffect(() => {
    if (isOpen) {
      setTempBodegaId(initialBodegaId);
    }
  }, [isOpen, initialBodegaId]);

  const handleConfirm = () => {
    if (!tempBodegaId) return;
    const bodega = AVAILABLE_BODEGAS.find((b) => b.id === tempBodegaId);
    if (!bodega) return;
    onSelect(bodega);
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
          placeholder="Seleccione una bodega"
          options={bodegaOptions}
          value={tempBodegaId || undefined}
          appearance={theme === "dark" ? "dark" : "default"}
          labelClassName="text-white!"
          isRequired
          onChange={(value) => setTempBodegaId(String(value))}
        />
      </div>

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
        <Button
          type="button"
          size="giant"
          label="Consultar"
          onClick={handleConfirm}
          disabled={!tempBodegaId}
          className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
        />
        {allowDismiss && (
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={onClose}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        )}
      </div>
    </Modal>
  );
}
