import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Badges,
  Button,
  DataTable,
  DatePicker,
  InputText,
  Modal,
  SectionHeader,
  Textarea,
} from "@alpac/design-system";

import { Loader } from "@app/shared/components/loaders/loader";
import { ImageUploader } from "@app/shared/components/image-uploader/image-uploader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { toApiDate } from "@app/shared/utils/date.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import {
  buttonActionClass,
  buttonCancelClass,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";

import {
  BADGE_COLORS,
  COMPACT_BADGE_CLASS,
} from "../entradas-detail-modal/entradas-detail-modal.constants";
import { formatQuantity } from "../entradas-detail-modal/entradas-detail-modal.utils";
import {
  MAX_INVOICE_NUMBER_LENGTH,
  MAX_OBSERVATIONS_LENGTH,
  resolveEntryItemCostCenterId,
  validateEvidenceImages,
  validateInvoiceDate,
  validateInvoiceNumber,
  validateObservations,
  validateRegisterEntryForm,
} from "./entradas-register-modal.rules";
import type { EntradasRegisterModalProps } from "./entradas-register-modal.types";

import type { DatePickerValue, TableColumn } from "@alpac/design-system";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";
import type { InventoryEntryItemDetail } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

const MAX_EVIDENCE_IMAGES = 5;
const ITEMS_TABLE_WRAPPER_CLASS =
  "[&>div]:h-auto [&>div]:flex-none [&_th]:px-4 [&_td]:px-4 [&_th]:py-3 [&_td]:py-3 [&_th:nth-child(1)]:w-px [&_th:nth-child(2)]:w-px [&_th:nth-child(3)]:w-px";

interface RegisterEntryFormValues {
  invoice_number: string;
  invoice_date: DatePickerValue | null;
  observations: string;
  evidence_images: ImageOutput[];
}

const REGISTER_ENTRY_ITEMS_COLUMNS: TableColumn<InventoryEntryItemDetail>[] = [
  {
    key: "product_code",
    label: "Código",
    render: (item) =>
      item.product_code ? (
        <Badges
          label={item.product_code}
          color={BADGE_COLORS.product}
          className={COMPACT_BADGE_CLASS}
        />
      ) : (
        <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
      ),
  },
  {
    key: "product_name",
    label: "Producto",
    render: (item) => (
      <span className="block w-max max-w-[15rem] whitespace-normal text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
        {item.product_name ?? item.product_code ?? "—"}
      </span>
    ),
  },
  {
    key: "quantity",
    label: "Cantidad",
    render: (item) => (
      <span className="inline-block whitespace-nowrap text-left text-sm font-medium tabular-nums text-slate-700 dark:text-slate-200">
        {formatQuantity(
          item.quantity,
          item.unit_measure_symbol ?? item.unit_measure_name,
        )}
      </span>
    ),
  },
  {
    key: "unit_price",
    label: "Costo unitario",
    render: (item) => (
      <span className="inline-block whitespace-nowrap text-left text-sm tabular-nums text-slate-700 dark:text-slate-200">
        {formatCurrency(item.unit_price)}
      </span>
    ),
  },
  {
    key: "subtotal",
    label: "Total",
    render: (item) => (
      <span className="inline-block whitespace-nowrap text-left text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {formatCurrency((Number(item.quantity) || 0) * (Number(item.unit_price) || 0))}
      </span>
    ),
  },
  {
    key: "cost_center",
    label: "Centro de costo",
    render: (item) => {
      const info = item.cost_center_information;
      const name = info?.cost_center_name ?? item.cost_center_name ?? null;
      const code =
        info?.cost_center_code !== null && info?.cost_center_code !== undefined
          ? String(info.cost_center_code)
          : (item.cost_center_code ?? null);
      const label = name ?? code;

      if (!label) {
        return (
          <Badges
            label="Sin centro asociado"
            color={BADGE_COLORS.neutral}
            className={COMPACT_BADGE_CLASS}
          />
        );
      }

      return (
        <span
          className="inline-flex flex-col gap-0.5 whitespace-nowrap"
          title={info?.description ?? label}
        >
          <Badges
            label={label}
            color={BADGE_COLORS.costCenter}
            className={COMPACT_BADGE_CLASS}
          />
          {code && name && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Código: {code}
            </span>
          )}
        </span>
      );
    },
  },
];

