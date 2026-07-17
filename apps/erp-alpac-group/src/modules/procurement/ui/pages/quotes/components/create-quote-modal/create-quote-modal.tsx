import { useState } from "react";
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
import { Plus, SaveIcon, XIcon } from "lucide-react";
import dayjs from "dayjs";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import type { CreateQuoteModalProps } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-modal.types";
import {
  createEmptySupplier,
  createQuoteDefaultValues,
  type CreateQuoteFormValues,
} from "./create-quote-form.types";
import { SupplierQuoteAccordion } from "./components/supplier-quote-accordion";
import { mapCreateQuoteFormToView } from "./create-quote-form.mapper";
import {
  quoteFormDropdownClassName,
  quoteFormInputClassName,
  quoteFormLabelClassName,
  quoteFormPrimaryButtonClassName,
  quoteFormSecondaryButtonClassName,
} from "./create-quote-form.styles";

export function CreateQuoteModal({
  isOpen,
  onClose,
  onQuoteCreated,
}: CreateQuoteModalProps) {
  const { fullName, userName } = useUserStore();
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

  const resetForm = () => {
    const defaults = createQuoteDefaultValues(madeBy);
    reset(defaults);
    setOpenSuppliers(defaults.suppliers.map((supplier) => supplier.client_id));
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

                  <Controller
                    control={control}
                    name="currency"
                    rules={{ required: "Seleccione la moneda." }}
                    render={({ field }) => (
                      <Dropdown
                        label="Moneda"
                        isRequired
                        appearance="dark"
                        options={[
                          { label: "Córdobas (NIO)", value: "NIO" },
                          { label: "Dólares (USD)", value: "USD" },
                        ]}
                        placeholder="Seleccione..."
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.currency?.message}
                        labelClassName={quoteFormLabelClassName}
                        className={quoteFormDropdownClassName}
                      />
                    )}
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
                        remove(supplierIndex);
                        setOpenSuppliers((current) =>
                          current.filter((value) => value !== field.client_id),
                        );
                      }}
                    />
                  ))}
                </AccordionGroup>

                <div className="flex justify-start">
                  <Button
                    type="button"
                    size="giant"
                    label="Agregar proveedor"
                    icon={<Plus size={20} />}
                    className={`w-full! sm:w-auto! ${quoteFormPrimaryButtonClassName}`}
                    onClick={() => {
                      const supplier = createEmptySupplier();
                      append(supplier);
                      setOpenSuppliers((current) => [
                        ...current,
                        supplier.client_id,
                      ]);
                    }}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[12px] text-slate-500 dark:text-slate-400">
                <span className="font-bold text-red-500 dark:text-red-400">
                  *
                </span>{" "}
                Campos requeridos
              </span>
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
    </Modal>
  );
}
