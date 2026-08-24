import { Button } from "@alpac/design-system";
import type { FilterActionsProps } from "@app/shared/components/filters/filter-actions/filter-actions.types";
export function FilterActions({ onClear }: FilterActionsProps) {
  return (
    <>
      <div className="flex flex-col min-w-0">
        <Button
          type="submit"
          size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          label="Aplicar filtros"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <Button
          type="button"
          size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
          label="Limpiar filtros"
          onClick={onClear}
        />
      </div>
    </>
  );
}
