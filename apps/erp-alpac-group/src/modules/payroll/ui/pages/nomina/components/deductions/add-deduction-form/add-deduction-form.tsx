import { useCallback, useEffect, useState } from "react";
import { Button, Dropdown } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import {
//   DeductionCodeEnum,
//   DeductionOptions,
// } from "@app/modules/payroll/domain/enums/deduction-enums/deduction.enum";
import {
  DeductionTypeEnum,
  DeductionTypeOptions,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ChildSupportGarnishment } from "@app/modules/payroll/ui/pages/nomina/components/deductions/child-support-garnishment/child-support-garnishment";
import { Sanctions } from "@app/modules/payroll/ui/pages/nomina/components/deductions/sanction/sanction";
import { JudicialGarnishment } from "@app/modules/payroll/ui/pages/nomina/components/deductions/judicial-garnishment/judicial-garnishment";
import { LoanRepayment } from "@app/modules/payroll/ui/pages/nomina/components/deductions/loan-repayment/loan-repayment";

import type {
  AddDeductionFormValues,
  CreateLateArrivalsDeductionRequest,
  CreatePurisimaDeductionRequest,
  CreateStandardDeductionRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { AddDeductionFormProps } from "./add-deduction-form.types";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { OtherDeduction } from "../other-deduction/other-deduction";
import { FileUploader } from "@app/shared/components/file-uploader/file-uploader";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
// import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import {
  mapLateArrivalsDeductionError,
  parseLateArrivalsExcel,
  validateLateArrivalsPayload,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/utils/parse-late-arrivals-excel";
import {
  mapPurisimaDeductionError,
  parsePurisimaExcel,
  validatePurisimaPayload,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/utils/parse-purisima-excel";
import { X } from "lucide-react";

const inputClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const isLateArrivalType = (type: AddDeductionFormValues["deduction_type"]) =>
  type === DeductionTypeEnum.LATE_ARRIVAL.value;

const isPurisimaType = (type: AddDeductionFormValues["deduction_type"]) =>
  type === DeductionTypeEnum.PURISIMA.value;

const isBulkExcelDeductionType = (
  type: AddDeductionFormValues["deduction_type"],
) => isLateArrivalType(type) || isPurisimaType(type);

export const AddDeductionForm = ({
  branchId,
  payrollId,
  onSubmit,
  onCancel,
  onRequestError,
  onRequestSuccess,
}: AddDeductionFormProps): React.ReactNode => {
  const { moduleCode, companyId } = useUserStore();
  const { CreateDeduction } = useDeduction();
  const { getMappedError } = useMappedError();
  const [lateArrivalsFileKey, setLateArrivalsFileKey] = useState(0);
  const [purisimaFileKey, setPurisimaFileKey] = useState(0);

  const methods = useForm<AddDeductionFormValues>({
    mode: "onChange",
    defaultValues: {
      deduction_type: "",
      company_id: companyId,
      module_code: moduleCode,
      payroll_id: payrollId,
      branch_id: branchId,
      collaborator_id: "",
      description: "",
      late_arrivals_data: undefined,
      purisima_data: undefined,
    },
  });

  useEffect(() => {
    methods.setValue("payroll_id", payrollId);
  }, [payrollId, methods]);

  useEffect(() => {
    methods.setValue("branch_id", branchId);
  }, [branchId, methods]);

  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);

  const deductionType = methods.watch("deduction_type");
  const lateArrivalsPayload = methods.watch("late_arrivals_data");
  const purisimaPayload = methods.watch("purisima_data");

  useEffect(() => {
    if (!isLateArrivalType(deductionType)) {
      methods.setValue("late_arrivals_data", undefined);
    }
    if (!isPurisimaType(deductionType)) {
      methods.setValue("purisima_data", undefined);
    }
  }, [deductionType, methods]);

  const handleLateArrivalsFileRemove = useCallback(() => {
    methods.setValue("late_arrivals_data", undefined);
  }, [methods]);

  const handleLateArrivalsFileSelect = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = parseLateArrivalsExcel(buffer);
        if (!result.ok) {
          onRequestError?.(result.error);
          methods.setValue("late_arrivals_data", undefined);
          setLateArrivalsFileKey((k) => k + 1);
          return;
        }
        methods.setValue("late_arrivals_data", result.rows, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch {
        onRequestError?.(
          "No se pudo leer el archivo. Intente de nuevo con un formato .xls o .xlsx válido.",
        );
        methods.setValue("late_arrivals_data", undefined);
        setLateArrivalsFileKey((k) => k + 1);
      }
    },
    [methods, onRequestError],
  );

  const handlePurisimaFileRemove = useCallback(() => {
    methods.setValue("purisima_data", undefined);
  }, [methods]);

  const handlePurisimaFileSelect = useCallback(
    async (file: File) => {
      try {
        const buffer = await file.arrayBuffer();
        const result = parsePurisimaExcel(buffer);
        if (!result.ok) {
          onRequestError?.(result.error);
          methods.setValue("purisima_data", undefined);
          setPurisimaFileKey((k) => k + 1);
          return;
        }
        methods.setValue("purisima_data", result.rows, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch {
        onRequestError?.(
          "No se pudo leer el archivo. Intente de nuevo con un .xls o .xlsx válido.",
        );
        methods.setValue("purisima_data", undefined);
        setPurisimaFileKey((k) => k + 1);
      }
    },
    [methods, onRequestError],
  );

  const handleSubmitDeduction = useCallback(
    (data: AddDeductionFormValues) => {
      if (
        !foundCollaborator &&
        !isBulkExcelDeductionType(data.deduction_type)
      ) {
        onRequestError?.(
          "Debe buscar un colaborador para agregar una deducción",
        );
        return;
      }

      if (isLateArrivalType(data.deduction_type)) {
        const {
          late_arrivals_data,
          description: _description,
          collaborator_id: _collaboratorId,
          purisima_data: _purisima,
          salary_advance_payload: _salaryAdvancePayload,
          ...lateArrivalsBase
        } = data;

        const validated = validateLateArrivalsPayload(late_arrivals_data);
        if (!validated.ok) {
          onRequestError?.(validated.error);
          return;
        }

        const lateArrivalsPayload: CreateLateArrivalsDeductionRequest = {
          company_id: lateArrivalsBase.company_id,
          module_code: lateArrivalsBase.module_code,
          branch_id: lateArrivalsBase.branch_id,
          payroll_id: lateArrivalsBase.payroll_id,
          deduction_type: Number(DeductionTypeEnum.LATE_ARRIVAL.value),
          late_arrivals_data: validated.rows,
        };

        CreateDeduction.mutate(lateArrivalsPayload, {
          onSuccess: () => {
            methods.reset();
            onSubmit?.(lateArrivalsPayload);
            onRequestSuccess?.("Deducción agregada correctamente");
            onCancel?.();
          },
          onError: (error: ApiErrorResponse) => {
            const mappedError = getMappedError(error);
            onRequestError?.(
              mapLateArrivalsDeductionError(mappedError?.description),
            );
          },
        });
        return;
      }

      if (isPurisimaType(data.deduction_type)) {
        const {
          purisima_data,
          description: _description,
          collaborator_id: _collaboratorId,
          late_arrivals_data: _lateArrivals,
          salary_advance_payload: _salaryAdvance,
          ...purisimaBase
        } = data;

        const validated = validatePurisimaPayload(purisima_data);
        if (!validated.ok) {
          onRequestError?.(validated.error);
          return;
        }

        const purisimaRequest: CreatePurisimaDeductionRequest = {
          company_id: purisimaBase.company_id,
          module_code: purisimaBase.module_code,
          branch_id: purisimaBase.branch_id,
          payroll_id: purisimaBase.payroll_id,
          deduction_type: Number(DeductionTypeEnum.PURISIMA.value),
          purisima_data: validated.rows,
        };

        CreateDeduction.mutate(purisimaRequest, {
          onSuccess: () => {
            methods.reset();
            onSubmit?.(purisimaRequest);
            onRequestSuccess?.("Deducción agregada correctamente");
            onCancel?.();
          },
          onError: (error: ApiErrorResponse) => {
            const mappedError = getMappedError(error);
            onRequestError?.(
              mapPurisimaDeductionError(mappedError?.description),
            );
          },
        });
        return;
      }

      const {
        late_arrivals_data: _lateArrivals,
        purisima_data: _purisima,
        salary_advance_payload: _salaryAdvancePayload,
        ...baseData
      } = data;

      const finalPayload: CreateStandardDeductionRequest = {
        company_id: baseData.company_id,
        module_code: baseData.module_code,
        branch_id: baseData.branch_id,
        payroll_id: baseData.payroll_id,
        deduction_type: Number(baseData.deduction_type),
        collaborator_id: baseData.collaborator_id ?? "",
        description: baseData.description ?? "",
      };

      if (foundCollaborator) {
        finalPayload.collaborator_id =
          foundCollaborator.collaborator_id.toString();
      }

      CreateDeduction.mutate(finalPayload, {
        onSuccess: () => {
          methods.reset();
          onSubmit?.(finalPayload);
          onRequestSuccess?.("Deducción agregada correctamente");
          onCancel?.();
        },
        onError: (error: ApiErrorResponse) => {
          const mappedError = getMappedError(error);
          onRequestError?.(
            mappedError?.description || "Error al agregar deducción",
          );
        },
      });
    },
    [
      CreateDeduction,
      foundCollaborator,
      getMappedError,
      methods,
      onCancel,
      onSubmit,
      onRequestError,
      onRequestSuccess,
    ],
  );

  const isSubmitEnabledType =
    isLateArrivalType(deductionType) || isPurisimaType(deductionType);

  const hasLateArrivalsData =
    isLateArrivalType(deductionType) && (lateArrivalsPayload?.length ?? 0) > 0;

  const hasPurisimaData =
    isPurisimaType(deductionType) && (purisimaPayload?.length ?? 0) > 0;

  const isSubmitDisabled =
    !methods.formState.isDirty ||
    !methods.formState.isValid ||
    !isSubmitEnabledType ||
    (isLateArrivalType(deductionType) && !hasLateArrivalsData) ||
    (isPurisimaType(deductionType) && !hasPurisimaData);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4"
        onSubmit={methods.handleSubmit(handleSubmitDeduction)}
      >
        <div>
          <Controller
            name="deduction_type"
            control={methods.control}
            rules={{
              required: false,
            }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de deducción"
                placeholder="Seleccione el tipo de deducción"
                appearance="dark"
                isRequired
                value={field?.value}
                onChange={(value) => {
                  field.onChange(value);
                  setFoundCollaborator(null);
                }}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={inputClassName}
                options={DeductionTypeOptions}
              />
            )}
          />
        </div>

        {!!foundCollaborator && !isBulkExcelDeductionType(deductionType) && (
          <div className="relative flex w-full min-w-0 flex-row items-center gap-4">
            <div className="min-w-0 flex-1">
              <CollaboratorSummary
                fullName={foundCollaborator?.full_name ?? ""}
                workPosition={foundCollaborator?.work_position ?? ""}
                isFullNameLoading={false}
                isWorkPositionLoading={false}
              />
            </div>

            <div className="group absolute top-0 right-0 flex items-center sm:top-auto">
              <button
                type="button"
                className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
                onClick={() => {
                  setFoundCollaborator(null);
                }}
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

        {deductionType === DeductionTypeEnum.LOAN.value && <LoanRepayment />}
        {isLateArrivalType(deductionType) && (
          <FileUploader
            key={lateArrivalsFileKey}
            title="Cargar archivo de llegadas tardes"
            description="Formato .xls o .xlsx (columna A: ID empleado, columna C: minutos)"
            extensions={["xls", "xlsx"]}
            readySubmitLabel="Agregar Deducción"
            onFileSelect={handleLateArrivalsFileSelect}
            onFileRemove={handleLateArrivalsFileRemove}
          />
        )}
        {isPurisimaType(deductionType) && (
          <FileUploader
            key={purisimaFileKey}
            title="Cargar archivo de purísima"
            description="Formato .xls o .xlsx (columna A: ID empleado, columna C: monto)"
            extensions={["xls", "xlsx"]}
            readySubmitLabel="Agregar Deducción"
            onFileSelect={handlePurisimaFileSelect}
            onFileRemove={handlePurisimaFileRemove}
          />
        )}
        {deductionType === DeductionTypeEnum.SANCTION.value && <Sanctions />}
        {deductionType ===
          DeductionTypeEnum.CHILD_SUPPORT_GARNISHMENT.value && (
          <ChildSupportGarnishment />
        )}
        {deductionType === DeductionTypeEnum.JUDICIAL_GARNISHMENT.value && (
          <JudicialGarnishment />
        )}
        {deductionType === DeductionTypeEnum.OTHER_DEDUCTION.value && (
          <OtherDeduction />
        )}

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
            label="Agregar Deducción"
            disabled={isSubmitDisabled}
            isLoading={CreateDeduction.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
          />
        </div>
      </form>
    </FormProvider>
  );
};
