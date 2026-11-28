import { useCallback, useState } from "react";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";
import {
   BadgeDollarSignIcon,
   FileWarningIcon,
   PackageMinusIcon,
   PackageXIcon,
} from "lucide-react";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { RoleEnum } from "@app/core/enums/role.enum";
import { AnnulModal } from "@app/shared/components/annul-modal/annul-modal";
import type { AnnulPresetReasonItem } from "@app/shared/components/annul-modal/annul-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import { EntradasSectionFilters } from "./components/entradas-section-filters/entradas-section-filters";
import { EntradasDetailModal } from "./components/entradas-detail-modal/entradas-detail-modal";
import { EntradasRegisterModal } from "./components/entradas-register-modal/entradas-register-modal";
import { DEFAULT_ENTRADAS_FILTERS } from "./entradas.types";
import { GetInventoryEntriesColumnsToTable } from "./entradas.variants";

import type { EntradasFilters } from "./entradas.types";
import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

const ENTRY_ANNUL_PRESET_REASONS: readonly AnnulPresetReasonItem[] = [
   {
      id: "short-quantity",
      title: "Cantidad menor a la solicitada",
      description: "Las unidades físicas recibidas son menores a la orden de compra.",
      value: "La cantidad física recibida es menor a la solicitada en la orden de compra.",
      icon: <PackageMinusIcon size={18} />,
   },
   {
      id: "price-mismatch",
      title: "Diferencia de precio en factura",
      description: "El costo unitario o total facturado no coincide con la orden aprobada.",
      value: "El precio unitario de la factura no coincide con el monto aprobado en la orden de compra.",
      icon: <BadgeDollarSignIcon size={18} />,
   },
   {
      id: "damaged-product",
      title: "Producto dañado o inconforme",
      description: "Mercadería en mal estado o fuera de especificación técnica.",
      value: "El producto recibido presenta daños o no cumple con las especificaciones solicitadas.",
      icon: <PackageXIcon size={18} />,
   },
   {
      id: "invoice-inconsistency",
      title: "Inconsistencia documental",
      description: "Datos de factura, proveedor o artículos distintos a la requisición.",
      value: "Inconsistencia en los datos de la factura respecto a la requisición y orden de compra.",
      icon: <FileWarningIcon size={18} />,
   },
];

export const Entradas = function () {
   const { companyId, moduleCode, role } = useUserStore();
   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const isManager = role === RoleEnum.MANAGER;
   const canFilterByArea = isAdministrator || isManager;
   const canAnnulEntry = isAdministrator || isManager;

   const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();
   const [filters, setFilters] = useState<EntradasFilters>(DEFAULT_ENTRADAS_FILTERS);
   const [selectedEntry, setSelectedEntry] = useState<InventoryEntry | null>(null);
   const [entryToRegister, setEntryToRegister] = useState<InventoryEntry | null>(null);
   const [entryToAnnul, setEntryToAnnul] = useState<InventoryEntry | null>(null);

   const { GetInventoryEntriesQuery, AnnulInventoryEntry } = useInventoryEntries({
      payloadGetInventoryEntriesRequest: {
         company_id: companyId,
         module_code: moduleCode,
         ...filters,
         branch_id: isAdministrator ? filters.branch_id : undefined,
         work_area_id: canFilterByArea ? filters.work_area_id : undefined,
         page_number: filters.page_number ?? 1,
         page_size: filters.page_size ?? 10,
      },
   });

   const { data, isPending, isFetching } = GetInventoryEntriesQuery;

   const columns = GetInventoryEntriesColumnsToTable({
      ActionsMenuContext: {
         canAnnulEntry,
         onViewEntry: setSelectedEntry,
         onRegisterEntry: setEntryToRegister,
         onAnnulEntry: setEntryToAnnul,
      },
   });

   const handleApplyFilters = (newFilters: EntradasFilters) => {
      setFilters({ ...newFilters, page_number: 1 });
   };

   const handleClearFilters = () => {
      setFilters(DEFAULT_ENTRADAS_FILTERS);
   };

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({
         ...prev,
         page_number: page,
      }));
   }, []);

   return (
      <div className="flex flex-col gap-5 bg-transparent">
         <SectionHeader
            title="Filtros de búsqueda"
            subtitle="Utiliza los filtros de búsqueda para una búsqueda más rápida."
         />

         <EntradasSectionFilters
            filters={filters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
         />

         <DataTable
            isLoading={isPending || isFetching}
            title="Entradas de inventario"
            data={data?.data ?? []}
            columns={columns}
            pagination={
               <Pagination
                  pageSize={data?.page_size ?? 0}
                  totalRecords={data?.total ?? 0}
                  currentPage={data?.page_number ?? 0}
                  onPageChange={handlePageChange}
               />
            }
         />
         
          <EntradasDetailModal
             isOpen={Boolean(selectedEntry)}
             onClose={() => setSelectedEntry(null)}
             entry={selectedEntry}
          />

          <EntradasRegisterModal
             key={entryToRegister?.inventory_entry_id ?? "closed"}
             isOpen={Boolean(entryToRegister)}
             entry={entryToRegister}
             canAnnul={canAnnulEntry}
             onClose={() => setEntryToRegister(null)}
             onRegistered={(registered) => {
                handleRequestSuccess(
                   `La entrada ${registered.code?.toUpperCase() ?? ""} fue registrada correctamente.`.trim(),
                );
                setEntryToRegister(null);
             }}
             onRequestAnnul={(entry) => setEntryToAnnul(entry)}
             onError={(error) =>
                handleRequestError(error, "No se pudo registrar la entrada de inventario.")
             }
          />

          <AnnulModal
             isOpen={Boolean(entryToAnnul)}
             title={`Anular entrada ${entryToAnnul?.code?.toUpperCase() ?? ""}`.trim()}
             description="Indique el motivo por el cual no procede la recepción (por ejemplo, diferencia en cantidades o precio respecto a la factura). La entrada quedará cancelada y la requisición asociada quedará como anulada con este motivo."
             showScopeSelection={false}
             presetReasons={ENTRY_ANNUL_PRESET_REASONS}
             isSubmitting={AnnulInventoryEntry.isPending}
             confirmButtonLabel="Anular entrada"
             confirmButtonVariant="danger"
             onClose={() => setEntryToAnnul(null)}
             onConfirm={async ({ reason }) => {
                if (!entryToAnnul) return;

                try {
                   const annulled = await AnnulInventoryEntry.mutateAsync({
                      company_id: companyId,
                      module_code: moduleCode,
                      inventory_entry_id: entryToAnnul.inventory_entry_id,
                      reason,
                   });

                   setEntryToAnnul(null);
                   if (entryToRegister?.inventory_entry_id === annulled.inventory_entry_id) {
                      setEntryToRegister(null);
                   }

                   const entryLabel = annulled.code ? ` ${annulled.code.toUpperCase()}` : "";
                   const requestLabel = annulled.purchase_request_code
                      ? ` (${annulled.purchase_request_code.toUpperCase()})`
                      : "";

                   handleRequestSuccess(
                      `La entrada${entryLabel} fue descartada sin afectar existencias y su requisición asociada${requestLabel} quedó cancelada con el motivo registrado.`,
                      "Entrada de inventario anulada",
                   );
                } catch (error) {
                   handleRequestError(error, "No se pudo anular la entrada de inventario.");
                }
             }}
          />

          {AlertComponent}
       </div>
   );
};