export const EntradasRegisterModal = function (props: EntradasRegisterModalProps) {
  const { isOpen, entry, onClose, onRegistered, onError } = props;
  const { companyId, moduleCode } = useUserStore();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEntryFormValues>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      invoice_number: "",
      invoice_date: null,
      observations: "",
      evidence_images: [],
    },
  });

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

  const detail = GetInventoryEntryDetailQuery.data ?? null;
  const items = useMemo(() => detail?.items ?? [], [detail?.items]);
  const isLoadingDetail =
    GetInventoryEntryDetailQuery.isPending || GetInventoryEntryDetailQuery.isFetching;

  const hasUnassignedCostCenter = useMemo(
    () =>
      items.some(
        (item) => !item.purchase_order_item_id || !resolveEntryItemCostCenterId(item),
      ),
    [items],
  );

  const handleClose = () => {
    if (RegisterInventoryEntry.isPending) return;
    onClose();
  };

  const onSubmit = async (values: RegisterEntryFormValues) => {
    if (!entry) return;

    const validation = validateRegisterEntryForm({
      invoiceNumber: values.invoice_number,
      invoiceDate: values.invoice_date,
      observations: values.observations,
      hasEvidence: values.evidence_images.length > 0,
      items,
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
        invoice_number: values.invoice_number.trim(),
        invoice_date: toApiDate(values.invoice_date),
        observations: values.observations.trim() || null,
        evidence_images_base64: values.evidence_images.map((image) => image.base64),
        items: items.map((item) => ({
          purchase_order_item_id: item.purchase_order_item_id ?? "",
        })),
      });

      onRegistered(registered);
    } catch (error) {
      onError(error);
    }
  };

  const isProcessed = entry
    ? EntryStatus[entry.entry_status]?.value !== EntryStatus.PendingReview.value
    : false;

  const statusVariant = detail ? EntryStatus[detail.entry_status] : undefined;

  const itemsCountBadge = (
    <Badges
      label={`${items.length} ${items.length === 1 ? "ítem" : "ítems"}`}
      color={BADGE_COLORS.neutral}
      className={COMPACT_BADGE_CLASS}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar entrada de inventario"
      description="Completa los datos de la factura y adjunta la evidencia para procesar la entrada y actualizar el costo promedio ponderado en Kardex."
      variant="form"
      size="5xl"
      panelClassName="flex max-h-[min(calc(100dvh-2rem),58rem)] flex-col rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {isLoadingDetail ? (
        <div className="py-8">
          <Loader title="Cargando información de la entrada..." />
        </div>
      ) : !detail ? (
        <Alert
          type="info"
          title="Sin información"
          message="No se encontró información de la entrada de inventario."
        />
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <SectionHeader
            title={detail.code ?? "Entrada de inventario"}
            subtitle={detail.supplier_name ?? undefined}
          >
            {statusVariant && (
              <Badges
                label={statusVariant.label}
                color={statusVariant.badgeColor}
                className="whitespace-nowrap"
              />
            )}
            {detail.purchase_request_code && (
              <Badges
                label={`Solicitud: ${detail.purchase_request_code}`}
                color={BADGE_COLORS.request}
                className="whitespace-nowrap"
              />
            )}
          </SectionHeader>

          {isProcessed && (
            <Alert
              type="success"
              title="Entrada procesada"
              message="Esta entrada ya fue procesada y no puede editarse ni reprocesarse."
            />
          )}

          {hasUnassignedCostCenter && (
            <Alert
              type="warning"
              title="Centro de costo pendiente en catálogo"
              message="Uno o más productos no tienen un centro de costo asociado en su catálogo. Verifica la configuración del producto antes de registrar la entrada."
            />
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
              label="Número de factura"
              placeholder="FAC-0001"
              maxLength={MAX_INVOICE_NUMBER_LENGTH}
              isRequired
              error={errors.invoice_number?.message}
              errorVariant="text"
              aria-invalid={Boolean(errors.invoice_number)}
              disabled={isProcessed || RegisterInventoryEntry.isPending}
              className={inputClassName}
              labelClassName={labelClassName}
              {...register("invoice_number", {
                onChange: () => setFormError(null),
                validate: validateInvoiceNumber,
              })}
            />

            <Controller
              name="invoice_date"
              control={control}
              rules={{
                validate: validateInvoiceDate,
              }}
              render={({ field }) => (
                <DatePicker
                  label="Fecha de factura"
                  labelAbove
                  disableFuture
                  format="DD/MM/YYYY"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setFormError(null);
                  }}
                  error={errors.invoice_date?.message}
                  errorVariant="text"
                  disabled={isProcessed || RegisterInventoryEntry.isPending}
                  className={inputClassName}
                  slotProps={{
                    popper: {
                      disablePortal: false,
                      sx: { zIndex: 2000 },
                    },
                  }}
                />
              )}
            />
          </section>

          <Textarea
            label="Observaciones"
            placeholder="Observaciones adicionales (opcional)"
            disabled={isProcessed || RegisterInventoryEntry.isPending}
            maxLength={MAX_OBSERVATIONS_LENGTH}
            enableCharacterCount
            error={errors.observations?.message}
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("observations", {
              onChange: () => setFormError(null),
              validate: validateObservations,
            })}
          />

          <Controller
            name="evidence_images"
            control={control}
            rules={{
              validate: (images) => validateEvidenceImages(images?.length ?? 0),
            }}
            render={({ field }) => (
              <ImageUploader
                label="Evidencia de la factura"
                description="Adjunta al menos una imagen de la factura. Formatos permitidos: JPG, PNG, WEBP."
                value={field.value}
                onChange={(nextImages) => {
                  field.onChange(nextImages);
                  setFormError(null);
                }}
                error={errors.evidence_images?.message ?? null}
                maxFiles={MAX_EVIDENCE_IMAGES}
                minFiles={1}
                isRequired
                maxSizeMB={5}
              />
            )}
          />

          <div className={ITEMS_TABLE_WRAPPER_CLASS}>
            <DataTable<InventoryEntryItemDetail>
              title="Ítems de la entrada"
              data={items}
              columns={REGISTER_ENTRY_ITEMS_COLUMNS}
              getRowKey={(item) => item.purchase_order_item_id ?? item.product_id}
              maxHeight="none"
              toolbarEnd={itemsCountBadge}
            />
          </div>

          <Alert
            type="info"
            title="Actualización de existencias y Kardex"
            message="Al registrar la entrada se cargarán las unidades al centro de costo asociado a cada producto, recalculando automáticamente el costo promedio ponderado en stock y Kardex."
          />

          {formError && (
            <Alert
              type="error"
              title="Validación de la entrada"
              message={formError}
            />
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-neutral-600">
            <Button
              type="button"
              label="Cancelar"
              onClick={handleClose}
              disabled={RegisterInventoryEntry.isPending}
              className={buttonCancelClass}
            />
            <Button
              type="submit"
              label="Registrar entrada"
              isLoading={RegisterInventoryEntry.isPending}
              disabled={
                isProcessed ||
                hasUnassignedCostCenter ||
                RegisterInventoryEntry.isPending ||
                isLoadingDetail
              }
              className={buttonActionClass}
            />
          </div>
        </form>
      )}
    </Modal>
  );
};
