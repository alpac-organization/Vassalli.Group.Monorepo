import { Button, Dropdown, Modal } from "@alpac/design-system";

import type { ApproveRequestModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/supply-requests/components/approve-request-modal/types/approve-request-modal.types";

export function ApproveRequestModal({
  isOpen,
  onClose,
  reasonOptions,
  isLoadingReasons,
  selectedReasonId,
  onReasonChange,
  observations,
  onObservationsChange,
  error,
  isPending,
  onConfirm,
}: ApproveRequestModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aprobar solicitud"
      description="Selecciona el motivo de salida de inventario."
      variant="default"
      size="md"
    >
      <div className="flex flex-col gap-3">
        <Dropdown
          label="Motivo de salida"
          value={selectedReasonId}
          options={[{ value: "", label: "Seleccione un motivo" }, ...reasonOptions]}
          onChange={(e: unknown) => onReasonChange(String((e as { target?: { value?: unknown } })?.target?.value ?? e ?? ""))}
          placeholder={isLoadingReasons ? "Cargando..." : "Seleccione un motivo"}
          appearance="dark"
          labelClassName="text-slate-300"
          className="w-full"
          disabled={isLoadingReasons}
        />
        <textarea
          className="min-h-[80px] rounded-md border border-slate-600 bg-[#252B36] p-2 text-sm text-slate-100"
          placeholder="Observaciones (opcional)"
          value={observations}
          onChange={(e) => onObservationsChange(e.target.value)}
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button label="Cancelar" size="small" onClick={onClose} />
          <Button
            label={isPending ? "Aprobando..." : "Aprobar"}
            size="small"
            onClick={() => void onConfirm()}
            disabled={!selectedReasonId || isPending}
            className="bg-blue-600! text-white!"
          />
        </div>
      </div>
    </Modal>
  );
}