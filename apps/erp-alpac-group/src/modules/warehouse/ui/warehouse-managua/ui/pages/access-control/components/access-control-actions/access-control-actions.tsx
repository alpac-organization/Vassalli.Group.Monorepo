import { Button } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import type { AccessControlActionsProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-actions/types/access-control-action";

export function AccessControlActions({
  onGiveEntry,
}: AccessControlActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center flex-wrap">
          <h3 className="p-0! m-0!">Acciones</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Aqui Puedes Realizar Operaciones de ingreso vehicular
          </small>
        </div>
      </div>

      <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
        <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
          <Button
            size="giant"
            label="Agregar a la cola de entrada"
            icon={<PlusIcon size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={onGiveEntry}
          />
        </div>
      </div>
    </div>
  );
}
