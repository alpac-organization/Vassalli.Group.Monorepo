import { memo, useMemo } from "react";
import { Checkbox, Dropdown, InputText, Textarea } from "@alpac/design-system";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import {
  PaymentMethodOptions,
  type PaymentMethodType,
} from "@app/core/enums/payment-method.enum";
import {
  SupplierExclusiveStatusEnum,
  type SupplierExclusiveStatusOnCreate,
} from "@app/core/enums/supplier-exclusive-status.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type {
  UpdateSupplierDetailsPayload,
  UpdateSupplierRequest,
} from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

const exclusiveStatusOnCreateOptions = [
  {
    value: SupplierExclusiveStatusEnum.None.stringValue,
    label: SupplierExclusiveStatusEnum.None.label,
  },
  {
    value: SupplierExclusiveStatusEnum.PendingReview.stringValue,
    label: SupplierExclusiveStatusEnum.PendingReview.label,
  },
];

const currencyOptions = [
  { value: "USD", label: "Dólares ($)" },
  { value: "NIO", label: "Córdobas (C$)" },
];

const emptyPaymentMethods: PaymentMethodType[] = [];

type TrackField = <K extends keyof UpdateSupplierRequest>(
  field: K,
  value: UpdateSupplierRequest[K],
) => void;

type TrackDetailField = <K extends keyof UpdateSupplierDetailsPayload>(
  field: K,
  value: UpdateSupplierDetailsPayload[K],
) => void;

type SupplierCommercialTabProps = {
  control: Control<CreateSupplierRequest>;
  register: UseFormRegister<CreateSupplierRequest>;
  setValue: UseFormSetValue<CreateSupplierRequest>;
  getValues: UseFormGetValues<CreateSupplierRequest>;
  errors: FieldErrors<CreateSupplierRequest>;
  isEditMode: boolean;
  trackField: TrackField;
  trackDetailField: TrackDetailField;
  trackMultipleDetailFields: (changes: UpdateSupplierDetailsPayload) => void;
};

