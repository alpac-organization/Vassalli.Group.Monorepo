import {
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  InputText,
  RadioButton,
  Textarea,
} from "@alpac/design-system";
import { CurrencyOptions } from "@app/core/enums/currency.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { DeductionDetailsDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deduction-details.response";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import {
  CHILD_SUPPORT_CONCEPT_FIELDS,
  DATE_PICKER_MODAL_SLOT_PROPS,
  hasAnyChildSupportConcept,
  parseDecimalInput,
  validateChildSupportFixedAmount,
  validateChildSupportPercentage,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/child-support-garnishment/child-support-form.utils";
import { PdfUploader } from "@app/shared/components/pdf-uploader/pdf-uploader";
import type { PdfUploaderValue } from "@app/shared/components/pdf-uploader/pdf-uploader.types";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import {
  resolveCurrencyCode,
  resolveCurrencyOptionValue,
} from "@app/shared/utils/currency.utils";
import { toDateOnly, toDayjsValue } from "@app/shared/utils/date.utils";
import { formatAmount } from "@app/shared/utils/number.utils";
import { BanIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  deductionApproveButtonClassName,
  deductionCancelOutlineClassName,
  deductionDropdownClassName,
  deductionInputClassName,
  deductionLabelClassName,
  deductionModalFooterClassName,
  sectionTitleClassName,
} from "../../utils/active-deduction.constants";

type EditChildSupportValues = {
  seizure_act_number: string;
  start_date: string;
  is_percentage: boolean;
  percentage?: number;
  fixed_amount?: number;
  currency: number;
  deduct_from_salary: boolean;
  deduct_from_overtime: boolean;
  deduct_from_christmas_bonus: boolean;
  deduct_from_liquidation: boolean;
  beneficiary_name: string;
  description: string;
};

type EditChildSupportFormProps = {
  detail: DeductionDetailsDto;
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message?: string) => void;
};

