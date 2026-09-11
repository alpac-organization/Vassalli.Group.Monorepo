import { Breadcrumb } from "@alpac/design-system";
import type { LotsHeaderProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-header/types/lots-header";
import { useModulePageHeader } from "@app/shared/hooks/useModulePageHeader";

export function LotsHeader({ warehouseId, sectionId }: LotsHeaderProps) {
  const { activeLogo, breadcrumbItems } = useModulePageHeader((baseUrl) => [
    { label: "Dashboard", url: baseUrl },
    {
      label: "Lista de bodegas",
      url: `${baseUrl}/warehouse-admin/management`,
    },
    {
      label: "Secciones",
      url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}`,
    },
    {
      label: "Tramos",
      url: `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${sectionId}`,
    },
  ]);

  return (
    <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
      <div className="flex justify-start min-w-0 overflow-x-auto">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="flex flex-row justify-between items-start sm:items-center gap-3 min-w-0">
        <div className="flex flex-col justify-center gap-1 sm:gap-2 min-w-0 flex-1">
          <h3 className="p-0! m-0! text-lg sm:text-xl md:text-2xl">
            Tramos de la sección
          </h3>
          <small className="text-gray-500 dark:text-gray-300">
            Consulte y registre tramos de la sección seleccionada
          </small>
        </div>
        {activeLogo && (
          <img
            className="h-10 sm:h-16 md:h-20 w-auto max-w-[35%] sm:max-w-none object-contain shrink-0 self-start sm:self-center"
            src={activeLogo}
            alt="vassalli group"
          />
        )}
      </div>
    </div>
  );
}