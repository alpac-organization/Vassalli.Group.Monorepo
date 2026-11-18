import { Badges, DataTable, Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { ModalInfoField } from "@app/shared/components/modal-info-field/modal-info-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { EntryType } from "@app/core/enums/entry-type.enum";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { ENTRY_STATUS_BADGE_CLASS_NAME } from "../../entradas.constants";

import type { TableColumn } from "@alpac/design-system";
import type { InventoryEntryPurchaseRequestItem } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { EntradasDetailModalProps } from "./entradas-detail-modal.types";

const ITEMS_COLUMNS: TableColumn<InventoryEntryPurchaseRequestItem>[] = [
  {
    key: "product_name",
    label: "Producto",
    render: (item) => (
      <span>{item.product_name ?? item.product_code ?? "—"}</span>
    ),
  },
  {
    key: "quantity",
    label: "Cantidad",
    render: (item) => <span className="font-medium">{item.quantity}</span>,
  },
  {
    key: "unit_measure_symbol",
    label: "Unidad",
    render: (item) => (
      <span>{item.unit_measure_symbol ?? item.unit_measure_name ?? "—"}</span>
    ),
  },
  {
    key: "description",
    label: "Descripción",
    render: (item) => <span>{item.description ?? "—"}</span>,
  },
];

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const getPurchaseRequestStatusLabel = (status?: string | null) => {
  if (!status) return "—";
  const match = Object.values(PurchaseRequestStatusEnum).find(
    (item) => item.textValue === status,
  );
  return match?.label ?? status;
};

export const EntradasDetailModal = function (props: EntradasDetailModalProps) {
  const { isOpen, onClose, entry } = props;
  const { companyId, moduleCode } = useUserStore();

  const { GetInventoryEntryDetailQuery } = useInventoryEntries({
    payloadGetInventoryEntryDetailRequest:
      isOpen && entry
        ? {
            company_id: companyId,
            module_code: moduleCode,
            inventory_entry_id: entry.inventory_entry_id,
          }
        : undefined,
  });

  const detail = GetInventoryEntryDetailQuery.data ?? null;
  const isLoading =
    GetInventoryEntryDetailQuery.isPending ||
    GetInventoryEntryDetailQuery.isFetching;

  const current = detail ?? entry;
  const branch = current?.branch_information ?? null;
  const workArea = detail?.work_area_information ?? null;
  const purchaseRequest = detail?.purchase_request_information ?? null;
  const items = detail?.purchase_request_items ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de entrada de inventario"
      description="Consulta la información general, la solicitud de compra y los artículos de la entrada."
      variant="default"
      size="5xl"
    >
      {isLoading ? (
        <div className="py-8">
          <Loader title="Cargando detalle de la entrada..." />
        </div>
      ) : !current ? (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          No se encontró información de la entrada.
        </span>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badges
              color="info"
              className="bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700"
              label={current.code ?? "Entrada de inventario"}
            />
            <Badges
              color="info"
              className={ENTRY_STATUS_BADGE_CLASS_NAME[current.entry_status]}
              label={EntryStatus[current.entry_status]?.label ?? ""}
            />
            {detail && (
              <Badges
                color="info"
                className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                label={EntryType[detail.entry_type]?.label ?? "—"}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-600 pt-4 dark:border-neutral-600">
            <h3 className="text-sm font-semibold text-slate-200">
              Información general
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ModalInfoField label="CÓDIGO" value={current.code ?? "—"} />
              <ModalInfoField
                label="ESTADO"
                value={EntryStatus[current.entry_status]?.label ?? "—"}
              />
              {detail && (
                <ModalInfoField
                  label="TIPO DE ENTRADA"
                  value={EntryType[detail.entry_type]?.label ?? "—"}
                />
              )}
              <ModalInfoField
                label="SUCURSAL"
                value={branch?.branch_name ?? "—"}
              />
              <ModalInfoField
                label="CÓDIGO DE SUCURSAL"
                value={branch?.branch_code ?? "—"}
              />
              <ModalInfoField
                label="ALIAS DE LA COMPAÑÍA"
                value={branch?.company_alias ?? "—"}
              />
              {workArea && (
                <ModalInfoField
                  label="ÁREA DE TRABAJO"
                  value={workArea.work_area_name ?? "—"}
                />
              )}
              {detail && (
                <ModalInfoField
                  label="FECHA DE REGISTRO"
                  value={formatDate(detail.created_at)}
                />
              )}
              <ModalInfoField
                label="ID DE ENTRADA"
                value={current.inventory_entry_id}
              />
            </div>
          </div>

          {purchaseRequest && (
            <div className="flex flex-col gap-4 border-t border-slate-600 pt-4 dark:border-neutral-600">
              <h3 className="text-sm font-semibold text-slate-200">
                Solicitud de compra
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ModalInfoField
                  label="CÓDIGO"
                  value={purchaseRequest.code ?? "—"}
                />
                <ModalInfoField
                  label="FECHA DE SOLICITUD"
                  value={formatDate(purchaseRequest.request_date)}
                />
                <ModalInfoField
                  label="ESTADO"
                  value={getPurchaseRequestStatusLabel(
                    purchaseRequest.request_status,
                  )}
                />
              </div>
            </div>
          )}

          {detail && (
            <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">
                  Artículos
                </h3>
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-200">
                  {items.length} ítems
                </span>
              </div>

              <DataTable<InventoryEntryPurchaseRequestItem>
                data={items}
                columns={ITEMS_COLUMNS}
              />
            </div>
          )}

          {detail?.observations && (
            <div className="rounded-md bg-[#303846] p-3">
              <p className="text-[10px] font-semibold text-[#91A0B5]">
                OBSERVACIONES
              </p>
              <p className="text-[13px] text-[#E2E8F0]">{detail.observations}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
