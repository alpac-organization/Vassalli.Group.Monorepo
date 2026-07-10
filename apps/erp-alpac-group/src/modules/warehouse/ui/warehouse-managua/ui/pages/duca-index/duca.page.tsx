import React, { useMemo, useState } from 'react';
import { useTheme } from '@alpac/design-system';
import { useCompanies } from '@app/modules/auth/ui/hooks/useCompanies';
import { useUserStore } from '@app/shared/stores/useUserStore';

// Corrección de Ruta: Subimos un nivel para encontrar el componente hermano del panel
import { DucaHeader } from './components/duca-header';
import { DucaTable } from './components/duca-table/duca-table';
import { useWarehouse, type WarehouseItem } from '../../../context/wareouse-context';
import { DucaDetailModal, type DucaPayload } from './components/duca-detail-modal';

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

  // Manejador del submit unificado con la API de Backend de Managua
  const handleSaveDuca = (payload: DucaPayload) => {
    console.log('Payload listo para ser enviado a ERP.Core.Warehouse.Api:', payload);
    // Aquí se inyectará el fetcher/mutation hacia tu Slice vertical de infraestructura
    
    // Cerramos el modal tras la confirmación
    setSelectedVehicle(null);
  };

  return (
    <div className="space-y-6">
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
          recordEntranceId={selectedVehicle.id} // Vinculación directa con el ID de la fila vehicular
          onSave={handleSaveDuca} // Consume el payload estructurado completo
        />
      )}
    </div>
  );
}