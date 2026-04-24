import { useTheme } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { PermissionPageHeaderProps } from "@app/modules/payroll/ui/pages/permissions/components/permission-page-header/types/permission-header.type";

export function PermissionPageHeader({
  collaboratorDisplayName,
}: PermissionPageHeaderProps) {
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { companyName } = useUserStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const subtitle =
    collaboratorDisplayName?.trim() || "permisos de los empleados";
  const logoAlt = companyName ? `Logo ${companyName}` : "Logo de la empresa";

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex min-w-0 flex-col justify-center">
          <h3 className="p-0! m-0! text-xl font-semibold text-neutral-900 dark:text-white">
            Gestión de permisos
          </h3>
          <small className="mt-1 text-gray-500 dark:text-gray-300">
            {subtitle}
          </small>
        </div>
        <img
          src={activeLogo}
          alt={logoAlt}
          className="h-12 sm:h-16 md:h-20 w-auto object-contain shrink-0"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