export function EditChildSupportForm({
  detail,
  onBack,
  onSuccess,
  onError,
}: EditChildSupportFormProps) {
  const { companyId, moduleCode } = useUserStore();
  const { UpdateDeduction } = useDeduction();
  const { getMappedError } = useMappedError();

  const cs = detail.child_support_detail;
  const initialCurrencyCode = resolveCurrencyCode(detail.currency);
  const initialCurrency = Number(resolveCurrencyOptionValue(detail.currency));
  const initialFixedAmount =
    cs?.is_percentage === false
      ? initialCurrencyCode === "USD"
        ? (detail.fortnightly_amount_in_dollars ?? undefined)
        : (detail.fortnightly_amount ?? undefined)
      : undefined;

  const [actAttachment, setActAttachment] = useState<PdfUploaderValue>({
    fileName: null,
    base64: null,
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditChildSupportValues>({
    mode: "onChange",
    defaultValues: {
      seizure_act_number: cs?.seizure_act_number ?? "",
      start_date: cs?.start_date ?? "",
      is_percentage: cs?.is_percentage ?? true,
      percentage: cs?.percentage ?? undefined,
      fixed_amount: initialFixedAmount,
      currency: initialCurrency,
      deduct_from_salary: cs?.deduct_from_salary ?? true,
      deduct_from_overtime: cs?.deduct_from_overtime ?? true,
      deduct_from_christmas_bonus: cs?.deduct_from_christmas_bonus ?? true,
      deduct_from_liquidation: cs?.deduct_from_liquidation ?? true,
      beneficiary_name: cs?.beneficiary_name ?? "",
      description: detail.description ?? "",
    },
  });

  const isPercentage = useWatch({ control, name: "is_percentage" }) ?? true;
  const deductSalary = Boolean(
    useWatch({ control, name: "deduct_from_salary" }),
  );
  const deductOvertime = Boolean(
    useWatch({ control, name: "deduct_from_overtime" }),
  );
  const deductChristmas = Boolean(
    useWatch({ control, name: "deduct_from_christmas_bonus" }),
  );
  const deductLiquidation = Boolean(
    useWatch({ control, name: "deduct_from_liquidation" }),
  );
  const hasAnyConcept = hasAnyChildSupportConcept({
    deduct_from_salary: deductSalary,
    deduct_from_overtime: deductOvertime,
    deduct_from_christmas_bonus: deductChristmas,
    deduct_from_liquidation: deductLiquidation,
  });

  const handleFormSubmit = (data: EditChildSupportValues) => {
    if (!hasAnyConcept) {
      onError("Debe permanecer seleccionado al menos un concepto a deducir.");
      return;
    }

    const pct = data.percentage != null ? Number(data.percentage) : null;
    const fixed = data.fixed_amount != null ? Number(data.fixed_amount) : null;

    if (data.is_percentage && (!pct || pct <= 0 || pct > 60)) {
      onError("El porcentaje debe ser mayor a 0 y no exceder 60%.");
      return;
    }

    if (!data.is_percentage && (!fixed || fixed <= 0)) {
      onError("El monto fijo debe ser mayor a 0.");
      return;
    }

    UpdateDeduction.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        deduction_id: detail.deduction_id,
        seizure_act_number: data.seizure_act_number.trim(),
        start_date: data.start_date,
        is_percentage: data.is_percentage,
        percentage: data.is_percentage ? pct : null,
        fixed_amount: !data.is_percentage ? fixed : null,
        currency: data.currency,
        deduct_from_salary: data.deduct_from_salary,
        deduct_from_overtime: data.deduct_from_overtime,
        deduct_from_christmas_bonus: data.deduct_from_christmas_bonus,
        deduct_from_liquidation: data.deduct_from_liquidation,
        beneficiary_name: data.beneficiary_name.trim() || null,
        description: data.description.trim() || null,
        ...(actAttachment.base64
          ? {
              seizure_act_file_base64: actAttachment.base64,
              seizure_act_file_name: actAttachment.fileName,
            }
          : {}),
      },
      {
        onSuccess: () => {
          onSuccess("Embargo alimenticio actualizado correctamente");
        },
        onError: (err: ApiErrorResponse) => {
          const mapped = getMappedError(err);
          onError(
            mapped.description || "No se pudo actualizar el embargo alimenticio",
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
        <div className="flex flex-col gap-4 pb-4">
          <h4 className={sectionTitleClassName}>Editar Embargo Alimenticio</h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
              label="Número de Acta de Embargo"
              type="text"
              maxLength={100}
              className={deductionInputClassName}
              labelClassName={deductionLabelClassName}
              isRequired
              {...register("seizure_act_number", {
                required: "El número de Acta de Embargo es obligatorio",
                maxLength: {
                  value: 100,
                  message: "No puede exceder 100 caracteres",
                },
              })}
              error={errors.seizure_act_number?.message}
            />

            <Controller
              name="start_date"
              control={control}
              rules={{ required: "La fecha de inicio es obligatoria" }}
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
                  error={errors.start_date?.message}
                  slotProps={DATE_PICKER_MODAL_SLOT_PROPS}
                />
              )}
            />

            <div className="sm:col-span-2">
              <PdfUploader
                label="Reemplazar Acta de Embargo (PDF, opcional)"
                fileName={actAttachment.fileName}
                onChange={setActAttachment}
              />
            </div>
          </div>

          <section className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
            <h4 className={sectionTitleClassName}>Modalidad de Cálculo</h4>
            <Controller
              name="is_percentage"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-5">
                  <RadioButton
                    id="edit-cs-percentage"
                    name="edit-cs-mode"
                    value="percentage"
                    label="Porcentaje (%)"
                    labelPosition="right"
                    labelClassName={deductionLabelClassName}
                    checked={field.value === true}
                    onChange={() => {
                      field.onChange(true);
                      setValue("fixed_amount", undefined);
                    }}
                  />
                  <RadioButton
                    id="edit-cs-fixed"
                    name="edit-cs-mode"
                    value="fixed"
                    label="Monto Fijo"
                    labelPosition="right"
                    labelClassName={deductionLabelClassName}
                    checked={field.value === false}
                    onChange={() => {
                      field.onChange(false);
                      setValue("percentage", undefined);
                    }}
                  />
                </div>
              )}
            />

            {isPercentage ? (
              <InputText
                label="Porcentaje a deducir (%)"
                type="text"
                inputMode="decimal"
                className={deductionInputClassName}
                labelClassName={deductionLabelClassName}
                isRequired
                {...register("percentage", {
                  required: isPercentage ? "El porcentaje es obligatorio" : false,
                  setValueAs: parseDecimalInput,
                  validate: (value?: number) =>
                    validateChildSupportPercentage(value, isPercentage),
                  onChange: (evt) => {
                    evt.target.value = formatAmount(evt.target.value, 2, 2);
                  },
                })}
                error={errors.percentage?.message}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="currency"
                  control={control}
                  rules={{
                    required: !isPercentage ? "Seleccione una moneda" : false,
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Moneda"
                      isRequired
                      options={CurrencyOptions ?? []}
                      value={field.value}
                      onChange={(value) => field.onChange(Number(value))}
                      appearance="dark"
                      labelClassName={deductionLabelClassName}
                      valueClassName={deductionLabelClassName}
                      className={deductionDropdownClassName}
                      error={errors.currency?.message}
                    />
                  )}
                />
                <InputText
                  label="Monto fijo quincenal"
                  type="text"
                  inputMode="decimal"
                  className={deductionInputClassName}
                  labelClassName={deductionLabelClassName}
                  isRequired
                  {...register("fixed_amount", {
                    required: !isPercentage
                      ? "El monto fijo es obligatorio"
                      : false,
                    setValueAs: parseDecimalInput,
                    validate: (value?: number) =>
                      validateChildSupportFixedAmount(value, !isPercentage),
                    onChange: (evt) => {
                      evt.target.value = formatAmount(evt.target.value, 8, 2);
                    },
                  })}
                  error={errors.fixed_amount?.message}
                />
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-neutral-700">
            <h4 className={sectionTitleClassName}>
              Conceptos de Aplicación <span className="text-red-500">*</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CHILD_SUPPORT_CONCEPT_FIELDS.map(({ key, label }) => (
                <Controller
                  key={key}
                  name={key}
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

          <InputText
            label="Nombre del Beneficiario"
            type="text"
            className={deductionInputClassName}
            labelClassName={deductionLabelClassName}
            {...register("beneficiary_name")}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Descripción"
                labelClassName={deductionLabelClassName}
                rows={2}
                className={`${deductionInputClassName} resize-none`}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className={deductionModalFooterClassName}>
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            label="Cancelar"
            icon={<BanIcon size={16} />}
            disabled={UpdateDeduction.isPending}
            onClick={onBack}
            className={`${deductionCancelOutlineClassName} w-full min-w-0 sm:w-auto`}
          />
          <Button
            type="submit"
            label="Guardar Cambios"
            icon={<CheckIcon size={16} />}
            disabled={!hasAnyConcept || UpdateDeduction.isPending}
            isLoading={UpdateDeduction.isPending}
            className={`${deductionApproveButtonClassName} w-full min-w-0 sm:w-auto`}
          />
        </div>
      </div>
    </form>
  );
}
