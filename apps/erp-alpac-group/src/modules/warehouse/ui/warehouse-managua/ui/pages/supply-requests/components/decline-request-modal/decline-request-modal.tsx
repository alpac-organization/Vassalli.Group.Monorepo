import { Button, Modal } from "@alpac/design-system";

interface DeclineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  observations: string;
  onObservationsChange: (value: string) => void;
  error?: string;
  isPending: boolean;
  onConfirm: () => void;
}

export function DeclineRequestModal({
  isOpen,
  onClose,
  observations,
  onObservationsChange,
  error,
  isPending,
  onConfirm,
}: DeclineRequestModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Anular solicitud"
      description="Ingresa las observaciones de anulación."
      variant="default"
      size="md"
    >
      <div className="flex flex-col gap-3">
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
            label={isPending ? "Anulando..." : "Anular"}
            size="small"
            onClick={() => void onConfirm()}
            disabled={isPending}
            className="bg-red-600! text-white!"
          />
        </div>
      </div>
    </Modal>
  );
}