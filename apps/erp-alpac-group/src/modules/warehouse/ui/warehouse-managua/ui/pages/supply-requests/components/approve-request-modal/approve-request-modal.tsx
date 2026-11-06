import { Button, Dropdown, Modal } from "@alpac/design-system";

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasonOptions: Array<{ value: string; label: string }>;
  isLoadingReasons: boolean;
  selectedReasonId: string;
  onReasonChange: (value: string) => void;
  observations: string;
  onObservationsChange: (value: string) => void;
  error?: string;
  isPending: boolean;
  onConfirm: () => void;
}

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
          onChange={(e: any) => onReasonChange(String(e?.target?.value ?? e ?? ""))}
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