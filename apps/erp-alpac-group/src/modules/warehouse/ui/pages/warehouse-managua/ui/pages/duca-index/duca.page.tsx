// apps/erp-alpac-group/src/modules/warehouse/ui/pages/warehouse-managua/ui/pages/ducas-index/components/duca-panel/duca-panel.tsx
import React, { useMemo, useState } from 'react';
import { useTheme } from '@alpac/design-system';
import { useWarehouse, type WarehouseItem } from '@app/modules/warehouse/ui/pages/warehouse-managua/context/wareouse-context';
import { useCompanies } from '@app/modules/auth/ui/hooks/useCompanies';
import { useUserStore } from '@app/shared/stores/useUserStore';

import { DucaDetailModal } from './components/duca-detail-modal';
import { DucaHeader } from './components/duca-header';
import { DucaTable } from './components/duca-table/duca-table';

export function DucaPanel() {
  const { theme } = useTheme();
  const { companyId } = useUserStore();
  const { itemsQueue, ducaList } = useWarehouse();
  const [selectedVehicle, setSelectedVehicle] = useState<WarehouseItem | null>(null);

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
    <div className="space-y-6">
      {/* Pasamos el logo como prop */}
      <DucaHeader logoUrl={currentCompanyImageUrl} />

      <div className="bg-[#121726] p-6 rounded-xl border border-slate-800 shadow-2xl space-y-5">
        <DucaTable 
          itemsQueue={itemsQueue}
          ducaList={ducaList} 
          onSelect={setSelectedVehicle} 
        />
      </div>

      {selectedVehicle && (
        <DucaDetailModal 
          isOpen={true}
          onClose={() => setSelectedVehicle(null)} 
          onSave={(duca: string) => console.log('Guardar:', duca)} 
        />
      )}
    </div>
  );
}