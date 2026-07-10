import { X } from "lucide-react";
import { FormProvider, Controller, useForm } from "react-hook-form";
import { Button, Dropdown, RadioButton } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes";
import { IncomeTypeEnum } from "@app/modules/payroll/domain/enums/income-enums/income.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Bonus } from "@app/modules/payroll/ui/pages/nomina/components/incomes/bonus/bonus";
import { Commission } from "@app/modules/payroll/ui/pages/nomina/components/incomes/commission/commission";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { AddSubsidyForm } from "@app/modules/payroll/ui/pages/nomina/components/subsidies/add-subsidy-form/add-subsidy-form";
import { FileUploader } from "@app/shared/components/file-uploader/file-uploader";

import {
  parseOvertimeIncomeExcel,
  validateOvertimeIncomePayload,
} from "@app/modules/payroll/ui/pages/nomina/components/incomes/utils/parse-overtime-income-excel";

import {
  parseHolidayIncomeExcel,
  validateHolidayIncomePayload,
} from "@app/modules/payroll/ui/pages/nomina/components/incomes/utils/parse-holiday-income-excel";

import type {
  CreateIncomeFormProps,
  IncomeTypeOption,
} from "@app/modules/payroll/ui/pages/nomina/components/incomes/create-income-form/create-income-form.types";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import type { IncomesTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/incomes-responses/incomes-types.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { Overtime } from "../overtime/overtime";
import { Depreciation } from "../depreciation/depreciation";
import { Holiday } from "../holiday/holiday";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const SUBSIDY_TYPE_CODE = "subsidy";
const subsidyTypeOption: IncomeTypeOption = {
  id: SUBSIDY_TYPE_CODE,
  code: SUBSIDY_TYPE_CODE,
  label: "Subsidio",
};
const formFieldsTransition = {
  height: { duration: 0.28, ease: "easeInOut" as const },
  opacity: { duration: 0.35, ease: "easeOut" as const, delay: 0.08 },
  y: { duration: 0.28, ease: "easeOut" as const, delay: 0.08 },
};

const transition = {
  height: { duration: 0.3, ease: "easeInOut" as const },
  opacity: { duration: 0.45, ease: "easeOut" as const, delay: 0.1 },
  y: { duration: 0.3, ease: "easeOut" as const, delay: 0.1 },
};

const loadMotionFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export const CreateIncomeForm = ({
  payrollId,
  branchId,
  onCancel,
  onRequestSuccess,
  onRequestError,
}: CreateIncomeFormProps) => {
  const { companyId, moduleCode, identificationNumber, role } = useUserStore();
  const { getMappedError } = useMappedError();
  const [overtimeFileKey, setOvertimeFileKey] = useState(0);
  const [holidayFileKey, setHolidayFileKey] = useState(0);
  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [selectedInputMethod, setSelectedInputMethod] = useState<
    "manualEntry" | "excelImport"
  >("manualEntry");
  const [isSearching, setIsSearching] = useState(false);

  const isAdministrator = role === RoleEnum.ADMINISTRATOR;

  const methods = useForm<CreateIncomeRequest>({
    mode: "onChange",
    defaultValues: {
      company_id: companyId,
      module_code: moduleCode,
      payroll_id: payrollId,
      branch_id: branchId,
      type_income_id: "",
      overtime_income_data: undefined,
      overtime_payload: {
        identification_number: "",
        amount_hours: 0,
      },
      commissions_payload: {
        currency: 0,
        commission_amount: 0,
      },
      depreciation_payload: {
        currency: 0,
        depreciation_amount: 0,
      },
    },
  });

  const INCOMES_TYPES = [
    IncomeTypeEnum.INCOME_OVERTIME,
    IncomeTypeEnum.INCOME_COMMISSION,
    IncomeTypeEnum.INCOME_BONUS,
    IncomeTypeEnum.INCOME_DEPRECIATION,
    IncomeTypeEnum.INCOME_HOLIDAY,
  ] as IncomeTypeEnum[];

  const { GetIncomeTypes, CreateIncome } = useIncomes({
    incomesTypesPayload: { company_id: companyId! },
  });

  const { data: incomeTypesData, isLoading: isLoadingIncomeTypes } =
    GetIncomeTypes;

  const apiIncomeTypeOptions = useMemo(() => {
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

  const allIncomeTypeOptions = useMemo(
    () => [...apiIncomeTypeOptions, subsidyTypeOption],
    [apiIncomeTypeOptions],
  );

  const incomeTypeId = methods.watch("type_income_id");
  const overtimeIncomePayload = methods.watch("overtime_income_data");
  const overtimeManualPayload = methods.watch("overtime_payload");
  const holidayIncomePayload = methods.watch("holiday_income_data");
  const holidayManualPayload = methods.watch("holiday_payload");
  const commissionIncomePayload = methods.watch("commissions_payload");
  const bonusIncomePayload = methods.watch("bonus_payload");
  const depreciationIncomePayload = methods.watch("depreciation_payload");

  const selectedIncomeTypeCode = useMemo(() => {
    return allIncomeTypeOptions.find((opt) => opt.id === incomeTypeId)?.code;
  }, [incomeTypeId, allIncomeTypeOptions]);

  const isOvertimeType =
    selectedIncomeTypeCode === IncomeTypeEnum.INCOME_OVERTIME;
  const isCommissionType =
    selectedIncomeTypeCode === IncomeTypeEnum.INCOME_COMMISSION;
  const isBonusType = selectedIncomeTypeCode === IncomeTypeEnum.INCOME_BONUS;
  const isSubsidyType = selectedIncomeTypeCode === SUBSIDY_TYPE_CODE;
  const isDepreciationType =
    selectedIncomeTypeCode === IncomeTypeEnum.INCOME_DEPRECIATION;
  const isHolidayType =
    selectedIncomeTypeCode === IncomeTypeEnum.INCOME_HOLIDAY;

  const needsCollaborator =
    isCommissionType ||
    isBonusType ||
    isSubsidyType ||
    isDepreciationType ||
    ((isOvertimeType || isHolidayType) &&
      selectedInputMethod === "manualEntry");

  useEffect(() => {
    methods.setValue("payroll_id", payrollId);
  }, [payrollId, methods]);

  useEffect(() => {
    methods.setValue("branch_id", branchId);
  }, [branchId, methods]);

  useEffect(() => {
    if (!isOvertimeType) {
      methods.setValue("overtime_income_data", undefined);
      methods.setValue("overtime_payload", undefined);
    }
  }, [isOvertimeType, methods]);

  useEffect(() => {
    if (!isHolidayType) {
      methods.setValue("holiday_income_data", undefined);
      methods.setValue("holiday_payload", undefined);
    }
  }, [isHolidayType, methods]);

  useEffect(() => {
    if (!isOvertimeType && !isHolidayType) {
      setSelectedInputMethod("manualEntry");
    }
  }, [isOvertimeType, isHolidayType]);

  useEffect(() => {
    if (!isOvertimeType) return;

    if (selectedInputMethod === "manualEntry") {
      methods.setValue("overtime_income_data", undefined);
      methods.setValue("overtime_payload", {
        identification_number: "",
        amount_hours: 0,
      });
      return;
    }

    methods.setValue("overtime_payload", undefined);
    methods.setValue("overtime_income_data", undefined);
  }, [isOvertimeType, selectedInputMethod, methods]);

  useEffect(() => {
    if (!isHolidayType) return;

    if (selectedInputMethod === "manualEntry") {
      methods.setValue("holiday_income_data", undefined);
      methods.setValue("holiday_payload", {
        identification_number: "",
        amount_days: 0,
      });
      return;
    }

    methods.setValue("holiday_payload", undefined);
    methods.setValue("holiday_income_data", undefined);
  }, [isHolidayType, selectedInputMethod, methods]);

  useEffect(() => {
    if (!isCommissionType) {
      methods.setValue("commissions_payload", undefined);
      return;
    }
    methods.setValue("commissions_payload", {
      currency: 0,
      commission_amount: 0,
    });
  }, [isCommissionType, methods]);

  useEffect(() => {
    if (!isDepreciationType) {
      methods.setValue("depreciation_payload", undefined);
      return;
    }
    methods.setValue("depreciation_payload", {
      currency: 0,
      depreciation_amount: 0,
    });
  }, [isDepreciationType, methods]);

  const handleClearCollaborator = useCallback(() => {
    setFoundCollaborator(null);

    if (isCommissionType) {
      methods.setValue("commissions_payload", {
        currency: 0,
        commission_amount: 0,
      });
    }

    if (isOvertimeType && selectedInputMethod === "manualEntry") {
      methods.setValue("overtime_payload", {
        identification_number: "",
        amount_hours: 0,
      });
    }

    if (isHolidayType && selectedInputMethod === "manualEntry") {
      methods.setValue("holiday_payload", {
        identification_number: "",
        amount_days: 0,
      });
    }

    if (isDepreciationType) {
      methods.setValue("depreciation_payload", {
        currency: 0,
        identification_number: "",
        depreciation_amount: 0,
      });
    }
  }, [
    isCommissionType,
    isOvertimeType,
    isHolidayType,
    isDepreciationType,
    selectedInputMethod,
    methods,
  ]);

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

  const handleHolidayFileRemove = useCallback(() => {
    methods.setValue("holiday_income_data", undefined);
  }, [methods]);

  const handleHolidayFileSelect = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = parseHolidayIncomeExcel(buffer);
        if (!result.ok) {
          onRequestError?.(result.error);
          methods.setValue("holiday_income_data", undefined);
          setHolidayFileKey((k) => k + 1);
          return;
        }
        methods.setValue("holiday_income_data", result.rows, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch {
        onRequestError?.(
          "No se pudo leer el archivo. Intente de nuevo con un .xls o .xlsx válido.",
        );
        methods.setValue("holiday_income_data", undefined);
        setHolidayFileKey((k) => k + 1);
      }
    },
    [methods, onRequestError],
  );

  const onSubmit = async (data: CreateIncomeRequest) => {
    if (!foundCollaborator && isCommissionType) {
      onRequestError?.("Debe buscar un colaborador para agregar un ingreso");
      return;
    }

    const {
      overtime_income_data,
      holiday_income_data,
      commissions_payload,
      bonus_payload,
      depreciation_payload,
      ...rest
    } = data;

    if (isOvertimeType) {
      if (selectedInputMethod === "manualEntry") {
        if (!foundCollaborator) {
          onRequestError?.(
            "Debe buscar un colaborador para agregar un ingreso",
          );
          return;
        }

        const amountHours = data.overtime_payload?.amount_hours;
        const identificationNumberValue =
          foundCollaborator.personal_information?.identification_number
            ?.replace(/-/g, "")
            .toUpperCase() ?? "";

        const manualRows = [
          {
            identification_number: identificationNumberValue,
            amount_hours: Number(amountHours) || 0,
          },
        ];

        const validated = validateOvertimeIncomePayload(manualRows);
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

    if (isHolidayType) {
      if (selectedInputMethod === "manualEntry") {
        if (!foundCollaborator) {
          onRequestError?.(
            "Debe buscar un colaborador para agregar un ingreso",
          );
          return;
        }

        const amountDays = data.holiday_payload?.amount_days;
        const identificationNumberValue =
          foundCollaborator.personal_information?.identification_number
            ?.replace(/-/g, "")
            .toUpperCase() ?? "";

        const manualRows = [
          {
            identification_number: identificationNumberValue,
            amount_days: Number(amountDays) || 0,
          },
        ];

        const validated = validateHolidayIncomePayload(manualRows);
        if (!validated.ok) {
          onRequestError?.(validated.error);
          return;
        }

        const {
          description: _description,
          identification_number: _id,
          ...holidayRest
        } = rest;

        await CreateIncome.mutateAsync(
          {
            company_id: holidayRest.company_id,
            module_code: holidayRest.module_code,
            branch_id: holidayRest.branch_id,
            payroll_id: holidayRest.payroll_id,
            type_income_id: holidayRest.type_income_id,
            holiday_income_data: validated.rows,
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

      const validated = validateHolidayIncomePayload(holiday_income_data);
      if (!validated.ok) {
        onRequestError?.(validated.error);
        return;
      }

      const {
        description: _description,
        identification_number: _id,
        ...holidayRest
      } = rest;

      await CreateIncome.mutateAsync(
        {
          company_id: holidayRest.company_id,
          module_code: holidayRest.module_code,
          branch_id: holidayRest.branch_id,
          payroll_id: holidayRest.payroll_id,
          type_income_id: holidayRest.type_income_id,
          holiday_income_data: validated.rows,
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

    if (isHolidayType) {
      if (selectedInputMethod === "manualEntry") {
        if (!foundCollaborator) {
          onRequestError?.(
            "Debe buscar un colaborador para agregar un ingreso",
          );
          return;
        }

        const amountDays = data.holiday_payload?.amount_days;
        const identificationNumberValue =
          foundCollaborator.personal_information?.identification_number
            ?.replace(/-/g, "")
            .toUpperCase() ?? "";

        const manualRows = [
          {
            identification_number: identificationNumberValue,
            amount_days: Number(amountDays) || 0,
          },
        ];

        const validated = validateHolidayIncomePayload(manualRows);
        if (!validated.ok) {
          onRequestError?.(validated.error);
          return;
        }

        const {
          description: _description,
          identification_number: _id,
          ...holidayRest
        } = rest;

        await CreateIncome.mutateAsync(
          {
            company_id: holidayRest.company_id,
            module_code: holidayRest.module_code,
            branch_id: holidayRest.branch_id,
            payroll_id: holidayRest.payroll_id,
            type_income_id: holidayRest.type_income_id,
            holiday_income_data: validated.rows,
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

      const validated = validateHolidayIncomePayload(holiday_income_data);
      if (!validated.ok) {
        onRequestError?.(validated.error);
        return;
      }

      const {
        description: _description,
        identification_number: _id,
        ...holidayRest
      } = rest;

      await CreateIncome.mutateAsync(
        {
          company_id: holidayRest.company_id,
          module_code: holidayRest.module_code,
          branch_id: holidayRest.branch_id,
          payroll_id: holidayRest.payroll_id,
          type_income_id: holidayRest.type_income_id,
          holiday_income_data: validated.rows,
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
      const collaboratorIdentification =
        foundCollaborator?.personal_information?.identification_number ?? "";

      const identificationNumberValue = collaboratorIdentification
        .replace(/-/g, "")
        .toUpperCase();

      await CreateIncome.mutateAsync(
        {
          company_id: rest.company_id,
          module_code: rest.module_code,
          branch_id: rest.branch_id,
          payroll_id: rest.payroll_id,
          type_income_id: rest.type_income_id,
          commissions_payload: {
            currency: Number(commissions_payload?.currency) || 0,
            commission_amount:
              Number(commissions_payload?.commission_amount) || 0,
            identification_number: identificationNumberValue,
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

    if (isBonusType) {
      const collaboratorIdentification =
        foundCollaborator?.personal_information?.identification_number ?? "";

      const identificationNumberValue = collaboratorIdentification
        .replace(/-/g, "")
        .toUpperCase();

      await CreateIncome.mutateAsync(
        {
          company_id: rest.company_id,
          module_code: rest.module_code,
          branch_id: rest.branch_id,
          payroll_id: rest.payroll_id,
          type_income_id: rest.type_income_id,
          bonus_payload: {
            currency: Number(bonus_payload?.currency) || 0,
            bonus_amount: Number(bonus_payload?.bonus_amount) || 0,
            identification_number: identificationNumberValue,
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

    if (isDepreciationType) {
      const collaboratorIdentification =
        foundCollaborator?.personal_information?.identification_number ?? "";

      const identificationNumberValue = collaboratorIdentification
        .replace(/-/g, "")
        .toUpperCase();

      await CreateIncome.mutateAsync(
        {
          company_id: rest.company_id,
          module_code: rest.module_code,
          branch_id: rest.branch_id,
          payroll_id: rest.payroll_id,
          type_income_id: rest.type_income_id,
          depreciation_payload: {
            currency: Number(depreciation_payload?.currency) || 0,
            depreciation_amount:
              Number(depreciation_payload?.depreciation_amount) || 0,
            identification_number: identificationNumberValue,
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

  const hasOvertimeExcelData =
    isOvertimeType &&
    selectedInputMethod === "excelImport" &&
    (overtimeIncomePayload?.length ?? 0) > 0;

  const hasValidOvertimeManual =
    isOvertimeType &&
    selectedInputMethod === "manualEntry" &&
    !!foundCollaborator &&
    (overtimeManualPayload?.amount_hours ?? 0) > 0;

  const hasValidHolidayManual =
    isHolidayType &&
    selectedInputMethod === "manualEntry" &&
    !!foundCollaborator &&
    (holidayManualPayload?.amount_days ?? 0) > 0;

  const hasHolidayExcelData =
    isHolidayType &&
    selectedInputMethod === "excelImport" &&
    (holidayIncomePayload?.length ?? 0) > 0;

  const hasValidCommission =
    (commissionIncomePayload?.commission_amount ?? 0) > 0 &&
    (commissionIncomePayload?.currency ?? 0) !== 0;

  const hasValidBonus =
    (bonusIncomePayload?.bonus_amount ?? 0) > 0 &&
    (bonusIncomePayload?.currency ?? 0) !== 0;

  const hasValidDepreciation =
    (depreciationIncomePayload?.depreciation_amount ?? 0) > 0 &&
    (depreciationIncomePayload?.currency ?? 0) !== 0;

  const isSubmitDisabled =
    CreateIncome.isPending ||
    !methods.formState.isDirty ||
    !methods.formState.isValid ||
    !selectedIncomeTypeCode ||
    isSubsidyType ||
    (isOvertimeType && !(hasOvertimeExcelData || hasValidOvertimeManual)) ||
    (isHolidayType && !(hasHolidayExcelData || hasValidHolidayManual)) ||
    (isCommissionType && (!foundCollaborator || !hasValidCommission)) ||
    (isBonusType && (!foundCollaborator || !hasValidBonus)) ||
    (isDepreciationType && !hasValidDepreciation);

  const incomeTypeDropdown = (
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
            options={allIncomeTypeOptions.map((opt) => ({
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
  );

  const inputMethodSection = (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence initial={false}>
        {(isOvertimeType || isHolidayType) && (
          <m.div
            key="input-method"
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
            className="flex flex-row gap-4"
          >
            <RadioButton
              id="income-manual-entry"
              value="manualEntry"
              label="Introducir Manualmente"
              labelPosition="right"
              labelClassName={labelClassName}
              checked={selectedInputMethod === "manualEntry"}
              onChange={() => setSelectedInputMethod("manualEntry")}
            />

            <RadioButton
              id="income-excel-import"
              value="excelImport"
              label="Importar desde Excel"
              labelPosition="right"
              labelClassName={labelClassName}
              checked={selectedInputMethod === "excelImport"}
              onChange={() => {
                setSelectedInputMethod("excelImport");
                setFoundCollaborator(null);
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );

  const animatedCollaboratorSearchPanel = (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence initial={false}>
        {!foundCollaborator && needsCollaborator && !isSubsidyType && (
          <m.div
            key={`collaborator-search-${incomeTypeId}`}
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
          >
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
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );

  const animatedTypeFieldsPanel = (
    <LazyMotion features={loadMotionFeatures} strict>
      <AnimatePresence initial={false}>
        {!!foundCollaborator && isCommissionType && (
          <m.div
            key="commission-fields"
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
          >
            <Commission />
          </m.div>
        )}

        {!!foundCollaborator && isBonusType && (
          <m.div
            key="bonus-fields"
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
          >
            <Bonus />
          </m.div>
        )}

        {!!foundCollaborator &&
          isOvertimeType &&
          selectedInputMethod === "manualEntry" && (
            <m.div
              key="overtime-fields"
              initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                overflow: "visible",
              }}
              exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
              transition={formFieldsTransition}
            >
              <Overtime />
            </m.div>
          )}

        {isOvertimeType && selectedInputMethod === "excelImport" && (
          <m.div
            key="overtime-excel"
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
          >
            <FileUploader
              key={overtimeFileKey}
              title="Cargar archivo de horas extras"
              extensions={["xls", "xlsx"]}
              onFileSelect={handleOvertimeFileSelect}
              onFileRemove={handleOvertimeFileRemove}
            />
          </m.div>
        )}

        {!!foundCollaborator &&
          isHolidayType &&
          selectedInputMethod === "manualEntry" && (
            <m.div
              key="holiday-fields"
              initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                overflow: "visible",
              }}
              exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
              transition={formFieldsTransition}
            >
              <Holiday />
            </m.div>
          )}

        {isHolidayType && selectedInputMethod === "excelImport" && (
          <m.div
            key="holiday-excel"
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
          >
            <FileUploader
              key={holidayFileKey}
              title="Cargar archivo de feriados"
              extensions={["xls", "xlsx"]}
              onFileSelect={handleHolidayFileSelect}
              onFileRemove={handleHolidayFileRemove}
            />
          </m.div>
        )}

        {!!foundCollaborator && isDepreciationType && (
          <m.div
            key="depreciation-fields"
            initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              overflow: "visible",
            }}
            exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
            transition={formFieldsTransition}
          >
            <Depreciation />
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );

  const collaboratorSearchSection =
    isSubsidyType && !foundCollaborator && needsCollaborator ? (
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
    ) : null;

  const collaboratorSummarySection =
    foundCollaborator && needsCollaborator ? (
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
            onClick={handleClearCollaborator}
            aria-label="Quitar Colaborador"
          >
            <X size={20} />
          </button>
          <div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            Quitar Colaborador
          </div>
        </div>
      </div>
    ) : null;

  if (isSubsidyType) {
    return (
      <FormProvider {...methods}>
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-4">
            {incomeTypeDropdown}
            {collaboratorSearchSection}
            {collaboratorSummarySection}

            <LazyMotion features={loadMotionFeatures} strict>
              <AnimatePresence>
                {isAdministrator && foundCollaborator && (
                  <m.div
                    key="subsidy-form"
                    initial={{
                      opacity: 0,
                      y: 16,
                      height: 0,
                      overflow: "hidden",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: "auto",
                      overflow: "visible",
                    }}
                    exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                    transition={transition}
                    className="flex flex-col gap-4 sm:gap-5"
                  >
                    <AddSubsidyForm
                      payrollId={payrollId}
                      collaborator={foundCollaborator}
                      onCancel={onCancel}
                      onRequestSuccess={(message) => {
                        onRequestSuccess?.(message);
                        setFoundCollaborator(null);
                      }}
                      onRequestError={onRequestError}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
          </div>

          {!foundCollaborator && (
            <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                size="giant"
                label="Cancelar"
                onClick={onCancel}
                className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
              />
            </div>
          )}
        </div>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-w-0 flex-col gap-4 sm:gap-5"
        noValidate
      >
        <div className="flex flex-col gap-4">
          {incomeTypeDropdown}
          {inputMethodSection}
          {animatedCollaboratorSearchPanel}
          {collaboratorSummarySection}
          {animatedTypeFieldsPanel}
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
