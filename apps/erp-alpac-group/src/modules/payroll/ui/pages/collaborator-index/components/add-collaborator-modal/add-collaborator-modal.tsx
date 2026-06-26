import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  Checkbox,
  DatePicker,
  Dropdown,
  InputText,
  Modal,
  Stepper,
} from "@alpac/design-system";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fieldsToValidate } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-collaborator-modal/add-collaborator-modal.types";
import {
  formatIdentificationNumber,
  formatPhone,
  validateAge,
  validateEmail,
  validateNicaraguaPhone,
  validateOnlyLettersWithAccentsAndDiacritics,
  validateToday,
} from "@app/shared/utils/string.utils";
import { GenderOptions } from "@app/core/enums/gender.enum";
import {
  IdentificationOptions,
  IdentificationEnum,
} from "@app/core/enums/identification.enum";
import dayjs from "dayjs";
import { toDateOnly } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/date-input";
import { CurrencyOptions } from "@app/core/enums/currency.enum";
import {
  SalaryTypeEnum,
  SalaryTypeOptions,
} from "@app/modules/payroll/domain/enums/salary-enums/salary-type.enum";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SaveIcon,
  X,
  XIcon,
} from "lucide-react";
import { formatAmount } from "@app/shared/utils/number.utils";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { MaritalStatusOptions } from "@app/core/enums/marital-status.enum";
import { CompanyEnum } from "@app/core/enums/company.enum";
import { ServiceRatesTable } from "../service-rates-table/service-rates-table";
import { AddAllowanceModal } from "../add-allowance-modal/add-allowance-modal";
import { useIncomes } from "@app/modules/payroll/ui/hooks/incomes/useIncomes";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";

