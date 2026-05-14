import type {
  CreateIncomeFormProps,
  IncomeTypeOption,
} from "./create-income-form.types";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { Button, Dropdown, Textarea } from "@alpac/design-system";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes";
import { IncomeTypeEnum } from "@app/modules/payroll/domain/enums/income-enums/income.enum";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { FileUploader } from "@app/shared/components/file-uploader/file-uploader";
import {
  parseOvertimeIncomeExcel,
  validateOvertimeIncomePayload,
} from "@app/modules/payroll/ui/pages/nomina/components/incomes/utils/parse-overtime-income-excel";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const CreateIncomeForm = ({
  collaborator,
  payrollId,
  onCancel,
  onRequestSuccess,
  onRequestError,
}: CreateIncomeFormProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const [overtimeFileKey, setOvertimeFileKey] = useState(0);

  const methods = useForm<CreateIncomeRequest>({
    mode: "onChange",
    defaultValues: {
      company_id: companyId,
      module_code: moduleCode,
      payroll_id: payrollId,
      identification_number:
        collaborator.personal_information.identification_number,
      overtime_income_payload: undefined,
    },
  });

  const INCOMES_TYPES = [
    IncomeTypeEnum.INCOME_OVERTIME,
    IncomeTypeEnum.INCOME_COMMISSION,
  ] as IncomeTypeEnum[];

  const { GetIncomeTypes, CreateIncome } = useIncomes({
    incomesTypesPayload: { company_id: companyId! },
  });

  const { data: incomeTypesData, isLoading: isLoadingIncomeTypes } =
    GetIncomeTypes;

  const incomeTypeOptions = useMemo(() => {
    if (!incomeTypesData || !Array.isArray(incomeTypesData)) {
      return [];
    }

    return incomeTypesData.reduce(
      (accumulate: IncomeTypeOption[], item: IncomesTypesResponse) => {
        if (INCOMES_TYPES.includes(item.income_code as IncomeTypeEnum)) {
          accumulate.push({
            id: item.type_income_id,
            code: item.income_code,
            label: item.income_title,
          });
        }
        return accumulate;
      },
      [] as IncomeTypeOption[],
    );
  }, [incomeTypesData]);

  const incomeTypeId = methods.watch("type_income_id");

  const selectedIncomeTypeCode = useMemo(() => {
    return incomeTypeOptions.find((opt) => opt.id === incomeTypeId)?.code;
  }, [incomeTypeId, incomeTypeOptions]);

  useEffect(() => {
    if (selectedIncomeTypeCode !== IncomeTypeEnum.INCOME_OVERTIME) {
      methods.setValue("overtime_income_payload", undefined);
    }
  }, [selectedIncomeTypeCode, methods]);

  const handleOvertimeFileRemove = useCallback(() => {
    methods.setValue("overtime_income_payload", undefined);
  }, [methods]);

  const handleOvertimeFileSelect = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = parseOvertimeIncomeExcel(buffer);
        if (!result.ok) {
          onRequestError?.(result.error);
          methods.setValue("overtime_income_payload", undefined);
          setOvertimeFileKey((k) => k + 1);
          return;
        }
        methods.setValue("overtime_income_payload", result.rows, {
          shouldValidate: true,
        });
      } catch {
        onRequestError?.(
          "No se pudo leer el archivo. Intente de nuevo con un .xls o .xlsx válido.",
        );
        methods.setValue("overtime_income_payload", undefined);
        setOvertimeFileKey((k) => k + 1);
      }
    },
    [methods, onRequestError],
  );

  const onSubmit = async (data: CreateIncomeRequest) => {
    if (selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME) {
      const validated = validateOvertimeIncomePayload(
        data.overtime_income_payload,
      );
      if (!validated.ok) {
        onRequestError?.(validated.error);
        return;
      }

      const payload: CreateIncomeRequest = {
        ...data,
        description: undefined,
        overtime_income_payload: validated.rows,
      };

      await CreateIncome.mutateAsync(payload, {
        onSuccess: () => {
          onRequestSuccess?.("Ingreso registrado correctamente");
        },
        onError: (error: ApiErrorResponse) => {
          const mappedError = getMappedError(error);
          onRequestError?.(
            mappedError.description || "Error al registrar el ingreso",
          );
        },
      });
      return;
    }

    const { overtime_income_payload: _overtime, ...commissionData } = data;

    await CreateIncome.mutateAsync(commissionData, {
      onSuccess: () => {
        onRequestSuccess?.("Ingreso registrado correctamente");
      },
      onError: (error: ApiErrorResponse) => {
        const mappedError = getMappedError(error);
        onRequestError?.(
          mappedError.description || "Error al registrar el ingreso",
        );
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-w-0 flex-col gap-4 sm:gap-5"
        noValidate
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Controller
              name="type_income_id"
              control={methods.control}
              rules={{ required: "El tipo de ingreso es requerido" }}
              render={({ field }) => (
                <Dropdown
                  label="Tipo de ingreso"
                  isRequired
                  placeholder={
                    isLoadingIncomeTypes
                      ? "Cargando..."
                      : "Seleccione un tipo de ingreso"
                  }
                  appearance="dark"
                  value={field.value}
                  onChange={field.onChange}
                  options={incomeTypeOptions.map((opt) => ({
                    value: opt.id,
                    label: opt.label,
                  }))}
                  error={methods.formState.errors.type_income_id?.message}
                  labelClassName={labelClassName}
                  valueClassName={labelClassName}
                  className={inputClassName}
                />
              )}
            />
          </div>

          {selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME && (
            <FileUploader
              key={overtimeFileKey}
              title="Cargar archivo de horas extra"
              description="Formato .xls o .xlsx (columna A: ID empleado, columna C: minutos)"
              extensions={["xls", "xlsx"]}
              onFileSelect={handleOvertimeFileSelect}
              onFileRemove={handleOvertimeFileRemove}
            />
          )}

          {selectedIncomeTypeCode !== IncomeTypeEnum.INCOME_OVERTIME && (
            <Textarea
              label="Descripción"
              labelClassName={labelClassName}
              rows={3}
              maxLength={500}
              placeholder="Motivo del ingreso..."
              className={`${inputClassName} resize-none`}
              error={methods.formState.errors.description?.message}
              {...methods.register("description", {
                maxLength: {
                  value: 500,
                  message:
                    "La descripción debe tener como máximo 500 caracteres",
                },
              })}
            />
          )}
        </div>

        <div className="-mx-6 border-t border-t-slate-300 dark:border-t-neutral-600"></div>
        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={onCancel}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
          />
          <Button
            type="submit"
            size="giant"
            label="Registrar Ingreso"
            disabled={CreateIncome.isPending}
            isLoading={CreateIncome.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
          />
        </div>
      </form>
    </FormProvider>
  );
};
