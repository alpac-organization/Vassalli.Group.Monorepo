import { Button } from "@alpac/design-system";
import { PlusIcon } from "lucide-react";
import { actionPrimaryButtonClassName } from "../../utils/personnel-actions.constants";

interface PersonnelActionsHeaderProps {
  onNewRequest: () => void;
  canCreate: boolean;
  activeLogo: string;
}

export const PersonnelActionsHeader = ({
  onNewRequest,
  canCreate,
  activeLogo,
}: PersonnelActionsHeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col justify-center">
          <h3 className="m-0! p-0!">Solicitudes del Personal</h3>
          <small className="mt-2 text-gray-500 dark:text-gray-300">
            Gestión de incrementos de salario, promociones de cargo y reubicación de centros de costo
          </small>
        </div>
        <div className="flex items-center gap-4">
          {canCreate && (
            <Button
              label="Nueva Solicitud"
              icon={<PlusIcon size={18} />}
              size="giant"
              className={`${actionPrimaryButtonClassName} w-auto!`}
              onClick={onNewRequest}
            />
          )}
          <img
            className="h-12 w-auto object-contain sm:h-16 md:h-20"
            src={activeLogo}
            alt="Logo Empresa"
          />
        </div>
      </div>
    </div>
  );
};
