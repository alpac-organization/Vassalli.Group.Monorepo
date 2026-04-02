import { Button } from "@alpac/design-system";
import { CalendarPlus } from "lucide-react";

type VacationPageHeaderProps = {
  onNewRequest?: () => void;
};

export function VacationPageHeader({ onNewRequest }: VacationPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div className="flex flex-col justify-center">
        <h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
          Gestión de Vacaciones
        </h3>
        <small className="text-gray-500 dark:text-gray-300 mt-1">
          Administra las solicitudes de vacaciones de los empleados
        </small>
      </div>
      <Button
        type="button"
        size="giant"
        icon={<CalendarPlus size={18} />}
        label="Nueva Solicitud"
        onClick={onNewRequest}
        className="shrink-0 w-full sm:w-auto! text-[15px]! rounded-md! text-white! bg-neutral-900! hover:bg-neutral-800! dark:bg-neutral-100! dark:text-neutral-900! dark:hover:bg-white!"
      />
    </div>
  );
}
