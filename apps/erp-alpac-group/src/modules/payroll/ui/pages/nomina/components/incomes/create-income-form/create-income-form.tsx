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
import { Commission } from "../commission/commission";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { X } from "lucide-react";
import { FileUploader } from "@app/shared/components/file-uploader/file-uploader";
import {
  parseOvertimeIncomeExcel,
  validateOvertimeIncomePayload,
} from "@app/modules/payroll/ui/pages/nomina/components/incomes/utils/parse-overtime-income-excel";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const CreateIncomeForm = ({
  payrollId,
  branchId,
  onCancel,
  onRequestSuccess,
  onRequestError,
}: CreateIncomeFormProps) => {
  const { companyId, moduleCode, identificationNumber } = useUserStore();
  const { getMappedError } = useMappedError();
  const [overtimeFileKey, setOvertimeFileKey] = useState(0);
  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const methods = useForm<CreateIncomeRequest>({
    mode: "onChange",
    defaultValues: {
      company_id: companyId,
      module_code: moduleCode,
      payroll_id: payrollId,
      branch_id: branchId,
      type_income_id: "",
      description: "",
      overtime_income_data: undefined,
      commissions_payload: {
        commission_amount: 0,
        currency: 0,
      },
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
  const overtimeIncomePayload = methods.watch("overtime_income_data");

  const selectedIncomeTypeCode = useMemo(() => {
    return incomeTypeOptions.find((opt) => opt.id === incomeTypeId)?.code;
  }, [incomeTypeId, incomeTypeOptions]);

  const isOvertimeType =
    selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME;
  const isCommissionType =
    selectedIncomeTypeCode === IncomeTypeEnum.INCOME_COMMISSION;

  useEffect(() => {
    if (!isOvertimeType) {
      methods.setValue("overtime_income_data", undefined);
    }
  }, [isOvertimeType, methods]);

  const handleOvertimeFileRemove = useCallback(() => {
    methods.setValue("overtime_income_data", undefined);
  }, [methods]);

  const handleOvertimeFileSelect = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = parseOvertimeIncomeExcel(buffer);
        if (!result.ok) {
          onRequestError?.(result.error);
          methods.setValue("overtime_income_data", undefined);
          setOvertimeFileKey((k) => k + 1);
          return;
        }
        methods.setValue("overtime_income_data", result.rows, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch {
        onRequestError?.(
          "No se pudo leer el archivo. Intente de nuevo con un .xls o .xlsx válido.",
        );
        methods.setValue("overtime_income_data", undefined);
        setOvertimeFileKey((k) => k + 1);
      }
    },
    [methods, onRequestError],
  );

  const onSubmit = async (data: CreateIncomeRequest) => {
    if (!foundCollaborator && isCommissionType) {
      onRequestError?.("Debe buscar un colaborador para agregar un ingreso");
      return;
    }

    const { overtime_income_data, commissions_payload, ...rest } = data;

    if (isOvertimeType) {
      const validated = validateOvertimeIncomePayload(overtime_income_data);
      if (!validated.ok) {
        onRequestError?.(validated.error);
        return;
      }

      const {
        description: _description,
        identification_number: _id,
        ...overtimeRest
      } = rest;

      await CreateIncome.mutateAsync(
        {
          company_id: overtimeRest.company_id,
          module_code: overtimeRest.module_code,
          branch_id: overtimeRest.branch_id,
          payroll_id: overtimeRest.payroll_id,
          type_income_id: overtimeRest.type_income_id,
          overtime_income_data: validated.rows,
        },
        {
          onSuccess: () => {
            onRequestSuccess?.("Ingreso registrado correctamente");
          },
          onError: (error: ApiErrorResponse) => {
            const mappedError = getMappedError(error);
            onRequestError?.(
              mappedError.description || "Error al registrar el ingreso",
            );
          },
        },
      );
      return;
    }

    if (isCommissionType) {
      const {
        description: _description,
        identification_number: _id,
        ...commissionRest
      } = rest;

      await CreateIncome.mutateAsync(
        {
          company_id: commissionRest.company_id,
          module_code: commissionRest.module_code,
          branch_id: commissionRest.branch_id,
          payroll_id: commissionRest.payroll_id,
          type_income_id: commissionRest.type_income_id,
          identification_number:
            foundCollaborator?.personal_information?.identification_number ??
            "",
          commissions_payload: {
            commission_amount:
              Number(commissions_payload?.commission_amount) || 0,
            currency: Number(commissions_payload?.currency) || 0,
          },
        },
        {
          onSuccess: () => {
            onRequestSuccess?.("Ingreso registrado correctamente");
          },
          onError: (error: ApiErrorResponse) => {
            const mappedError = getMappedError(error);
            onRequestError?.(
              mappedError.description || "Error al registrar el ingreso",
            );
          },
        },
      );
    }
  };

  const hasOvertimeData =
    isOvertimeType && (overtimeIncomePayload?.length ?? 0) > 0;

  const isSubmitDisabled =
    CreateIncome.isPending ||
    !methods.formState.isDirty ||
    !methods.formState.isValid ||
    !selectedIncomeTypeCode ||
    (isOvertimeType && !hasOvertimeData) ||
    (isCommissionType && !foundCollaborator);

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
                  onChange={(value) => {
                    field.onChange(value);
                    setFoundCollaborator(null);
                  }}
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

          {!foundCollaborator && isCommissionType && (
            <CollaboratorSearchForm
              onSuccess={(collaborator) => {
                setFoundCollaborator(collaborator);
                setIsSearching(false);
              }}
              onError={() => {
                setFoundCollaborator(null);
                setIsSearching(false);
              }}
              onSearchStart={() => {
                setFoundCollaborator(null);
                setIsSearching(true);
              }}
              excludeIdentifications={[identificationNumber]}
            />
          )}

          {!!foundCollaborator && (
            <div className="relative flex w-full flex-row items-center gap-4">
              <div className="min-w-0 flex-1">
                <CollaboratorSummary
                  fullName={foundCollaborator.full_name ?? ""}
                  workPosition={foundCollaborator.work_position ?? ""}
                  isFullNameLoading={isSearching}
                  isWorkPositionLoading={isSearching}
                />
              </div>

              <div className="group flex items-center">
                <button
                  type="button"
                  className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
                  onClick={() => setFoundCollaborator(null)}
                  aria-label="Quitar Colaborador"
                >
                  <X size={20} />
                </button>
                <div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  Quitar Colaborador
                </div>
              </div>
            </div>
          )}

          {!!foundCollaborator && isCommissionType && <Commission />}

          {isOvertimeType && (
            <FileUploader
              key={overtimeFileKey}
              title="Cargar archivo de horas extras"
              extensions={["xls", "xlsx"]}
              onFileSelect={handleOvertimeFileSelect}
              onFileRemove={handleOvertimeFileRemove}
            />
          )}

          {!!foundCollaborator && isCommissionType && (
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

        <div className="-mx-6 border-t border-t-slate-300 dark:border-t-neutral-600" />

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
            disabled={isSubmitDisabled}
            isLoading={CreateIncome.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
          />
        </div>
      </form>
    </FormProvider>
  );
};
