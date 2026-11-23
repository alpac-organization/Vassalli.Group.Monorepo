import { useMemo, useState } from "react";
import { Badges, Button, DataTable, DatePicker, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import { FileCheck2, InfoIcon } from "lucide-react";

import { Loader } from "@app/shared/components/loaders/loader";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { toApiDate } from "@app/shared/utils/date.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { dropdownClassName, inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import { validateRegisterEntryForm } from "./entradas-register-modal.rules";
import type { EntradasRegisterModalProps } from "./entradas-register-modal.types";

import type { TableColumn } from "@alpac/design-system";
import type { DatePickerValue } from "@alpac/design-system";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import type { InventoryEntryItemDetail } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

const MAX_EVIDENCE_IMAGES = 5;

export const EntradasRegisterModal = function (props: EntradasRegisterModalProps) {
  const { isOpen, entry, onClose, onRegistered, onError } = props;
  const { companyId, moduleCode } = useUserStore();

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<DatePickerValue | null>(null);
  const [observations, setObservations] = useState("");
  const [images, setImages] = useState<ImageOutput[]>([]);
  const [costCenters, setCostCenters] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const { GetInventoryEntryDetailQuery, RegisterInventoryEntry } = useInventoryEntries({
    payloadGetInventoryEntryDetailRequest:
      isOpen && entry
        ? {
            company_id: companyId,
            module_code: moduleCode,
            inventory_entry_id: entry.inventory_entry_id,
          }
        : undefined,
  });

  const { GetCostCentersByBranch } = useCostCenters({
    getCostCentersByBranchPayload: {
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const costCenterOptions = useMemo(
    () =>
      (GetCostCentersByBranch.data ?? []).map((costCenter) => ({
        label: costCenter.cost_center_name,
        value: costCenter.cost_center_id,
      })),
    [GetCostCentersByBranch.data],
  );

  const detail = GetInventoryEntryDetailQuery.data ?? null;
  const items = detail?.items ?? [];
  const isLoadingDetail = GetInventoryEntryDetailQuery.isPending || GetInventoryEntryDetailQuery.isFetching;

  const handleCostCenterChange = (purchaseOrderItemId: string, costCenterId: string) => {
    setCostCenters((current) => ({
      ...current,
      [purchaseOrderItemId]: costCenterId,
    }));
    setFormError(null);
  };

  const itemColumns = useMemo<TableColumn<InventoryEntryItemDetail>[]>(
    () => [
      {
        key: "product_name",
        label: "Producto",
        render: (item) => <span>{item.product_name ?? item.product_code ?? "—"}</span>,
      },
      {
        key: "quantity",
        label: "Cantidad",
        render: (item) => <span className="font-medium">{item.quantity}</span>,
      },
      {
        key: "unit_price",
        label: "Costo unitario",
        render: (item) => <span>{formatCurrency(item.unit_price)}</span>,
      },
      {
        key: "cost_center",
        label: "Centro de costo *",
        render: (item) => {
          const itemId = item.purchase_order_item_id ?? "";

          return (
            <Dropdown
              isLoading={GetCostCentersByBranch.isPending || GetCostCentersByBranch.isFetching}
              label="Centro de costo"
              value={costCenters[itemId] ?? ""}
              options={costCenterOptions}
              onChange={(value) => handleCostCenterChange(itemId, String(value ?? ""))}
              placeholder="Seleccionar"
              appearance="dark"
              labelClassName={labelClassName}
              className={dropdownClassName}
            />
          );
        },
      },
    ],
    [costCenters, costCenterOptions, GetCostCentersByBranch.isPending, GetCostCentersByBranch.isFetching],
  );

  const handleClose = () => {
    if (RegisterInventoryEntry.isPending) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!entry) return;

    const validation = validateRegisterEntryForm({
      invoiceNumber,
      hasEvidence: images.length > 0,
      items,
      costCenters,
    });

    if (!validation.isValid) {
      setFormError(validation.errors[0] ?? "Complete la información de la entrada.");
      return;
    }

    try {
      setFormError(null);

      const registered = await RegisterInventoryEntry.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        inventory_entry_id: entry.inventory_entry_id,
        invoice_number: invoiceNumber.trim(),
        invoice_date: toApiDate(invoiceDate),
        observations: observations.trim() || null,
        evidence_images_base64: images.map((image) => image.base64),
        items: items.map((item) => ({
          purchase_order_item_id: item.purchase_order_item_id ?? "",
          cost_center_id: costCenters[item.purchase_order_item_id ?? ""],
        })),
      });

      onRegistered(registered);
    } catch (error) {
      onError(error);
    }
  };

  const isProcessed = entry ? EntryStatus[entry.entry_status]?.value !== EntryStatus.PendingReview.value : false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar entrada de inventario"
      description="Completa la factura, adjunta la evidencia y asigna el centro de costo de cada ítem."
      variant="default"
      size="5xl"
      panelClassName="flex max-h-[min(94dvh,58rem)] flex-col rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto"
    >
      {isLoadingDetail ? (
        <div className="py-8">
          <Loader title="Cargando información de la entrada..." />
        </div>
      ) : !detail ? (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          No se encontró información de la entrada.
        </span>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badges
              color="info"
              className="bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700"
              label={detail.code ?? "Entrada de inventario"}
            />
            <Badges
              color="info"
              className={EntryStatus[detail.entry_status]?.badgeColor}
              label={EntryStatus[detail.entry_status]?.label ?? ""}
            />
          </div>

          {isProcessed && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <FileCheck2 size={18} className="mt-0.5 shrink-0" />
              <span>Esta entrada ya fue procesada y no puede editarse ni reprocesarse.</span>
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
              label="Número de factura"
              placeholder="FAC-0001"
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
              isRequired
              disabled={isProcessed}
              className={inputClassName}
              labelClassName={labelClassName}
            />

            <DatePicker
              label="Fecha de factura"
              labelAbove
              format="DD/MM/YYYY"
              value={invoiceDate}
              onChange={(value) => setInvoiceDate(value)}
              disabled={isProcessed}
              className={inputClassName}
              slotProps={{
                popper: {
                  disablePortal: false,
                  sx: { zIndex: 2000 },
                },
              }}
            />
          </section>

          <Textarea
            label="Observaciones"
            placeholder="Observaciones adicionales (opcional)"
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
            disabled={isProcessed}
            maxLength={500}
            labelClassName={labelClassName}
          />

          <ImageUploader
            label="Evidencia de la factura"
            description="Adjunta al menos una imagen de la factura. Formatos permitidos: JPG, PNG, WEBP."
            value={images}
            onChange={setImages}
            maxFiles={MAX_EVIDENCE_IMAGES}
            minFiles={1}
            isRequired
            maxSizeMB={5}
          />

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Ítems de la entrada</h3>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {items.length} ítems
              </span>
            </div>

            <DataTable<InventoryEntryItemDetail> data={items} columns={itemColumns} />
          </section>

          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-neutral-600 dark:bg-[#272b34] dark:text-slate-300">
            <InfoIcon size={18} className="mt-0.5 shrink-0 text-slate-400" />
            <span>Al registrar la entrada, el estado cambiará a procesada y se actualizará el Kardex.</span>
          </div>

          {formError && (
            <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-neutral-600">
            <Button
              label="Cancelar"
              size="giant"
              onClick={handleClose}
              disabled={RegisterInventoryEntry.isPending}
              className="w-full! sm:w-auto! rounded-md! bg-slate-500! text-white! hover:bg-slate-600! dark:bg-slate-700! dark:hover:bg-slate-600!"
            />
            <Button
              label="Registrar entrada"
              size="giant"
              onClick={() => void handleSubmit()}
              isLoading={RegisterInventoryEntry.isPending}
              disabled={isProcessed || RegisterInventoryEntry.isPending || isLoadingDetail}
              className="w-full! sm:w-auto! rounded-md! bg-blue-600! text-white! hover:bg-blue-700!"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
