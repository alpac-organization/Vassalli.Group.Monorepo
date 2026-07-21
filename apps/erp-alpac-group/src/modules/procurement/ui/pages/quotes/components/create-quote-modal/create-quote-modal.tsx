import { useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  AccordionGroup,
  Button,
  DatePicker,
  Dropdown,
  InputText,
  Modal,
  Textarea,
} from "@alpac/design-system";
import { ListChecks, Plus, SaveIcon, XIcon } from "lucide-react";
import dayjs from "dayjs";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { useSuppliers } from "@app/modules/procurement/ui/hooks/suppliers/useSuppliers";
import type { GetSuppliersResponse } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers-response";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { CreateQuoteModalProps } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-modal.types";
import {
  createEmptyProduct,
  createEmptySupplier,
  createQuoteDefaultValues,
  type CreateQuoteFormValues,
  type SupplierQuoteFormValues,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { SupplierQuoteAccordion } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/supplier-quote-accordion";
import { SelectSupplierModal } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/select-supplier-modal";
import { mapCreateQuoteFormToView } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.mapper";
import {
  quoteFormDropdownClassName,
  quoteFormInputClassName,
  quoteFormLabelClassName,
  quoteFormOutlineButtonClassName,
  quoteFormPrimaryButtonClassName,
  quoteFormSecondaryButtonClassName,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

export function CreateQuoteModal({
  isOpen,
  onClose,
  onQuoteCreated,
}: CreateQuoteModalProps) {
  const { fullName, userName, companyId, moduleCode } = useUserStore();
  const madeBy = fullName.trim() || userName.trim();
  const [initialValues] = useState(() => createQuoteDefaultValues(madeBy));
  const methods = useForm<CreateQuoteFormValues>({
    defaultValues: initialValues,
    mode: "onSubmit",
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "suppliers",
  });
  const [openSuppliers, setOpenSuppliers] = useState<string[]>(() =>
    initialValues.suppliers.map((supplier) => supplier.client_id),
  );
  const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<{
    index: number;
    clientId: string;
    name: string;
  } | null>(null);

  const { GetSuppliers } = useSuppliers({
    suppliersFilters: {
      companie_id: companyId,
      module_code: moduleCode,
      page_number: 1,
      page_size: 100,
    },
  });

  const registeredSuppliers = useMemo(
    () => GetSuppliers.data?.data ?? [],
    [GetSuppliers.data?.data],
  );

  const resetForm = () => {
    const defaults = createQuoteDefaultValues(madeBy);
    reset(defaults);
    setOpenSuppliers(defaults.suppliers.map((supplier) => supplier.client_id));
    setIsSelectSupplierOpen(false);
    setSupplierToDelete(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const onSubmit = (values: CreateQuoteFormValues) => {
    onQuoteCreated(mapCreateQuoteFormToView(values));
    resetForm();
    onClose();
  };

  const appendSupplier = (supplier: SupplierQuoteFormValues) => {
    append(supplier);
    setOpenSuppliers((current) => [...current, supplier.client_id]);
  };

  const handleSelectRegisteredSupplier = (supplier: GetSuppliersResponse) => {
    const nextSupplier: SupplierQuoteFormValues = {
      client_id: crypto.randomUUID(),
      supplier_id: supplier.supplier_id,
      its_registered: true,
      supplier_legal_name: supplier.supplier_legal_name,
      contact_name: supplier.contact_name,
      contact_phone_number: supplier.contact_phone_number,
      products: [createEmptyProduct()],
    };
    appendSupplier(nextSupplier);
  };

  const confirmDeleteSupplier = () => {
    if (!supplierToDelete) return;
    remove(supplierToDelete.index);
    setOpenSuppliers((current) =>
      current.filter((value) => value !== supplierToDelete.clientId),
    );
    setSupplierToDelete(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      variant="form"
      size="4xl"
      title="Nueva cotización"
      description="Complete el formulario para registrar una nueva cotización."
      panelClassName={[
        "flex h-[min(94dvh,54rem)] w-[min(calc(100vw-1rem),56rem)] min-w-0 flex-col overflow-hidden",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, () =>
            setOpenSuppliers(fields.map((field) => field.client_id)),
          )}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2">
            <div className="flex flex-col gap-8 pb-6">
              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <h3 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
                    Información general
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InputText
                    label="Elaborado por"
                    isRequired
                    readOnly
                    error={errors.made_by?.message}
                    className={`${quoteFormInputClassName} cursor-default!`}
                    labelClassName={quoteFormLabelClassName}
                    {...register("made_by", {
                      required: "No se encontró el responsable.",
                    })}
                  />

                  <Controller
                    control={control}
                    name="quote_date"
                    rules={{ required: "Seleccione la fecha de cotización." }}
                    render={({ field }) => (
                      <DatePicker
                        fieldWidth="large"
                        label="Fecha de cotización"
                        labelAbove
                        isRequired
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(value) => {
                          field.onChange(toDateOnly(value));
                        }}
                        error={errors.quote_date?.message}
                        labelClassName={quoteFormLabelClassName}
                      />
                    )}
                  />

                  <InputText
                    type="number"
                    step="0.01"
                    min="0"
                    label="Costo aproximado"
                    placeholder="0.00"
                    error={errors.approximate_cost?.message}
                    className={quoteFormInputClassName}
                    labelClassName={quoteFormLabelClassName}
                    {...register("approximate_cost", {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "El costo no puede ser negativo.",
                      },
                    })}
                  />

                  <InputText
                    type="te"
                    label="Código de requisición"
                    placeholder="codigo de requisición"
                    error={errors.approximate_cost?.message}
                    className={quoteFormInputClassName}
                    labelClassName={quoteFormLabelClassName}
                    {...register("approximate_cost", {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "El costo no puede ser negativo.",
                      },
                    })}
                  />
                </div>

                <Textarea
                  label="Observaciones generales"
                  placeholder="Ej: Cotización solicitada para reposición de inventario de bodega central..."
                  rows={4}
                  className={`${quoteFormInputClassName} resize-none`}
                  labelClassName={quoteFormLabelClassName}
                  {...register("observations")}
                />
              </section>

              <section className="flex flex-col gap-4 border-t border-t-slate-300 pt-7 dark:border-t-neutral-600">
                <div className="flex items-center gap-2">
                  <h3 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
                    Cotizaciones por proveedor
                  </h3>
                </div>

                <AccordionGroup
                  type="multiple"
                  value={openSuppliers}
                  onValueChange={(value) =>
                    setOpenSuppliers(
                      Array.isArray(value) ? value : value ? [value] : [],
                    )
                  }
                  className="gap-3"
                >
                  {fields.map((field, supplierIndex) => (
                    <SupplierQuoteAccordion
                      key={field.id}
                      supplierIndex={supplierIndex}
                      accordionValue={field.client_id}
                      canRemove={fields.length > 1}
                      onRemove={() => {
                        setSupplierToDelete({
                          index: supplierIndex,
                          clientId: field.client_id,
                          name:
                            field.supplier_legal_name?.trim() ||
                            `Proveedor ${supplierIndex + 1}`,
                        });
                      }}
                    />
                  ))}
                </AccordionGroup>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start">
                  <Button
                    type="button"
                    size="giant"
                    label="Agregar proveedor"
                    icon={<Plus size={20} />}
                    className={`w-full! sm:w-auto! ${quoteFormPrimaryButtonClassName}`}
                    onClick={() => appendSupplier(createEmptySupplier())}
                  />
                  <Button
                    type="button"
                    size="giant"
                    label="Seleccionar proveedor"
                    icon={<ListChecks size={20} />}
                    className={`w-full! sm:w-auto! ${quoteFormOutlineButtonClassName}`}
                    onClick={() => setIsSelectSupplierOpen(true)}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  label="Descartar"
                  size="giant"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  isHiddenLabelOnMobile
                  icon={<XIcon size={20} />}
                  className={quoteFormSecondaryButtonClassName}
                />
                <Button
                  type="submit"
                  label="Guardar cotización"
                  size="giant"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  isHiddenLabelOnMobile
                  icon={<SaveIcon size={20} />}
                  className={quoteFormPrimaryButtonClassName}
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      <SelectSupplierModal
        key={
          isSelectSupplierOpen
            ? "select-supplier-open"
            : "select-supplier-closed"
        }
        isOpen={isSelectSupplierOpen}
        onClose={() => setIsSelectSupplierOpen(false)}
        suppliers={registeredSuppliers}
        isLoading={GetSuppliers.isPending || GetSuppliers.isFetching}
        onSelect={handleSelectRegisteredSupplier}
      />

      <ConfirmModal
        isOpen={Boolean(supplierToDelete)}
        type="CANCEL"
        title={`¿Está seguro de eliminar a "${supplierToDelete?.name ?? "este proveedor"}"? Se quitarán también sus productos de la cotización.`}
        buttonActionLabel="Eliminar"
        buttonActionClass="rounded-md! bg-red-500! text-white! hover:bg-red-600! dark:bg-red-700!"
        onClose={() => setSupplierToDelete(null)}
        handleFinalAction={confirmDeleteSupplier}
      />
    </Modal>
  );
}
