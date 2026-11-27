import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Alert,
  Checkbox,
  DatePicker,
  Dropdown,
  InputText,
  RadioButton,
  Switch,
  Textarea,
} from "@alpac/design-system";
import { CurrencyOptions } from "@app/core/enums/currency.enum";
import { PdfUploader } from "@app/shared/components/pdf-uploader/pdf-uploader";
import { toDateOnly, toDayjsValue } from "@app/shared/utils/date.utils";
import { formatAmount } from "@app/shared/utils/number.utils";
import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import {
  deductionDropdownClassName,
  deductionInputClassName,
  deductionLabelClassName,
  sectionTitleClassName,
} from "@app/modules/payroll/ui/pages/active-deduction-index/utils/active-deduction.constants";
import {
  CHILD_SUPPORT_CONCEPT_FIELDS,
  DATE_PICKER_MODAL_SLOT_PROPS,
  hasAnyChildSupportConcept,
  parseDecimalInput,
  validateChildSupportFixedAmount,
  validateChildSupportPercentage,
} from "./child-support-form.utils";

export const ChildSupportGarnishment = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AddDeductionFormValues>();

  const hasOfficialLetter = Boolean(
    useWatch({ control, name: "child_support_payload.has_official_letter" }),
  );
  const isPercentage =
    useWatch({ control, name: "child_support_payload.is_percentage" }) ?? true;

  const seizureActFileName = useWatch({
    control,
    name: "child_support_payload.seizure_act_file_name",
  });
  const officialLetterFileName = useWatch({
    control,
    name: "child_support_payload.official_letter_file_name",
  });

  const deductSalary = Boolean(
    useWatch({ control, name: "child_support_payload.deduct_from_salary" }),
  );
  const deductOvertime = Boolean(
    useWatch({ control, name: "child_support_payload.deduct_from_overtime" }),
  );
  const deductChristmas = Boolean(
    useWatch({
      control,
      name: "child_support_payload.deduct_from_christmas_bonus",
    }),
  );
  const deductLiquidation = Boolean(
    useWatch({
      control,
      name: "child_support_payload.deduct_from_liquidation",
    }),
  );

  const hasAnyConcept = hasAnyChildSupportConcept({
    deduct_from_salary: deductSalary,
    deduct_from_overtime: deductOvertime,
    deduct_from_christmas_bonus: deductChristmas,
    deduct_from_liquidation: deductLiquidation,
  });

  const childSupportErrors = errors.child_support_payload;

  return (
    <div className="flex flex-col gap-5">
      {/* Acta de Embargo */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
        <h4 className={sectionTitleClassName}>Acta de Embargo</h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputText
            label="Número de Acta de Embargo"
            type="text"
            placeholder="Ej. ACT-2026-001"
            maxLength={100}
            className={deductionInputClassName}
            labelClassName={deductionLabelClassName}
            isRequired
            {...register("child_support_payload.seizure_act_number", {
              required: "El número de Acta de Embargo es obligatorio",
              maxLength: {
                value: 100,
                message: "No puede exceder 100 caracteres",
              },
            })}
            error={childSupportErrors?.seizure_act_number?.message}
          />

          <Controller
            name="child_support_payload.start_date"
            control={control}
            rules={{
              required: "La fecha de inicio del Acta es obligatoria",
            }}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha de Inicio (Acta)"
                className="w-full"
                labelAbove
                isRequired
                labelClassName={deductionLabelClassName}
                value={toDayjsValue(field.value)}
                onChange={(val) => field.onChange(toDateOnly(val))}
                error={childSupportErrors?.start_date?.message}
                slotProps={DATE_PICKER_MODAL_SLOT_PROPS}
              />
            )}
          />

          <div className="sm:col-span-2">
            <PdfUploader
              label="Acta de Embargo (PDF, opcional)"
              fileName={seizureActFileName}
              onChange={({ base64, fileName }) => {
                setValue("child_support_payload.seizure_act_file_base64", base64, {
                  shouldDirty: true,
                });
                setValue("child_support_payload.seizure_act_file_name", fileName, {
                  shouldDirty: true,
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* Oficio Judicial */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-neutral-600">
          <h4 className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200">
            Oficio Judicial
          </h4>

          <Controller
            name="child_support_payload.has_official_letter"
            control={control}
            render={({ field }) => (
              <Switch
                label="¿Cuenta con Oficio Judicial?"
                labelPosition="left"
                labelClassName={deductionLabelClassName}
                checked={Boolean(field.value)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  field.onChange(checked);
                  if (!checked) {
                    setValue(
                      "child_support_payload.official_letter_number",
                      "",
                      { shouldValidate: true },
                    );
                    setValue(
                      "child_support_payload.official_letter_date",
                      "",
                      { shouldValidate: true },
                    );
                    setValue(
                      "child_support_payload.official_letter_file_base64",
                      null,
                    );
                    setValue(
                      "child_support_payload.official_letter_file_name",
                      null,
                    );
                  }
                }}
              />
            )}
          />
        </div>

        {!hasOfficialLetter ? (
          <Alert
            type="info"
            title="Cheque Retenido"
            message="Sin oficio registrado, el embargo se descontará en nómina y el cheque quedará retenido hasta registrar el oficio en Deducciones Activas."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
              label="Número de Oficio"
              type="text"
              placeholder="Ej. OFI-2026-045"
              maxLength={100}
              className={deductionInputClassName}
              labelClassName={deductionLabelClassName}
              isRequired
              {...register("child_support_payload.official_letter_number", {
                required: hasOfficialLetter
                  ? "El número de oficio es obligatorio"
                  : false,
                maxLength: {
                  value: 100,
                  message: "No puede exceder 100 caracteres",
                },
              })}
              error={childSupportErrors?.official_letter_number?.message}
            />

            <Controller
              name="child_support_payload.official_letter_date"
              control={control}
              rules={{
                required: hasOfficialLetter
                  ? "La fecha del oficio es obligatoria"
                  : false,
              }}
              render={({ field }) => (
                <DatePicker
                  fieldWidth="large"
                  label="Fecha de Oficio"
                  className="w-full"
                  labelAbove
                  isRequired
                  labelClassName={deductionLabelClassName}
                  value={toDayjsValue(field.value)}
                  onChange={(val) => field.onChange(toDateOnly(val))}
                  error={childSupportErrors?.official_letter_date?.message}
                  slotProps={DATE_PICKER_MODAL_SLOT_PROPS}
                />
              )}
            />

            <div className="sm:col-span-2">
              <PdfUploader
                label="Oficio Judicial (PDF, opcional)"
                fileName={officialLetterFileName}
                onChange={({ base64, fileName }) => {
                  setValue(
                    "child_support_payload.official_letter_file_base64",
                    base64,
                    { shouldDirty: true },
                  );
                  setValue(
                    "child_support_payload.official_letter_file_name",
                    fileName,
                    { shouldDirty: true },
                  );
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Modalidad de Cálculo y Monto */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
        <h4 className={sectionTitleClassName}>Modalidad de Cálculo</h4>

        <Controller
          name="child_support_payload.is_percentage"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-5">
              <RadioButton
                id="child-support-mode-percentage"
                name="child-support-calc-mode"
                value="percentage"
                label="Porcentaje (%)"
                labelPosition="right"
                labelClassName={deductionLabelClassName}
                checked={field.value !== false}
                onChange={() => {
                  field.onChange(true);
                  setValue("child_support_payload.fixed_amount", undefined, {
                    shouldValidate: true,
                  });
                }}
              />
              <RadioButton
                id="child-support-mode-fixed"
                name="child-support-calc-mode"
                value="fixed"
                label="Monto Fijo"
                labelPosition="right"
                labelClassName={deductionLabelClassName}
                checked={field.value === false}
                onChange={() => {
                  field.onChange(false);
                  setValue("child_support_payload.percentage", undefined, {
                    shouldValidate: true,
                  });
                }}
              />
            </div>
          )}
        />

        {isPercentage ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
              label="Porcentaje a deducir (%)"
              type="text"
              inputMode="decimal"
              placeholder="Ej. 25 o 33.33"
              className={deductionInputClassName}
              labelClassName={deductionLabelClassName}
              isRequired
              {...register("child_support_payload.percentage", {
                required: isPercentage
                  ? "El porcentaje a deducir es obligatorio"
                  : false,
                setValueAs: parseDecimalInput,
                validate: (value?: number | null) =>
                  validateChildSupportPercentage(value, isPercentage),
                onChange: (evt) => {
                  evt.target.value = formatAmount(evt.target.value, 2, 2);
                },
              })}
              error={childSupportErrors?.percentage?.message}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="child_support_payload.currency"
              control={control}
              rules={{
                required: !isPercentage ? "Debe seleccionar una moneda" : false,
                validate: (val) =>
                  isPercentage || Number(val) > 0 || "Selección inválida",
              }}
              render={({ field }) => (
                <Dropdown
                  label="Moneda"
                  isRequired
                  options={CurrencyOptions ?? []}
                  placeholder="Seleccione..."
                  onChange={(value) => field.onChange(Number(value))}
                  error={childSupportErrors?.currency?.message}
                  value={field.value}
                  appearance="dark"
                  labelClassName={deductionLabelClassName}
                  valueClassName={deductionLabelClassName}
                  className={deductionDropdownClassName}
                />
              )}
            />

            <InputText
              label="Monto fijo quincenal"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              className={deductionInputClassName}
              labelClassName={deductionLabelClassName}
              isRequired
              {...register("child_support_payload.fixed_amount", {
                required: !isPercentage
                  ? "El monto fijo quincenal es obligatorio"
                  : false,
                setValueAs: parseDecimalInput,
                validate: (value?: number | null) =>
                  validateChildSupportFixedAmount(value, !isPercentage),
                onChange: (evt) => {
                  evt.target.value = formatAmount(evt.target.value, 8, 2);
                },
              })}
              error={childSupportErrors?.fixed_amount?.message}
            />
          </div>
        )}
      </section>

      {/* Conceptos de Aplicación */}
      <section className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
        <h4 className={sectionTitleClassName}>
          Conceptos de Aplicación <span className="text-red-500">*</span>
        </h4>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CHILD_SUPPORT_CONCEPT_FIELDS.map(({ key, label }) => (
            <Controller
              key={key}
              name={`child_support_payload.${key}`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  label={label}
                  labelClassName={deductionLabelClassName}
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          ))}
        </div>

        {!hasAnyConcept && (
          <p className="mt-1 text-xs font-medium text-red-500 dark:text-red-400">
            Debe seleccionar al menos un concepto de aplicación.
          </p>
        )}
      </section>

      {/* Beneficiario y Observaciones */}
      <div className="grid grid-cols-1 gap-4">
        <InputText
          label="Nombre del Beneficiario"
          type="text"
          placeholder="Nombre completo del beneficiario / representante"
          className={deductionInputClassName}
          labelClassName={deductionLabelClassName}
          {...register("child_support_payload.beneficiary_name")}
        />

        <Controller
          name="child_support_payload.description"
          control={control}
          render={({ field }) => (
            <Textarea
              label="Descripción / Observaciones"
              labelClassName={deductionLabelClassName}
              rows={3}
              placeholder="Detalles adicionales de la orden de embargo alimenticio..."
              className={`${deductionInputClassName} resize-none`}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
};
