// apps/erp-alpac-group/src/modules/warehouse/ui/layout/WarehouseLayout.tsx
import React, { useMemo } from 'react';
import { useCompanies } from '@app/modules/auth/ui/hooks/useCompanies';
import { useUserStore } from '@app/shared/stores/useUserStore';
import { useTheme } from '@alpac/design-system';

export const WarehouseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { companyId } = useUserStore();
  const { theme } = useTheme();
  const { GetCompaniesQuery } = useCompanies(companyId ? { company_id: companyId } : undefined);
  const { data: companiesData } = GetCompaniesQuery;

  const currentCompanyImageUrl = useMemo(() => {
    if (!Array.isArray(companiesData)) return undefined;
    const company = companiesData.find((c) => c.company_id === companyId);
    if (company) return theme === "dark" ? company.neutral_image_url : company.image_url;
    const alpac = companiesData.find((c) => c.alias?.toLowerCase() === "alpac");
    return theme === "dark" ? alpac?.neutral_image_url : alpac?.image_url;
  }, [companiesData, companyId, theme]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Global que se repite en todas las páginas */}
      <header className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {currentCompanyImageUrl && <img src={currentCompanyImageUrl} className="h-8 mr-4" />}
          <h1 className="text-xl font-bold">Warehouse Managua</h1>
        </div>
        {/* Aquí van tus otros componentes generales tipo Payroll */}
        <div className="flex items-center gap-4">
            {/* Componentes transversales */}
        </div>
      </header>

      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
};