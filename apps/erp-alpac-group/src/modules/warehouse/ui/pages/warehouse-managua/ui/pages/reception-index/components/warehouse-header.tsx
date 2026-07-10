// apps/erp-alpac-group/src/modules/warehouse/ui/layout/WarehouseLayout.tsx
import React, { useContext, useMemo } from 'react';
import { useCompanies } from '@app/modules/auth/ui/hooks/useCompanies';
import { useUserStore } from '@app/shared/stores/useUserStore';
import { useTheme } from '@alpac/design-system';
import { WarehouseContext } from '../../../../context/wareouse-context';

export function WarehouseHeader() {
  const { companyId } = useUserStore();
  const { theme } = useTheme();
  const { GetCompaniesQuery } = useCompanies(companyId ? { company_id: companyId } : undefined);
  const { data: companiesData } = GetCompaniesQuery;

  const context = useContext(WarehouseContext);

  console.log(context )

  const currentCompanyImageUrl = useMemo(() => {
    if (!Array.isArray(companiesData)) return undefined;
    const company = companiesData.find((c) => c.company_id === companyId);
    if (company) return theme === "dark" ? company.neutral_image_url : company.image_url;
    const alpac = companiesData.find((c) => c.alias?.toLowerCase() === "alpac");
    return theme === "dark" ? alpac?.neutral_image_url : alpac?.image_url;
  }, [companiesData, companyId, theme]);

  return (
    <div>
     {/* Contenedor principal para el texto a la izquierda y logo a la derecha */}
      <div className="flex justify-between items-center">
        {/* Bloque de texto a la izquierda */}
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0! text-xl font-bold">Ingreso Vehicular</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Control de Acceso, Patio y Gestión de Cola
          </small>
        </div>

        {/* Logo a la derecha */}
        {currentCompanyImageUrl && (
          <div className="flex items-center">
            <img src={currentCompanyImageUrl} alt="Logo Corporativo" className="h-15 object-contain" />
          </div>
        )}
      </div>
</div>
  );
};