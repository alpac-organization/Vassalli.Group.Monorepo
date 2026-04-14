import { Button, useTheme } from "@alpac/design-system";
import { CalendarPlus } from "lucide-react";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { PermissionPageHeaderProps } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-page-header/types/permission-header.type";

export function PermissionPageHeader({
  onNewRequest,
  collaboratorDisplayName,
}: PermissionPageHeaderProps) {
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { companyName } = useUserStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const subtitle =
    collaboratorDisplayName?.trim() || "permisos de los empleados";
  const logoAlt = companyName ? `Logo ${companyName}` : "Logo de la empresa";

  const titleBlock = (
    <div className="flex min-w-0 flex-col justify-center">
      <h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
        Gestión de permisos
      </h3>
      <small className="mt-1 text-gray-500 dark:text-gray-300">
        {subtitle}
      </small>
    </div>
  );

  return (
    <div className="w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:hidden">
        {titleBlock}
        <div className="flex w-full flex-col items-center gap-3 px-1">
          <img
            src={activeLogo}
            alt={logoAlt}
            className="h-auto max-h-14 w-auto max-w-[min(100%,14rem)] shrink-0 object-contain object-center sm:max-h-18 sm:max-w-[min(100%,17rem)]"
            sizes="(max-width: 640px) 224px, 280px"
            loading="lazy"
            decoding="async"
          />
          <Button
            type="button"
            size="giant"
            icon={<CalendarPlus size={18} />}
            label="Nueva Solicitud"
            onClick={onNewRequest}
            className="w-full max-w-full shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </div>

      <div className="hidden min-w-0 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">{titleBlock}</div>
        <div className="flex shrink-0 flex-col items-end gap-3">
          <img
            src={activeLogo}
            alt={logoAlt}
            className="h-auto max-h-14 w-auto max-w-[min(100%,14rem)] shrink-0 object-contain object-center sm:max-h-18 sm:max-w-[min(100%,17rem)]"
            sizes="(max-width: 640px) 224px, 280px"
            loading="lazy"
            decoding="async"
          />
          <Button
            type="button"
            size="giant"
            icon={<CalendarPlus size={18} />}
            label="Nueva Solicitud"
            onClick={onNewRequest}
            className="w-full max-w-full shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </div>
    </div>
  );
}
