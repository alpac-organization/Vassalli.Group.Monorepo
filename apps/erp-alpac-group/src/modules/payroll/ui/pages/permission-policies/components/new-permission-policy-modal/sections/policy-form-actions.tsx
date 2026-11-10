import { useFormState } from "react-hook-form";
import { Button } from "@alpac/design-system";

type PolicyFormActionsProps = {
  isPending: boolean;
  submitLabel: string;
  requireDirty?: boolean;
  onCancel: () => void;
};

export function PolicyFormActions({
  isPending,
  submitLabel,
  requireDirty = false,
  onCancel,
}: PolicyFormActionsProps) {
  const { isValid, isDirty } = useFormState();

  return (
    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        size="giant"
        label="Cancelar"
        disabled={isPending}
        className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
        onClick={onCancel}
      />
      <Button
        type="submit"
        size="giant"
        label={submitLabel}
        disabled={!isValid || isPending || (requireDirty && !isDirty)}
        className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
      />
    </div>
  );
}
