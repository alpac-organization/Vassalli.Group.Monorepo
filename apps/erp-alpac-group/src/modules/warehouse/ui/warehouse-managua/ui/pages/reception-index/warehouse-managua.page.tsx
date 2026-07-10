import React, { useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@alpac/design-system';
import { useUserStore } from '@app/shared/stores/useUserStore';
import { useCompanies } from '@app/modules/auth/ui/hooks/useCompanies';
import { Breadcrumb, type BreadcrumbProps } from '@alpac/design-system';
import { WarehouseHeader } from './components/warehouse-header';
import { WarehouseProvider } from '../../../context/wareouse-context';
import { GuardPanel } from './components/guard-panel/guard-panel';


export function WarehouseManaguaPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId } = useUserStore();

  // Obtenemos el hook y extraemos los datos de la query de empresas
  const { GetCompaniesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const { data: companiesData } = GetCompaniesQuery;

  const currentCompanyImageUrl = useMemo(() => {
    if (!Array.isArray(companiesData)) return undefined;

    const company = companiesData.find((c) => c.company_id === companyId);

    if (company) {
      const url = theme === "dark" ? company.neutral_image_url : company.image_url;
      return url || undefined;
    }

    const alpac = companiesData.find((c) => c.alias?.toLowerCase() === "alpac");
    const fallbackUrl = theme === "dark" ? alpac?.neutral_image_url : alpac?.image_url;
    return fallbackUrl || undefined;
  }, [companiesData, companyId, theme]);

  return (
    <WarehouseProvider>
      <div className="space-y-6">


        <div className="space-y-6">
          <div className="min-w-0 overflow-x-auto">
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  url: "/dashboard",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Managua",
                  url: "/waaccess-control",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Control de Acceso",
                  url: "/access-control",
                  onClick: (url) => navigate(url),
                },
              ]}
              />
              
          </div>
        </div>


        <WarehouseHeader />

        <GuardPanel />
        {/* Resto de tu UI... */}

      </div>
    </WarehouseProvider>
  );
}

export { WarehouseProvider };