import { Button } from "@alpac/design-system";
import type { PendingDraft } from "../layout-builder-2d.types";
import { formatDimensions } from "../layout-builder-2d.utils";

interface DraftConfirmationPopoverProps {
  pendingDraft: PendingDraft;
  isValid: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DraftConfirmationPopover = ({
  pendingDraft,
  isValid,
  onConfirm,
  onCancel,
}: DraftConfirmationPopoverProps) => {
  const { draft, screenPosition } = pendingDraft;

  return (
    <div
      className="absolute z-20 flex min-w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-md border border-slate-600 bg-slate-800 p-3 shadow-xl"
      style={{
        left: screenPosition.x,
        top: screenPosition.y,
      }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Área dibujada
        </span>
        <span className="text-sm font-semibold text-slate-100">
          {formatDimensions(draft.width_metres, draft.length_metres)}
        </span>
        <span className="text-xs text-slate-400">
          Posición: X {draft.position_x.toFixed(1)}m · Z {draft.position_z.toFixed(1)}m
        </span>
        {!isValid ? (
          <span className="text-xs text-red-400">
            La posición no es válida. Ajuste el área o cancele.
          </span>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          size="small"
          label="Cancelar"
          onClick={onCancel}
          className="flex-1! rounded-md! border! border-slate-600! bg-transparent! text-slate-300! hover:bg-slate-700!"
        />
        <Button
          type="button"
          size="small"
          label="Confirmar"
          disabled={!isValid}
          onClick={onConfirm}
          className="flex-1! rounded-md! bg-alpac-primary-500! text-white!"
        />
      </div>
    </div>
  );
};
