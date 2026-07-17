import { Button } from "@alpac/design-system";
import { FilePlus2 } from "lucide-react";
import type { QuotesActionsProps } from "@app/modules/procurement/ui/pages/quotes/components/quotes-actions/quotes-actions.types";

export function QuotesActions({ onCreateQuote }: QuotesActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Acciones</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Cree una nueva cotización o gestione las existentes
          </small>
        </div>
      </div>

      <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
        <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
          <Button
            type="button"
            size="giant"
            label="Nueva cotización"
            icon={<FilePlus2 size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={onCreateQuote}
          />
        </div>
      </div>
    </div>
  );
}
