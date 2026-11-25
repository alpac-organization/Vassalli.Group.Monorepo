import {
  Button,
  DatePicker,
  type DatePickerValue,
  Dropdown,
  InputText,
  Modal,
  type Option,
} from "@alpac/design-system";
import { CurrencyOptions } from "@app/core/enums/currency.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { useJobPositions } from "@app/modules/admin/ui/hooks/job-positions/useJobPositions";
import type { CreatePersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/create-personnel-action.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import {
  formatIncreaseValueDisplay,
  getSalaryIncreaseTypeLabel,
  SalaryIncreaseTypeOptions,
} from "@app/modules/payroll/domain/enums/personnel-action-enums/salary-increase-type.enum";
import { usePersonnelAction } from "@app/modules/payroll/ui/hooks/personnel-action/usePersonnelAction";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { PdfUploader } from "@app/shared/components/pdf-uploader/pdf-uploader";
import type { PdfUploaderValue } from "@app/shared/components/pdf-uploader/pdf-uploader.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import {
  formatCurrency,
  resolveCurrencyCode,
  resolveCurrencyOptionValue,
} from "@app/shared/utils/currency.utils";
import { toApiDate } from "@app/shared/utils/date.utils";
import { getMappedOptionList } from "@app/shared/utils/values.utils";
import dayjs from "dayjs";
import {
  AlertCircleIcon,
  Building2Icon,
  CalculatorIcon,
  CheckIcon,
  PlusIcon,
  Trash2Icon,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import {
  actionApproveButtonClassName,
  actionCancelOutlineClassName,
  actionDropdownClassName,
  actionInputClassName,
  actionLabelClassName,
  actionModalContentClassName,
  actionModalPanelClassName,
  actionPrimaryButtonClassName,
  sectionTitleClassName,
} from "../../utils/personnel-actions.constants";
import { calculateProjectedSalary } from "../../utils/personnel-actions.utils";
import type {
  CreatePersonnelActionModalProps,
  StagedCollaboratorItem,
} from "./create-personnel-action-modal.types";

type CreateActionFormValues = {
  scope: string; // "1" | "2" | "3"
  increase_type: string; // "0" | "1" | "2" | "3"
  increase_value: string;
  area_id: string;
  effective_date: DatePickerValue | null;
  justification: string;
};

const SCOPE_SELECT_OPTIONS: Option[] = [
  { label: "Individual (1 Colaborador)", value: "1" },
  { label: "Masivo (Múltiples Colaboradores)", value: "2" },
  { label: "Por Área (Área Completa)", value: "3" },
];

export const CreatePersonnelActionModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePersonnelActionModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestError } = useAlertState();

  const [currentCollaborator, setCurrentCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [stagedList, setStagedList] = useState<StagedCollaboratorItem[]>([]);
  const [attachment, setAttachment] = useState<PdfUploaderValue>({
    fileName: null,
    base64: null,
  });

  // Current proposal input fields
  const [propSalary, setPropSalary] = useState<string>("");
  const [propCurrency, setPropCurrency] = useState<string>("1");
  const [propJobPositionId, setPropJobPositionId] = useState<string>("");
  const [propCostCenterId, setPropCostCenterId] = useState<string>("");
  const [proposalError, setProposalError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateActionFormValues>({
    defaultValues: {
      scope: "1",
      increase_type: "0",
      increase_value: "",
      area_id: "",
      effective_date: null,
      justification: "",
    },
  });

  const selectedScope = useWatch({ control, name: "scope" });
  const selectedIncreaseType = useWatch({ control, name: "increase_type" });
  const increaseValueInput = useWatch({ control, name: "increase_value" });
  const selectedAreaId = useWatch({ control, name: "area_id" });

  const isByArea = selectedScope === "3";
  const hasIncreaseMode = selectedIncreaseType !== "0";

  // Lazy catalog queries: only load when the user actually reaches that step
  const shouldFetchCollabCatalogs = Boolean(
    isOpen && !isByArea && currentCollaborator && companyId && moduleCode,
  );
  const shouldFetchAreas = Boolean(isOpen && isByArea && companyId && moduleCode);

  const { GetJobPositionsByCompany } = useJobPositions({
    company_id: shouldFetchCollabCatalogs ? companyId : "",
    module_code: shouldFetchCollabCatalogs ? moduleCode : "",
  });
  const { GetCostCentersByBranch } = useCostCenters({
    getCostCentersByBranchPayload: shouldFetchCollabCatalogs
      ? { company_id: companyId, module_code: moduleCode }
      : undefined,
  });
  const { GetAreasByCompany } = useAreas({
    company_id: shouldFetchAreas ? companyId : "",
    module_code: shouldFetchAreas ? moduleCode : "",
  });

  const jobPositionOptions = useMemo<Option[]>(
    () => [
      { label: "Sin cambio de cargo", value: "" },
      ...getMappedOptionList({
        list: GetJobPositionsByCompany.data ?? [],
        label: "job_position_name",
        value: "job_position_id",
      }),
    ],
    [GetJobPositionsByCompany.data],
  );

  const costCenterOptions = useMemo<Option[]>(
    () => [
      { label: "Sin cambio de centro de costo", value: "" },
      ...getMappedOptionList({
        list: GetCostCentersByBranch.data ?? [],
        label: "cost_center_name",
        value: "cost_center_id",
      }),
    ],
    [GetCostCentersByBranch.data],
  );

  const areaOptions = useMemo<Option[]>(
    () => [
      { label: "Seleccione un área...", value: "" },
      ...getMappedOptionList({
        list: GetAreasByCompany.data ?? [],
        label: "work_area_name",
        value: "work_area_id",
      }),
    ],
    [GetAreasByCompany.data],
  );

  const currencyOptions = useMemo<Option[]>(
    () =>
      getMappedOptionList({
        list: CurrencyOptions,
        label: "label",
        value: (c) => c.value.toString(),
      }),
    [],
  );

  const increaseTypeOptions = useMemo<Option[]>(
    () =>
      getMappedOptionList({
        list: SalaryIncreaseTypeOptions.filter((opt) => (isByArea ? opt.value !== 0 : true)),
        label: "label",
        value: (opt) => opt.value.toString(),
      }),
    [isByArea],
  );

  const selectedArea = useMemo(
    () => (GetAreasByCompany.data ?? []).find((a) => a.work_area_id === selectedAreaId),
    [GetAreasByCompany.data, selectedAreaId],
  );

  const { CreatePersonnelAction } = usePersonnelAction();

  // Auto-calculate proposed salary when collaborator or increase rule changes
  useEffect(() => {
    if (!currentCollaborator || !hasIncreaseMode) return;
    const baseSalary = currentCollaborator.salary_information?.salary ?? 0;
    const valNum = parseFloat(increaseValueInput);
    const projected = calculateProjectedSalary(baseSalary, selectedIncreaseType, valNum);
    if (projected !== null) {
      setPropSalary(projected.toString());
    }
  }, [currentCollaborator, hasIncreaseMode, selectedIncreaseType, increaseValueInput]);

  const clearCurrentCollaborator = useCallback(() => {
    setCurrentCollaborator(null);
    setPropSalary("");
    setPropCurrency("1");
    setPropJobPositionId("");
    setPropCostCenterId("");
    setProposalError(null);
  }, []);

  const resetAll = useCallback(() => {
    clearCurrentCollaborator();
    setStagedList([]);
    setAttachment({ fileName: null, base64: null });
    reset({
      scope: "1",
      increase_type: "0",
      increase_value: "",
      area_id: "",
      effective_date: null,
      justification: "",
    });
  }, [clearCurrentCollaborator, reset]);

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleSelectCollaborator = (collab: GetCollaboratorProfileDetailsResponse) => {
    setCurrentCollaborator(collab);
    setPropSalary("");
    setPropCurrency(resolveCurrencyOptionValue(collab.salary_information?.currency));
    setProposalError(null);
  };

  const handleApplyBatchCalculation = () => {
    if (!hasIncreaseMode) {
      setProposalError("Seleccione una modalidad de aumento salarial para calcular el lote");
      return;
    }

    const valNum = parseFloat(increaseValueInput);
    if (Number.isNaN(valNum) || valNum <= 0) {
      setProposalError("Ingrese un valor de incremento mayor a cero antes de calcular");
      return;
    }

    let missingBaseSalary = 0;
    const recalculated = stagedList.map((item) => {
      const projected = calculateProjectedSalary(
        item.current_salary,
        selectedIncreaseType,
        valNum,
      );
      if (projected === null) {
        missingBaseSalary++;
        return item;
      }
      return {
        ...item,
        proposed_salary: projected,
        proposed_currency:
          item.proposed_currency ??
          parseInt(resolveCurrencyOptionValue(item.current_currency), 10),
      };
    });

    setStagedList(recalculated);
    setProposalError(
      missingBaseSalary > 0
        ? `Cálculo aplicado. Nota: ${missingBaseSalary} colaborador(es) no poseen salario base registrado.`
        : null,
    );
  };

  const handleInlineSalaryChange = (collaboratorId: string, rawValue: string) => {
    const parsed = rawValue === "" ? null : parseFloat(rawValue);
    setStagedList((prev) =>
      prev.map((item) => {
        if (item.collaborator_id !== collaboratorId) return item;
        const validSalary =
          parsed !== null && !Number.isNaN(parsed) && parsed > 0 ? parsed : null;
        return {
          ...item,
          proposed_salary: validSalary,
          proposed_currency:
            validSalary !== null
              ? (item.proposed_currency ??
                parseInt(resolveCurrencyOptionValue(item.current_currency), 10))
              : null,
        };
      }),
    );
  };

  /** Builds and validates a StagedCollaboratorItem from current inputs; sets error and returns null on invalid state. */
  const buildProposalFromInputs = (): StagedCollaboratorItem | null => {
    if (!currentCollaborator) {
      setProposalError("Debes buscar y seleccionar un colaborador");
      return null;
    }

    const salaryNum = propSalary ? parseFloat(propSalary) : null;
    const hasSalary = salaryNum !== null && !isNaN(salaryNum) && salaryNum > 0;
    const hasJobPosition = Boolean(propJobPositionId);
    const hasCostCenter = Boolean(propCostCenterId);

    if (!hasSalary && !hasJobPosition && !hasCostCenter) {
      setProposalError(
        "Debe proponer al menos un cambio (Salario, Cargo o Centro de Costo)",
      );
      return null;
    }

    const jobName =
      (GetJobPositionsByCompany.data ?? []).find(
        (jp) => jp.job_position_id === propJobPositionId,
      )?.job_position_name || null;

    const ccName =
      (GetCostCentersByBranch.data ?? []).find(
        (cc) => cc.cost_center_id === propCostCenterId,
      )?.cost_center_name || null;

    return {
      collaborator_id: currentCollaborator.collaborator_id,
      collaborator_code: currentCollaborator.collaborator_code,
      full_name: currentCollaborator.full_name,
      identification_number:
        currentCollaborator.personal_information?.identification_number,
      current_salary: currentCollaborator.salary_information?.salary,
      current_currency: currentCollaborator.salary_information?.currency,
      current_job_position: currentCollaborator.work_position,
      current_cost_center: currentCollaborator.cost_centers?.[0]?.cost_center_name,
      proposed_salary: hasSalary ? salaryNum : null,
      proposed_currency: hasSalary ? parseInt(propCurrency, 10) : null,
      proposed_job_position_id: propJobPositionId || null,
      proposed_job_position_name: jobName,
      proposed_cost_center_id: propCostCenterId || null,
      proposed_cost_center_name: ccName,
    };
  };

  const handleAddCollaborator = () => {
    const newItem = buildProposalFromInputs();
    if (!newItem) return;

    if (
      stagedList.some((item) => item.collaborator_id === newItem.collaborator_id)
    ) {
      setProposalError("Este colaborador ya ha sido agregado a la lista");
      return;
    }

    if (selectedScope === "1") {
      setStagedList([newItem]);
    } else {
      setStagedList((prev) => [...prev, newItem]);
    }
    clearCurrentCollaborator();
    setProposalError(null);
  };

  const handleRemoveStagedItem = (collabId: string) => {
    setStagedList((prev) => prev.filter((i) => i.collaborator_id !== collabId));
    if (selectedScope === "1") {
      clearCurrentCollaborator();
    }
  };

  const onSubmit: SubmitHandler<CreateActionFormValues> = async (values) => {
    const increaseTypeNum = parseInt(values.increase_type, 10);
    const increaseValueNum = values.increase_value
      ? parseFloat(values.increase_value)
      : null;

    if (
      increaseTypeNum !== 0 &&
      (increaseValueNum === null ||
        Number.isNaN(increaseValueNum) ||
        increaseValueNum <= 0)
    ) {
      setProposalError("Debe ingresar un valor de incremento salarial mayor a cero");
      return;
    }

    let finalCollaborators = [...stagedList];

    if (values.scope === "3") {
      if (!values.area_id) {
        setProposalError("Debe seleccionar un área para solicitudes con alcance Por Área");
        return;
      }
      finalCollaborators = [];
    } else {
      if (values.scope === "1" && (finalCollaborators.length === 0 || currentCollaborator)) {
        const singleItem = buildProposalFromInputs();
        if (!singleItem) return;
        finalCollaborators = [singleItem];
      }

      if (finalCollaborators.length === 0) {
        setProposalError("Debes incluir al menos un colaborador con propuesta de cambio");
        return;
      }

      const hasEmptyProposal = finalCollaborators.some(
        (c) =>
          !c.proposed_salary &&
          !c.proposed_job_position_id &&
          !c.proposed_cost_center_id,
      );
      if (hasEmptyProposal) {
        setProposalError(
          "Todos los colaboradores incluidos deben tener al menos un cambio propuesto (Salario, Cargo o Centro de Costo)",
        );
        return;
      }
    }

    const dateFormatted = toApiDate(values.effective_date);
    if (!dateFormatted) return;

    const payload: CreatePersonnelActionRequest = {
      company_id: companyId,
      module_code: moduleCode,
      scope: parseInt(values.scope, 10),
      increase_type: increaseTypeNum,
      increase_value: increaseTypeNum !== 0 ? increaseValueNum : null,
      area_id: values.scope === "3" ? values.area_id : null,
      effective_date: `${dateFormatted}T00:00:00Z`,
      justification: values.justification.trim(),
      attachment_base64: attachment.base64 || null,
      attachment_file_name: attachment.fileName || null,
      collaborators: finalCollaborators.map((c) => ({
        collaborator_id: c.collaborator_id,
        new_salary: c.proposed_salary ?? null,
        new_currency: c.proposed_currency ?? null,
        new_job_position_id: c.proposed_job_position_id ?? null,
        new_cost_center_id: c.proposed_cost_center_id ?? null,
      })),
    };

    try {
      await CreatePersonnelAction.mutateAsync(payload);
      onSuccess?.("Solicitud de Acción de Personal registrada exitosamente");
      handleClose();
    } catch (err) {
      const mapped = getMappedError(err as ApiErrorResponse);
      handleRequestError(mapped.description || "Error al registrar la solicitud");
    }
  };

  const increaseValueLabel =
    selectedIncreaseType === "1"
      ? "Monto Fijo a Sumar"
      : selectedIncreaseType === "3"
      ? "Porcentaje Salario Mínimo (%)"
      : "Porcentaje de Incremento (%)";

  const formattedIncreasePreview = formatIncreaseValueDisplay(
    selectedIncreaseType,
    increaseValueInput ? parseFloat(increaseValueInput) : null,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      size="4xl"
      title="Nueva Solicitud de Acción de Personal"
      description="Registra aumentos salariales (monto fijo, porcentual o salario mínimo), promociones o traslados"
      panelClassName={actionModalPanelClassName}
      contentClassName={actionModalContentClassName}
    >
      <form
        id="create-action-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 flex flex-col gap-6 pb-2">
          {AlertComponent}
          {/* Section 1: General info */}
          <section className="flex flex-col gap-4">
            <h4 className={sectionTitleClassName}>1. Información General</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="scope"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Alcance de la Solicitud"
                    appearance="dark"
                    options={SCOPE_SELECT_OPTIONS}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setStagedList([]);
                      clearCurrentCollaborator();
                      setValue("area_id", "");
                      if (val === "3" && selectedIncreaseType === "0") {
                        setValue("increase_type", "3");
                      }
                    }}
                    labelClassName={actionLabelClassName}
                    valueClassName={actionLabelClassName}
                    className={actionDropdownClassName}
                  />
                )}
              />

              <Controller
                name="effective_date"
                control={control}
                rules={{
                  required: "La fecha efectiva es requerida",
                  validate: (value) => {
                    if (!value) return "La fecha efectiva es requerida";
                    const d = dayjs((value as DatePickerValue)?.$d ?? value);
                    if (!d.isValid()) return "Fecha inválida";
                    const dateNum = d.date();
                    if (dateNum !== 1 && dateNum !== 16) {
                      return "Debe coincidir con inicio de quincena (día 1 o 16 del mes)";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    fieldWidth="large"
                    label="Fecha Efectiva (Día 1 ó 16)"
                    labelAbove
                    className={actionDropdownClassName}
                    labelClassName={actionLabelClassName}
                    value={field.value}
                    errorVariant="tooltip"
                    error={errors.effective_date?.message?.toString()}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />

              {isByArea && (
                <div className="sm:col-span-2">
                  <Controller
                    name="area_id"
                    control={control}
                    rules={{
                      required: isByArea ? "Debe seleccionar un área" : false,
                    }}
                    render={({ field }) => (
                      <Dropdown
                        label="Área Destino (Aplica a todos los colaboradores activos del área)"
                        appearance="dark"
                        options={areaOptions}
                        isLoading={GetAreasByCompany.isLoading}
                        value={field.value}
                        onChange={(val) => {
                          field.onChange(val);
                          setProposalError(null);
                        }}
                        errorVariant="tooltip"
                        error={errors.area_id?.message}
                        labelClassName={actionLabelClassName}
                        valueClassName={actionLabelClassName}
                        className={actionDropdownClassName}
                      />
                    )}
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <InputText
                  label="Justificación / Motivo"
                  className={actionInputClassName}
                  labelClassName={actionLabelClassName}
                  placeholder="Explique el motivo del ajuste, ascenso o reubicación (máx. 1000 caracteres)"
                  errorVariant="tooltip"
                  error={errors.justification?.message}
                  {...register("justification", {
                    required: "La justificación es requerida",
                    maxLength: {
                      value: 1000,
                      message: "Máximo 1000 caracteres",
                    },
                    minLength: {
                      value: 5,
                      message: "Mínimo 5 caracteres",
                    },
                  })}
                />
              </div>

              <div className="sm:col-span-2">
                <PdfUploader
                  label="Documento de Soporte (Petición en PDF)"
                  fileName={attachment.fileName}
                  onChange={(next) => setAttachment(next)}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Salary Adjustment Rule */}
          <section className="flex flex-col gap-4">
            <h4 className={sectionTitleClassName}>2. Modalidad de Ajuste Salarial</h4>
            <div className="rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/70 dark:bg-[#363a45]/30 p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <Controller
                  name="increase_type"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      label="Tipo de Incremento"
                      appearance="dark"
                      options={increaseTypeOptions}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        setProposalError(null);
                        if (val === "0") {
                          setValue("increase_value", "");
                        }
                      }}
                      labelClassName={actionLabelClassName}
                      valueClassName={actionLabelClassName}
                      className={actionDropdownClassName}
                    />
                  )}
                />

                {hasIncreaseMode && (
                  <InputText
                    label={increaseValueLabel}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder={selectedIncreaseType === "1" ? "Ej. 1500.00" : "Ej. 8.50"}
                    className={actionInputClassName}
                    labelClassName={actionLabelClassName}
                    errorVariant="tooltip"
                    error={errors.increase_value?.message}
                    {...register("increase_value", {
                      validate: (val) => {
                        if (!hasIncreaseMode) return true;
                        const num = parseFloat(val);
                        if (Number.isNaN(num) || num <= 0) {
                          return "Debe ser mayor a cero";
                        }
                        return true;
                      },
                    })}
                  />
                )}

                {hasIncreaseMode && selectedScope === "2" && stagedList.length > 0 && (
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      type="button"
                      label="Aplicar Cálculo al Lote"
                      icon={<CalculatorIcon size={16} />}
                      size="medium"
                      className={actionApproveButtonClassName}
                      onClick={handleApplyBatchCalculation}
                    />
                  </div>
                )}
              </div>

              {selectedIncreaseType === "3" && (
                <p className="text-xs text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/40 rounded-lg px-3 py-2">
                  El ajuste anual por salario mínimo se reflejará automáticamente en los
                  memorándums legales citando la resolución vigente de la Comisión Nacional de
                  Salario Mínimo.
                </p>
              )}
            </div>
          </section>

          {/* Section 3: Area summary OR Collaborator selection */}
          <section className="flex flex-col gap-4">
            <h4 className={sectionTitleClassName}>
              {isByArea
                ? "3. Resumen de Aplicación por Área"
                : "3. Selección de Colaborador y Propuesta de Cambio"}
            </h4>

            {isByArea ? (
              <div className="rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#272b34] p-4 flex items-start gap-3 text-xs">
                <Building2Icon
                  size={20}
                  className="shrink-0 mt-0.5 text-alpac-primary-500"
                />
                <div className="flex flex-col gap-1 text-slate-700 dark:text-slate-200">
                  <span className="font-semibold text-sm">
                    {selectedArea
                      ? `Área seleccionada: ${selectedArea.work_area_name}`
                      : "Seleccione un área en la sección 1"}
                  </span>
                  {selectedArea && (
                    <span className="text-slate-500 dark:text-slate-400">
                      Centros de costo asociados: {selectedArea.cost_centers?.length ?? 0}
                    </span>
                  )}
                  <span className="text-slate-600 dark:text-slate-300 mt-1">
                    {formattedIncreasePreview ? (
                      <>
                        Al registrar la solicitud, el sistema incluirá automáticamente a todos
                        los colaboradores activos con salario vigente en esta área y calculará el
                        ajuste{" "}
                        <strong>
                          {getSalaryIncreaseTypeLabel(selectedIncreaseType)} (
                          {formattedIncreasePreview})
                        </strong>{" "}
                        sobre su salario actual.
                      </>
                    ) : (
                      "Ingrese el valor del incremento en la sección 2 para proyectar el ajuste sobre toda el área."
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {!currentCollaborator && (
                  <div className="rounded-xl border border-dashed border-slate-300 dark:border-neutral-600 p-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300 mb-2 block">
                      Busque al colaborador por número de cédula:
                    </span>
                    <CollaboratorSearchForm
                      onSuccess={handleSelectCollaborator}
                      onError={(err) => setProposalError(err)}
                      onSearchStart={() => setProposalError(null)}
                      label="Buscar Cédula"
                    />
                  </div>
                )}

                {currentCollaborator && (
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50/50 dark:bg-[#363a45]/30 p-4">
                    <div className="flex items-center justify-between">
                      <CollaboratorSummary
                        fullName={currentCollaborator.full_name}
                        workPosition={currentCollaborator.work_position || "Sin cargo"}
                      />
                      <button
                        type="button"
                        onClick={clearCurrentCollaborator}
                        className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        title="Cambiar colaborador"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Current conditions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg bg-white dark:bg-[#272b34] p-3 text-xs border border-slate-200 dark:border-neutral-700">
                      <div>
                        <span className="text-slate-400 block">Salario Actual:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {formatCurrency(
                            currentCollaborator.salary_information?.salary ?? 0,
                            resolveCurrencyCode(
                              currentCollaborator.salary_information?.currency,
                            ),
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Cargo Actual:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {currentCollaborator.work_position || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Centro de Costo Actual:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {currentCollaborator.cost_centers?.[0]?.cost_center_name || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Proposed conditions */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Condiciones Propuestas (Complete al menos un cambio):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputText
                          label="Nuevo Salario"
                          type="number"
                          step="any"
                          min="1"
                          placeholder="Ej. 25000"
                          className={actionInputClassName}
                          labelClassName={actionLabelClassName}
                          value={propSalary}
                          onChange={(e) => setPropSalary(e.target.value)}
                        />

                        <Dropdown
                          label="Moneda"
                          appearance="dark"
                          options={currencyOptions}
                          value={propCurrency}
                          onChange={(val) => setPropCurrency(val)}
                          labelClassName={actionLabelClassName}
                          valueClassName={actionLabelClassName}
                          className={actionDropdownClassName}
                          disabled={!propSalary}
                        />

                        <Dropdown
                          label="Nuevo Cargo"
                          appearance="dark"
                          options={jobPositionOptions}
                          isLoading={GetJobPositionsByCompany.isLoading}
                          value={propJobPositionId}
                          onChange={(val) => setPropJobPositionId(val)}
                          labelClassName={actionLabelClassName}
                          valueClassName={actionLabelClassName}
                          className={actionDropdownClassName}
                        />

                        <Dropdown
                          label="Nuevo Centro Costo"
                          appearance="dark"
                          options={costCenterOptions}
                          isLoading={GetCostCentersByBranch.isLoading}
                          value={propCostCenterId}
                          onChange={(val) => setPropCostCenterId(val)}
                          labelClassName={actionLabelClassName}
                          valueClassName={actionLabelClassName}
                          className={actionDropdownClassName}
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          type="button"
                          label={
                            selectedScope === "1"
                              ? "Confirmar Colaborador"
                              : "Agregar a la Solicitud"
                          }
                          icon={<PlusIcon size={16} />}
                          size="small"
                          className={`${actionPrimaryButtonClassName} w-auto! px-4!`}
                          onClick={handleAddCollaborator}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {proposalError && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900/50">
                <AlertCircleIcon size={16} />
                <span>{proposalError}</span>
              </div>
            )}

            {!isByArea && stagedList.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Colaboradores Incluidos ({stagedList.length}):
                </span>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-neutral-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-[#363a45] text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="p-2.5">Colaborador</th>
                        <th className="p-2.5">Salario Actual</th>
                        <th className="p-2.5">Salario Propuesto</th>
                        <th className="p-2.5">Cargo Propuesto</th>
                        <th className="p-2.5">Centro Costo Propuesto</th>
                        <th className="p-2.5 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-neutral-700">
                      {stagedList.map((item) => {
                        const delta =
                          item.proposed_salary && item.current_salary
                            ? item.proposed_salary - item.current_salary
                            : null;

                        return (
                          <tr
                            key={item.collaborator_id}
                            className="hover:bg-slate-50 dark:hover:bg-neutral-800/40"
                          >
                            <td className="p-2.5 font-medium text-slate-800 dark:text-white">
                              <div>{item.full_name}</div>
                              <div className="text-[10px] text-slate-400">
                                {item.identification_number}
                              </div>
                            </td>
                            <td className="p-2.5 text-slate-600 dark:text-slate-300">
                              {item.current_salary !== undefined
                                ? formatCurrency(
                                    item.current_salary ?? 0,
                                    resolveCurrencyCode(item.current_currency),
                                  )
                                : "—"}
                            </td>
                            <td className="p-2.5">
                              {selectedScope === "2" ? (
                                <div className="flex flex-col gap-1 max-w-[140px]">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.proposed_salary ?? ""}
                                    onChange={(e) =>
                                      handleInlineSalaryChange(
                                        item.collaborator_id,
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Sin cambio"
                                    className="w-full rounded-md border border-slate-300 dark:border-neutral-600 bg-white dark:bg-[#272b34] px-2 py-1 text-xs text-slate-800 dark:text-white"
                                  />
                                  {delta !== null && delta > 0 && (
                                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                      +{formatCurrency(
                                        delta,
                                        resolveCurrencyCode(item.current_currency),
                                      )}
                                    </span>
                                  )}
                                </div>
                              ) : item.proposed_salary ? (
                                <div className="flex flex-col">
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(
                                      item.proposed_salary,
                                      resolveCurrencyCode(item.proposed_currency),
                                    )}
                                  </span>
                                  {delta !== null && delta > 0 && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                      +{formatCurrency(
                                        delta,
                                        resolveCurrencyCode(item.current_currency),
                                      )}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400">Sin cambio</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {item.proposed_job_position_name ? (
                                <span className="text-slate-800 dark:text-white">
                                  {item.proposed_job_position_name}
                                </span>
                              ) : (
                                <span className="text-slate-400">Sin cambio</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {item.proposed_cost_center_name ? (
                                <span className="text-slate-800 dark:text-white">
                                  {item.proposed_cost_center_name}
                                </span>
                              ) : (
                                <span className="text-slate-400">Sin cambio</span>
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveStagedItem(item.collaborator_id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remover"
                              >
                                <Trash2Icon size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Modal Footer actions */}
        <div className="-mx-4 -mb-4 mt-3 flex shrink-0 flex-col-reverse gap-2 border-t border-t-slate-300 bg-white px-4 py-3 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6 rounded-b-xl">
          <Button
            type="button"
            label="Cancelar"
            size="giant"
            className={`${actionCancelOutlineClassName} w-full min-w-0 sm:w-auto`}
            onClick={handleClose}
            disabled={CreatePersonnelAction.isPending}
          />
          <Button
            type="submit"
            label={
              CreatePersonnelAction.isPending ? "Guardando..." : "Registrar Solicitud"
            }
            icon={<CheckIcon size={16} />}
            size="giant"
            className={`${actionApproveButtonClassName} w-full min-w-0 sm:w-auto`}
            disabled={CreatePersonnelAction.isPending}
            isLoading={CreatePersonnelAction.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};