export const SupplierCommercialTab = memo(function SupplierCommercialTab({
  control,
  register,
  setValue,
  getValues,
  errors,
  isEditMode,
  trackField,
  trackDetailField,
  trackMultipleDetailFields,
}: SupplierCommercialTabProps) {
  const hasCredit = useWatch({ control, name: "supplier_details.has_credit" });
  const exclusiveStatusWatch = useWatch({
    control,
    name: "supplier_details.exclusive_status",
  });
  const watchedPaymentMethods = useWatch({ control, name: "payment_methods" });
  const paymentMethodsWatch = watchedPaymentMethods ?? emptyPaymentMethods;
  const isExclusiveForm =
    Boolean(exclusiveStatusWatch) &&
    exclusiveStatusWatch !== SupplierExclusiveStatusEnum.None.stringValue;

  const preferredPaymentMethodOptions = useMemo(
    () =>
      PaymentMethodOptions.filter((option) =>
        paymentMethodsWatch.includes(String(option.value) as PaymentMethodType),
      ),
    [paymentMethodsWatch],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
          Condiciones Comerciales y de Crédito
        </h4>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="payment_methods"
              rules={{
                validate: (value) =>
                  (Array.isArray(value) && value.length > 0) ||
                  "Seleccione al menos un método de pago",
              }}
              render={({ field }) => (
                <Dropdown
                  multiple
                  label="Métodos de pago"
                  placeholder="Seleccione..."
                  isRequired
                  options={PaymentMethodOptions}
                  value={field.value ?? []}
                  onChange={(vals) => {
                    const next = (
                      Array.isArray(vals) ? vals : []
                    ) as PaymentMethodType[];
                    field.onChange(next);
                    trackField("payment_methods", next);

                    const currentPreferred = getValues(
                      "supplier_details.preferred_payment_method",
                    );
                    if (currentPreferred && !next.includes(currentPreferred)) {
                      setValue("supplier_details.preferred_payment_method", null);
                      trackDetailField("preferred_payment_method", null);
                    }
                  }}
                  appearance="dark"
                  className={dropdownClassName}
                  labelClassName={labelClassName}
                  valueClassName="text-black! dark:text-white!"
                  error={errors.payment_methods?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="supplier_details.preferred_payment_method"
              rules={{
                validate: (value) => {
                  if (!value) return true;
                  return (
                    paymentMethodsWatch.includes(value) ||
                    "El método preferido debe estar en los métodos de pago seleccionados"
                  );
                },
              }}
              render={({ field }) => (
                <Dropdown
                  label="Método de pago preferido"
                  placeholder={
                    preferredPaymentMethodOptions.length === 0
                      ? "Seleccione métodos primero"
                      : "Seleccione..."
                  }
                  appearance="dark"
                  optional
                  options={preferredPaymentMethodOptions}
                  value={field.value ?? null}
                  disabled={preferredPaymentMethodOptions.length === 0}
                  onChange={(value) => {
                    const next =
                      value === null || value === undefined || value === ""
                        ? null
                        : (String(value) as PaymentMethodType);
                    field.onChange(next);
                    trackDetailField("preferred_payment_method", next);
                  }}
                  className={dropdownClassName}
                  labelClassName={labelClassName}
                  valueClassName="text-black! dark:text-white!"
                  error={
                    errors.supplier_details?.preferred_payment_method?.message
                  }
                />
              )}
            />

            <div className="flex items-center pt-6">
              <Controller
                control={control}
                name="supplier_details.has_credit"
                render={({ field }) => (
                  <Checkbox
                    label="¿Ofrece línea de crédito?"
                    checked={Boolean(field.value)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      field.onChange(checked);
                      if (!checked) {
                        setValue("supplier_details.credit_days", 0);
                        setValue("supplier_details.credit_limit", null);
                        trackMultipleDetailFields({
                          has_credit: false,
                          credit_days: 0,
                          credit_limit: null,
                        });
                      } else {
                        trackDetailField("has_credit", true);
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>

          {hasCredit ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-lg border border-slate-200 dark:border-neutral-700 p-4 bg-slate-50/50 dark:bg-neutral-800/30">
              <InputText
                label="Días de crédito"
                type="number"
                min="1"
                placeholder="30"
                isRequired
                className={inputClassName}
                labelClassName={labelClassName}
                {...register("supplier_details.credit_days", {
                  setValueAs: (val) => Number(val) || 0,
                  validate: (val) =>
                    !hasCredit ||
                    Number(val) > 0 ||
                    "Debe ingresar al menos 1 día de crédito",
                  onChange: (evt) =>
                    trackDetailField("credit_days", Number(evt.target.value) || 0),
                })}
                error={errors.supplier_details?.credit_days?.message}
              />

              <InputText
                label="Límite de crédito (monto)"
                type="number"
                min="0"
                step="0.01"
                placeholder="50000.00"
                className={inputClassName}
                labelClassName={labelClassName}
                {...register("supplier_details.credit_limit", {
                  setValueAs: (val) => (val === "" ? null : Number(val)),
                  onChange: (evt) =>
                    trackDetailField(
                      "credit_limit",
                      evt.target.value === "" ? null : Number(evt.target.value),
                    ),
                })}
              />

              <Controller
                control={control}
                name="supplier_details.credit_currency"
                render={({ field }) => (
                  <Dropdown
                    label="Moneda del crédito"
                    options={currencyOptions}
                    value={field.value ?? "USD"}
                    onChange={(val) => {
                      field.onChange(val);
                      trackDetailField("credit_currency", val as string);
                    }}
                    appearance="dark"
                    className={dropdownClassName}
                    labelClassName={labelClassName}
                    valueClassName="text-black! dark:text-white!"
                  />
                )}
              />

              <div className="md:col-span-3">
                <InputText
                  label="Alerta de vencimiento (días antes)"
                  type="number"
                  min="0"
                  placeholder="5"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("supplier_details.alert_days_before_due", {
                    setValueAs: (val) => Number(val) || 0,
                    onChange: (evt) =>
                      trackDetailField(
                        "alert_days_before_due",
                        Number(evt.target.value) || 0,
                      ),
                  })}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-neutral-700 pt-4">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
          Régimen Fiscal y Retenciones
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            control={control}
            name="supplier_details.apply_ir_retention"
            render={({ field }) => (
              <Checkbox
                label="Aplica retención IR"
                checked={Boolean(field.value)}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  trackDetailField("apply_ir_retention", e.target.checked);
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="supplier_details.apply_municipal_retention"
            render={({ field }) => (
              <Checkbox
                label="Aplica retención Municipal (IMI)"
                checked={Boolean(field.value)}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  trackDetailField(
                    "apply_municipal_retention",
                    e.target.checked,
                  );
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="supplier_details.is_tax_exempt"
            render={({ field }) => (
              <Checkbox
                label="Exento de impuestos (Exonerado)"
                checked={Boolean(field.value)}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  trackDetailField("is_tax_exempt", e.target.checked);
                }}
              />
            )}
          />
        </div>
      </div>

      {!isEditMode ? (
        <div className="border-t border-slate-200 dark:border-neutral-700 pt-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
            Distribución y Exclusividad
          </h4>
          <div className="flex flex-col gap-4">
            <Checkbox
              label="Es distribuidor o proveedor exclusivo"
              checked={isExclusiveForm}
              onChange={(e) => {
                const checked = e.target.checked;
                if (!checked) {
                  setValue(
                    "supplier_details.exclusive_status",
                    SupplierExclusiveStatusEnum.None.stringValue,
                  );
                  setValue("supplier_details.exclusive_brands_or_parts", null);
                  return;
                }

                setValue(
                  "supplier_details.exclusive_status",
                  SupplierExclusiveStatusEnum.PendingReview.stringValue,
                );
              }}
            />

            {isExclusiveForm ? (
              <>
                <Controller
                  control={control}
                  name="supplier_details.exclusive_status"
                  render={({ field }) => (
                    <Dropdown
                      label="Estado de exclusividad"
                      placeholder="Seleccione..."
                      appearance="dark"
                      options={exclusiveStatusOnCreateOptions}
                      value={
                        field.value ??
                        SupplierExclusiveStatusEnum.None.stringValue
                      }
                      onChange={(val) => {
                        const status = String(
                          val ?? SupplierExclusiveStatusEnum.None.stringValue,
                        ) as SupplierExclusiveStatusOnCreate;
                        field.onChange(status);
                      }}
                      className={dropdownClassName}
                      labelClassName={labelClassName}
                    />
                  )}
                />

                <Textarea
                  label="Marcas o partes autorizadas en exclusiva"
                  placeholder="Ej. Distribuidor autorizado Caterpillar, Donaldson y Timken"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("supplier_details.exclusive_brands_or_parts")}
                  maxLength={500}
                  style={{
                    resize: "none",
                    height: "80px",
                  }}
                />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
});