import type { AddCollaboratorModalProps } from "@app/modules/payroll/ui/pages/collaborator-index/components/add-collaborator-modal/add-collaborator-modal.types";
import type { AddCollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/add-collaborator.request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

export const AddCollaboratorModal = (
  props: AddCollaboratorModalProps,
): React.ReactNode => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSalaryType, setSelectedSalaryType] = useState<SalaryTypeEnum | null>(null);
  const [showAddAllowanceModal, setShowAddAllowanceModal] = useState(false);
  const [isDaemFieldEnabled, setIsDaemFieldEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const { PostCollaboratorQuery } = useCollaborators();
  const { getMappedError } = useMappedError();
  const { companyId, moduleCode, companyAlias } = useUserStore();

  const isTmnCompany = companyAlias === CompanyEnum.TMN;
  const isVigemsaCompany = companyAlias === CompanyEnum.VIGEMSA;

  const { GetIncomeTypes } = useIncomes({
    incomesTypesPayload: { company_id: companyId! },
  });
  const { data: incomeTypesData } = GetIncomeTypes;

  const steps = ["Identidad", "Personal", "Laboral", "Salarial"];

  const {
    register,
    control,
    trigger,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<AddCollaboratorRequest>({
    mode: "onChange",
  });

  const identificationType = watch("identification_type");
  const travelExpenses = watch("travel_expenses");

  const handleCloseModal = () => {
    setCurrentStep(0);
    props.onClose?.();
    reset();
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const isValid = await trigger(fieldsToValidate[currentStep]);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCreateCollaborator = async (data: AddCollaboratorRequest) => {
    try {
      const { travel_expenses, ...restData } = data;

      const bacBank = props.optionsBanks.find((item) => item.label === "BAC");

      const payload = {
        ...restData,
        company_id: companyId,
        module_code: moduleCode,
        ...(travel_expenses && travel_expenses.length > 0
          ? { travel_expenses }
          : {}),
        personal_information: {
          ...restData.personal_information,
          birthdate: toDateOnly(restData.personal_information.birthdate),
        },
        working_information: {
          ...restData.working_information,
          entry_date: toDateOnly(restData.working_information.entry_date),
        },
        salary_information: {
          ...restData.salary_information,
          ...(isVigemsaCompany && bacBank
            ? { sub_catalog_bank_id: bacBank.value }
            : {}),
        },
      };

      await PostCollaboratorQuery.mutateAsync(payload);
      props.onRequestSuccess?.("Colaborador creado exitosamente");

      handleCloseModal();
    } catch (error) {
      const mappedError = getMappedError(error as ApiErrorResponse);
      setShowAlert({
        show: true,
        type: "error",
        title: "Error al guardar",
        message:
          mappedError.description ||
          "No se pudo crear el colaborador. Por favor, intente de nuevo.",
      });

      handleCloseAlert();
    }
  };

  const handleAddAllowance = useCallback(() => {
    setShowAddAllowanceModal(true);
  }, [setShowAddAllowanceModal]);

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setShowAlert({ show: false, type: "info", title: "", message: "" });
    }, 3000);
  }, []);

  const validateIdentificationNumber = (value: string) => {
    if (!value) return "El número de identificación es requerido";

    if (
      identificationType === IdentificationEnum.NATIONAL_ID.value ||
      identificationType === IdentificationEnum.RESIDENCE_ID.value
    ) {
      const regex = /^[0-9]{13}[A-Z]$/;

      return (
        regex.test(value ?? "") ||
        "El número de identificación debe tener 14 caracteres y terminar con una letra mayúscula"
      );
    }

    if (identificationType === IdentificationEnum.PASSPORT.value) {
      return (
        value.length > 4 ||
        "El número de pasaporte debe tener al menos 5 caracteres"
      );
    }

    return true;
  };

  const isProfessionalServicesSalary = useMemo(() => {
    return (
      selectedSalaryType?.value === SalaryTypeEnum.PROFESSIONAL_SERVICES.value
    );
  }, [selectedSalaryType]);

  useEffect(() => {
    const isProfessionalServices =
      selectedSalaryType?.value === SalaryTypeEnum.PROFESSIONAL_SERVICES.value;
    if (isProfessionalServices) {
      setValue("travel_expenses", []);
    }
  }, [selectedSalaryType, setValue]);

  return (
    <Modal
      isOpen={props.isOpen}
      title="Agregar Colaborador"
      variant="form"
      size="7xl"
      description="Complete la información del colaborador en etapas"
      onClose={handleCloseModal}
    >
      <div className="mb-10">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <AnimatedAlertWrapper open={showAlert.show}>
        <Alert
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          showCloseButton
          onClose={() => {
            setShowAlert({
              show: false,
              type: "info",
              title: "",
              message: "",
            });
          }}
        />
      </AnimatedAlertWrapper>

      <form
        className="min-h-[450px] flex flex-col"
        onSubmit={handleSubmit(handleCreateCollaborator)}
      >
        <div className="grow relative">
          {/* Paso 1: Datos de Identidad */}
          <section
            className={`transition-all duration-500 transform ${currentStep === 0 ? "opacity-100 translate-x-0 relative z-10" : currentStep > 0 ? "opacity-0 translate-x-8 absolute inset-0 -z-10 pointer-events-none" : "opacity-0 -translate-x-8 absolute inset-0 -z-10 pointer-events-none"}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-[16px]! font-bold text-slate-800 dark:text-white!">
                Datos de Identidad
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <InputText
                label="Primer Nombre"
                placeholder="Ej. Juan"
                isRequired
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("first_name", {
                  required: "El primer nombre es requerido",
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    onlyLetters: (value: string) =>
                      validateOnlyLettersWithAccentsAndDiacritics(value),
                  },
                })}
                error={errors.first_name && errors.first_name.message}
              />

              <InputText
                label="Segundo Nombre"
                placeholder="Ej. Antonio"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("second_name", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    onlyLetters: (value?: string) =>
                      validateOnlyLettersWithAccentsAndDiacritics(
                        value || "",
                        true,
                      ),
                  },
                })}
                error={errors.second_name && errors.second_name.message}
              />

              <InputText
                label="Tercer Nombre"
                placeholder="Opcional"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("third_name", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    onlyLetters: (value?: string) =>
                      validateOnlyLettersWithAccentsAndDiacritics(value || ""),
                  },
                })}
                error={errors.third_name && errors.third_name.message}
              />

              <InputText
                label="Primer Apellido"
                placeholder="Ej. Pérez"
                isRequired
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("first_lastname", {
                  required: "El primer apellido es requerido",
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    onlyLetters: (value: string) =>
                      validateOnlyLettersWithAccentsAndDiacritics(
                        value || "",
                        true,
                      ),
                  },
                })}
                error={errors.first_lastname && errors.first_lastname.message}
              />

              <InputText
                label="Segundo Apellido"
                placeholder="Ej. García"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("second_lastname", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    onlyLetters: (value?: string) =>
                      validateOnlyLettersWithAccentsAndDiacritics(value || ""),
                  },
                })}
                error={errors.second_lastname && errors.second_lastname.message}
              />

              <Controller
                name="gender"
                control={control}
                rules={{
                  required: "Debe seleccionar un género",
                  validate: (val) => val !== 0 || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Género"
                    isRequired
                    placeholder="Seleccione..."
                    options={GenderOptions ?? []}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={errors.gender && errors.gender.message}
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />

              <Controller
                name="identification_type"
                control={control}
                rules={{
                  required: "Debe seleccionar un tipo de identificación",
                  validate: (val) => val !== 0 || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Tipo Identificación"
                    isRequired
                    options={IdentificationOptions}
                    placeholder="Seleccione..."
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("identification_number", "");
                      clearErrors("identification_number");
                    }}
                    error={
                      errors.identification_type &&
                      errors.identification_type.message
                    }
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />

              <InputText
                label="No. Identificación"
                placeholder={
                  identificationType === IdentificationEnum.PASSPORT.value
                    ? "Ej. AB123456"
                    : "Ej. 001-010190-0001A"
                }
                isRequired
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("identification_number", {
                  required: "El número de identificación es requerido",
                  disabled: identificationType === 0,
                  setValueAs: (value: string) => {
                    const trimmed = value?.trim();

                    return trimmed
                      ? identificationType ===
                        IdentificationEnum.NATIONAL_ID.value ||
                        identificationType ===
                        IdentificationEnum.RESIDENCE_ID.value
                        ? trimmed.replace(/-/g, "").toUpperCase()
                        : trimmed.toUpperCase()
                      : "";
                  },
                  validate: (value?: string) =>
                    validateIdentificationNumber(value ?? ""),
                })}
                error={
                  errors.identification_number &&
                  errors.identification_number.message
                }
                onChange={(evt) => {
                  if (
                    identificationType ===
                    IdentificationEnum.NATIONAL_ID.value ||
                    identificationType === IdentificationEnum.RESIDENCE_ID.value
                  ) {
                    evt.target.value = formatIdentificationNumber(
                      evt.target.value,
                    );
                  } else {
                    evt.target.value = evt.target.value.toUpperCase();
                  }
                }}
                disabled={identificationType === 0 || !identificationType}
              />
            </div>
          </section>

          {/* Paso 2: Información Personal */}
          <section
            className={`transition-all duration-500 transform ${currentStep === 1 ? "opacity-100 translate-x-0 relative z-10" : currentStep > 1 ? "opacity-0 translate-x-8 absolute inset-0 -z-10 pointer-events-none" : "opacity-0 -translate-x-8 absolute inset-0 -z-10 pointer-events-none"}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-[16px]! font-bold text-slate-800 dark:text-white!">
                Información Personal
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <InputText
                  label="Dirección"
                  placeholder="Dirección completa"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  {...register("personal_information.address", {
                    required: false,
                    setValueAs: (value: string) => value?.trim(),
                  })}
                />
              </div>

              <InputText
                label="Correo Personal"
                placeholder="correo@ejemplo.com"
                type="email"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("personal_information.personal_email", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    validEmail: (value?: string) => validateEmail(value),
                  },
                })}
                error={
                  errors.personal_information?.personal_email &&
                  errors.personal_information?.personal_email?.message
                }
              />

              <InputText
                label="Teléfono Personal"
                placeholder="8888-8888"
                type="tel"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("personal_information.personal_phone_number", {
                  required: false,
                  onChange: (evt) => {
                    evt.target.value = formatPhone(evt.target.value);
                  },
                  validate: (value) => !value || validateNicaraguaPhone(value),
                  setValueAs: (value: string) => {
                    const trimmed = value?.trim();
                    return trimmed ? trimmed.replace(/-/g, "") : "";
                  },
                })}
                error={
                  errors.personal_information?.personal_phone_number &&
                  errors.personal_information?.personal_phone_number?.message
                }
              />

              <Controller
                name="personal_information.birthdate"
                control={control}
                rules={{
                  required: "La fecha de nacimiento es requerida.",
                  validate: {
                    validAge: (value?: string) =>
                      validateAge(dayjs(value).format("YYYY-MM-DD"), 18),
                    validToday: (value?: string) =>
                      validateToday(dayjs(value).format("YYYY-MM-DD")),
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    fieldWidth="large"
                    label="Fecha de Nacimiento"
                    labelAbove
                    isRequired
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(value) => {
                      field.onChange(toDateOnly(value));
                    }}
                    error={
                      errors.personal_information?.birthdate &&
                      errors.personal_information?.birthdate?.message
                    }
                  />
                )}
              />

              <Controller
                name="personal_information.marital_status"
                control={control}
                rules={{
                  required: "Debe seleccionar un estado civil",
                  validate: (val) => val !== -1 || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Estado Civil"
                    isRequired
                    options={MaritalStatusOptions ?? []}
                    placeholder="Seleccione..."
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={
                      errors.personal_information?.marital_status &&
                      errors.personal_information?.marital_status?.message
                    }
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />
            </div>
          </section>

          {/* Paso 3: Información Laboral */}
          <section
            className={`transition-all duration-500 transform ${currentStep === 2 ? "opacity-100 translate-x-0 relative z-10" : currentStep > 2 ? "opacity-0 translate-x-8 absolute inset-0 -z-10 pointer-events-none" : "opacity-0 -translate-x-8 absolute inset-0 -z-10 pointer-events-none"}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-[16px]! font-bold text-slate-800 dark:text-white!">
                Información Laboral
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Controller
                name="working_information.area_id"
                control={control}
                rules={{
                  required: "Debe seleccionar un área de trabajo",
                  validate: (val) => !!val || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Área de Trabajo"
                    isRequired
                    options={props.optionsAreas ?? []}
                    placeholder="Seleccione..."
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={
                      errors.working_information?.area_id &&
                      errors.working_information?.area_id?.message
                    }
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />

              <Controller
                name="working_information.work_position_id"
                control={control}
                rules={{
                  required: "Debe seleccionar una posición",
                  validate: (val) => val !== 0 || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Posición / Cargo"
                    isRequired
                    options={props.optionsJobPositions ?? []}
                    placeholder="Seleccione..."
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={
                      errors.working_information?.work_position_id &&
                      errors.working_information?.work_position_id?.message
                    }
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />

              <Controller
                name="working_information.branch_id"
                control={control}
                rules={{
                  required: "Debe seleccionar una sucursal",
                  validate: (val) => val !== 0 || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Sucursal / Sede"
                    isRequired
                    options={props.optionsBranches ?? []}
                    placeholder="Seleccione..."
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={
                      errors.working_information?.branch_id &&
                      errors.working_information?.branch_id?.message
                    }
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />

              <InputText
                label="Cuenta Bancaria"
                placeholder="Ej. 123456789"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                inputMode="numeric"
                {...register("working_information.bank_account_number", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                })}
              />

              <InputText
                label="Correo Trabajo"
                placeholder="correo@ejemplo.com"
                type="email"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("working_information.work_email", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                  validate: {
                    validEmail: (value?: string) => validateEmail(value),
                  },
                })}
                error={
                  errors.working_information?.work_email &&
                  errors.working_information?.work_email?.message
                }
              />

              <InputText
                label="Teléfono Trabajo"
                placeholder="2222-2222"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                {...register("working_information.work_phone_number", {
                  required: false,
                  validate: (value) => validateNicaraguaPhone(value),
                  setValueAs: (value: string) => {
                    const trimmed = value?.trim();
                    return trimmed ? trimmed.replace(/-/g, "") : "";
                  },
                })}
                error={
                  errors.working_information?.work_phone_number &&
                  errors.working_information?.work_phone_number?.message
                }
                onChange={(evt) => {
                  evt.target.value = formatPhone(evt.target.value);
                  register("working_information.work_phone_number").onChange(
                    evt,
                  );
                }}
              />

              <InputText
                label="Número INSS"
                placeholder="Opcional"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                inputMode="numeric"
                {...register("working_information.inss_number", {
                  required: false,
                  setValueAs: (value: string) => value?.trim(),
                  validate: (value?: string) =>
                    !value ||
                    /^[0-9]+$/.test(value) ||
                    "El número INSS debe contener solo dígitos",
                })}
                error={
                  errors.working_information?.inss_number &&
                  errors.working_information?.inss_number?.message
                }
              />

              <Controller
                name="working_information.entry_date"
                control={control}
                rules={{
                  required: "La fecha de ingreso es requerida.",
                  validate: {
                    validToday: (value?: string) =>
                      validateToday(dayjs(value).format("YYYY-MM-DD")),
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    fieldWidth="large"
                    label="Fecha de Ingreso"
                    value={field.value ? dayjs(field.value) : null}
                    labelAbove
                    isRequired
                    onChange={(value) => {
                      field.onChange(toDateOnly(value));
                    }}
                    error={
                      errors.working_information?.entry_date &&
                      errors.working_information?.entry_date?.message
                    }
                  />
                )}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <Controller
                  name="does_work_saturday"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label="¿Jornada en sábado?"
                      value="testing"
                      labelClassName="dark:text-white!"
                      checked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  )}
                />

                {(isVigemsaCompany) && (
                  <Checkbox
                    label="Tiene Licencia DAEM"
                    value="testing"
                    labelClassName="dark:text-white!"
                    checked={Boolean(isDaemFieldEnabled)}
                    onChange={(evt) => {
                      setIsDaemFieldEnabled(evt.target.checked)
                      setValue('working_information.daem', '', {
                        shouldValidate: true, // Opcional: dispara la validación si la hay
                        shouldDirty: true     // Opcional: marca el campo como modificado
                      });
                    }}
                    name="daem"
                  />
                )}
              </div>

              {(isVigemsaCompany && isDaemFieldEnabled) && (
                <InputText
                  label="Número de Licencia DAEM"
                  isRequired
                  placeholder="Escriba número de licencia DAEM"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  inputMode="numeric"
                  {...register("working_information.daem", {
                    required: "Número de licencia DAEM es requerida",
                  })}
                  error={
                    errors.working_information?.daem &&
                    errors.working_information?.daem?.message
                  }
                />
              )}

            </div>
          </section>

          {/* Paso 4: Información Salarial */}
          <section
            className={`transition-all duration-500 transform ${currentStep === 3 ? "opacity-100 translate-x-0 relative z-10" : currentStep > 3 ? "opacity-0 translate-x-8 absolute inset-0 -z-10 pointer-events-none" : "opacity-0 -translate-x-8 absolute inset-0 -z-10 pointer-events-none"}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-[16px]! font-bold text-slate-800 dark:text-white!">
                Información Salarial
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Controller
                name="salary_information.salary_type"
                control={control}
                rules={{
                  required: "Debe seleccionar un tipo de pago",
                  validate: (val) => val !== 0 || "Selección inválida",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Tipo de Pago"
                    isRequired
                    options={SalaryTypeOptions ?? []}
                    placeholder="Seleccione..."
                    onChange={(value) => {
                      field.onChange(value);
                      const salaryType = Object.values(SalaryTypeEnum).find(
                        (type) => type.value === value,
                      );
                      setSelectedSalaryType(salaryType as SalaryTypeEnum);
                    }}
                    error={
                      errors.salary_information?.salary_type &&
                      errors.salary_information?.salary_type?.message
                    }
                    value={field.value}
                    appearance="dark"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  />
                )}
              />

              {selectedSalaryType !== null && (
                <Controller
                  name="salary_information.currency"
                  control={control}
                  rules={{
                    required: "Debe seleccionar una moneda",
                    validate: (val) => val !== 0 || "Selección inválida",
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Moneda"
                      isRequired
                      options={CurrencyOptions ?? []}
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.salary_information?.currency &&
                        errors.salary_information?.currency?.message
                      }
                      value={field.value}
                      appearance="dark"
                      labelClassName="text-black! dark:text-white!"
                      valueClassName="text-black! dark:text-white!"
                      className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                    />
                  )}
                />
              )}

              {!isProfessionalServicesSalary && selectedSalaryType !== null && (
                <InputText
                  label="Salario Mensual"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                  labelClassName="text-black! dark:text-white!"
                  isRequired
                  {...register("salary_information.salary", {
                    required: "El salario es requerido",
                    setValueAs: (value: any) => {
                      const stringValue =
                        typeof value === "string" ? value : String(value || "");
                      const trimmed = stringValue.trim();
                      return trimmed
                        ? parseFloat(trimmed.replace(/,/g, ""))
                        : 0;
                    },
                    validate: (value?: number) => {
                      if (isProfessionalServicesSalary) return true;
                      return (
                        (value !== undefined && value > 0) ||
                        "El salario debe ser mayor a 0"
                      );
                    },
                  })}
                  error={
                    errors.salary_information?.salary &&
                    errors.salary_information?.salary?.message
                  }
                  onChange={(evt) => {
                    evt.target.value = formatAmount(evt.target.value, 18, 3);
                  }}
                />
              )}

              {selectedSalaryType !== null && !isProfessionalServicesSalary && (
                <Controller
                  name="salary_information.sub_catalog_bank_id"
                  control={control}
                  rules={{
                    required: "El dato de banco es requerido",
                    validate: (value) => {
                      if (isProfessionalServicesSalary) return true;
                      return value !== undefined && value !== 0
                        ? true
                        : "Selección inválida";
                    },
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Institución Bancaria"
                      isRequired
                      options={props.optionsBanks ?? []}
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.salary_information?.sub_catalog_bank_id &&
                        errors.salary_information?.sub_catalog_bank_id?.message
                      }
                      value={field.value}
                      appearance="dark"
                      labelClassName="text-black! dark:text-white!"
                      valueClassName="text-black! dark:text-white!"
                      className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                    />
                  )}
                />
              )}
            </div>

            {selectedSalaryType &&
              !isProfessionalServicesSalary &&
              (travelExpenses?.length ?? 0) <= 0 && (
                <div className="mb-6">
                  <Button
                    size="giant"
                    type="button"
                    label="Agregar Viáticos"
                    onClick={handleAddAllowance}
                    className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  />
                </div>
              )}

            {selectedSalaryType &&
              isProfessionalServicesSalary &&
              (isVigemsaCompany || isTmnCompany) && (
                <div className="mb-6">
                  <ServiceRatesTable
                    company={isVigemsaCompany ? "VIGEMSA" : "TMN"}
                  />
                </div>
              )}

            {selectedSalaryType &&
              isProfessionalServicesSalary &&
              !isVigemsaCompany &&
              !isTmnCompany && (
                <Alert
                  type="info"
                  title="Aviso"
                  message="Esta función solo está disponible para las empresas: TMN y VIGEMSA"
                />
              )}

            {selectedSalaryType &&
              !isProfessionalServicesSalary &&
              (travelExpenses?.length ?? 0) > 0 && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Viáticos asignados:{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {travelExpenses
                        ?.map((a) => {
                          const title =
                            incomeTypesData?.find(
                              (inc: any) =>
                                inc.type_income_id === a.type_income_id,
                            )?.income_title || "Viático";
                          return `${title}: C$ ${formatAmount(String(a.income_amount ?? 0))}`;
                        })
                        .join(", ")}
                    </span>
                  </p>
                  <div className="group relative flex items-center">
                    <button
                      type="button"
                      className="rounded-full p-1 transition-all bg-alpac-primary-500! text-white! hover:opacity-80"
                      onClick={() => {
                        setValue("travel_expenses", []);
                      }}
                      aria-label="Quitar viáticos"
                    >
                      <X size={16} />
                    </button>

                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                      Quitar viáticos
                    </div>
                  </div>
                </div>
              )}
          </section>
        </div>

        <AddAllowanceModal
          isOpen={showAddAllowanceModal}
          onClose={() => setShowAddAllowanceModal(false)}
          onSubmit={(data) => {
            setShowAddAllowanceModal(false);
            setValue("travel_expenses", data);
          }}
        />

        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mb-6"></div>

        <div className="flex flex-row justify-between items-center gap-4">
          <div>
            {currentStep > 0 && (
              <Button
                type="button"
                label="Anterior"
                size="giant"
                onClick={handleBack}
                isHiddenLabelOnMobile
                icon={<ArrowLeftIcon size={20} />}
                className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              label="Descartar"
              size="giant"
              onClick={handleCloseModal}
              isHiddenLabelOnMobile
              icon={<XIcon size={20} />}
              className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
            />
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                label="Siguiente"
                size="giant"
                onClick={handleNext}
                isHiddenLabelOnMobile
                icon={<ArrowRightIcon size={20} />}
                className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
              />
            ) : (
              <Button
                type="submit"
                label="Finalizar y Guardar"
                size="giant"
                disabled={
                  PostCollaboratorQuery.isPending ||
                  (isProfessionalServicesSalary &&
                    !isVigemsaCompany &&
                    !isTmnCompany)
                }
                isLoading={PostCollaboratorQuery.isPending}
                isHiddenLabelOnMobile
                icon={<SaveIcon size={20} />}
                className="text-[15px]! rounded-md! bg-emerald-600! hover:bg-emerald-700!"
              />
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
