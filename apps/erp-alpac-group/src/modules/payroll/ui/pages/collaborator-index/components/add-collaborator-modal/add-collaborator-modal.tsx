import {
  Button,
  Dropdown,
  InputText,
  Modal,
  Stepper,
} from '@alpac/design-system';
import React, { useState } from 'react';
import type { AddCollaboratorModalProps } from './add-collaborator-modal.types';
import { Controller, useForm } from 'react-hook-form';
import type { AddCollaboratorRequest } from '@app/modules/payroll/domain/ApiContract/Requests/add-collaborator.request';
import { fieldsToValidate } from '@app/modules/payroll/ui/pages/collaborator-index/components/add-collaborator-modal/add-collaborator-modal.types';
import {
  validateAge,
  validateEmail,
  validateToday,
} from '@app/shared/utils/string.utils';
import { GenderOptions } from '@app/core/enums/gender.enum';
import { IdentificationOptions } from '@app/core/enums/identifcation.enum';
import { CurrencyOptions } from '@app/core/enums/currency.enum';
import { SalaryTypeOptions } from '@app/modules/payroll/domain/enums/salary-type.enum';
import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, XIcon } from 'lucide-react';
import { formatAmount } from '@app/shared/utils/number.utils';

export const AddCollaboratorModal = (
  props: AddCollaboratorModalProps,
): React.ReactNode => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Identidad', 'Personal', 'Laboral', 'Salarial'];

  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useForm<AddCollaboratorRequest>({ mode: 'onChange' });

  const handleCloseModal = () => {
    setCurrentStep(0);
    props.onClose();
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

      <form className="min-h-[450px] flex flex-col">
        <div className="grow">
          {/* Paso 1: Datos de Identidad */}
          {currentStep === 0 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
                  Datos de Identidad
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <InputText
                  label="Primer Nombre"
                  placeholder="Ej. Juan"
                  isRequired
                  className="dark:text-black! rounded-md!"
                  {...register('first_name', {
                    required: 'El primer nombre es requerido',
                  })}
                  error={errors.first_name && errors.first_name.message}
                />

                <InputText
                  label="Segundo Nombre"
                  placeholder="Ej. Antonio"
                  className="dark:text-black! rounded-md!"
                  {...register('second_name')}
                />

                <InputText
                  label="Tercer Nombre"
                  placeholder="Opcional"
                  className="dark:text-black! rounded-md!"
                  {...register('third_name', { required: false })}
                />

                <InputText
                  label="Primer Apellido"
                  placeholder="Ej. Pérez"
                  isRequired
                  className="dark:text-black! rounded-md!"
                  {...register('first_lastname', {
                    required: 'El primer apellido es requerido',
                  })}
                  error={errors.first_lastname && errors.first_lastname.message}
                />

                <InputText
                  label="Segundo Apellido"
                  placeholder="Ej. García"
                  className="dark:text-black! rounded-md!"
                  {...register('second_lastname', { required: false })}
                />

                <Controller
                  name="gender"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar un género',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Género"
                      isRequired
                      className="rounded-md!"
                      options={GenderOptions}
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={errors.gender && errors.gender.message}
                      value={field.value}
                    />
                  )}
                />

                <Controller
                  name="identification_type"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar un tipo de identificación',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Tipo Identificación"
                      isRequired
                      className="rounded-md!"
                      options={IdentificationOptions}
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.identification_type &&
                        errors.identification_type.message
                      }
                      value={field.value}
                    />
                  )}
                />

                <InputText
                  label="No. Identificación"
                  placeholder="001-010190-0001A"
                  isRequired
                  className="dark:text-black! rounded-md!"
                  {...register('identification_number', {
                    required: 'El número de identificación es requerido',
                  })}
                  error={
                    errors.identification_number &&
                    errors.identification_number.message
                  }
                />
              </div>
            </section>
          )}

          {/* Paso 2: Información Personal */}
          {currentStep === 1 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
                  Información Personal
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <InputText
                    label="Dirección"
                    placeholder="Dirección completa"
                    isRequired
                    className="dark:text-black! rounded-md!"
                    {...register('personal_information.address', {
                      required: 'La dirección es requerida',
                    })}
                    error={
                      errors.personal_information?.address &&
                      errors.personal_information?.address?.message
                    }
                  />
                </div>

                <InputText
                  label="Departamento"
                  placeholder="Ej. Managua"
                  isRequired
                  className="dark:text-black! rounded-md!"
                  {...register('personal_information.departament', {
                    required: 'El departamento es requerido',
                  })}
                  error={
                    errors.personal_information?.departament &&
                    errors.personal_information?.departament?.message
                  }
                />

                <InputText
                  label="Correo Personal"
                  placeholder="correo@ejemplo.com"
                  isRequired
                  type="email"
                  className="dark:text-black! rounded-md!"
                  {...register('personal_information.personal_email', {
                    required: 'El correo personal es requerido',
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
                  isRequired
                  type="tel"
                  className="dark:text-black! rounded-md!"
                  {...register('personal_information.personal_phone_number', {
                    required: 'El teléfono personal es requerido',
                  })}
                  error={
                    errors.personal_information?.personal_phone_number &&
                    errors.personal_information?.personal_phone_number?.message
                  }
                />

                <InputText
                  label="Fecha de Nacimiento"
                  isRequired
                  type="date"
                  className="dark:text-black! rounded-md!"
                  {...register('personal_information.birthdate', {
                    required: 'La fecha de nacimiento es requerida',
                    validate: {
                      validAge: (value?: string) => validateAge(value),
                      validToday: (value?: string) => validateToday(value),
                    },
                  })}
                  error={
                    errors.personal_information?.birthdate &&
                    errors.personal_information?.birthdate?.message
                  }
                />
              </div>
            </section>
          )}

          {/* Paso 3: Información Laboral */}
          {currentStep === 2 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
                  Información Laboral
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Controller
                  name="working_information.work_area_id"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar un área de trabajo',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Área de Trabajo"
                      isRequired
                      className="rounded-md!"
                      options={props.optionsWorkAreas ?? []}
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.working_information?.work_area_id &&
                        errors.working_information?.work_area_id?.message
                      }
                      value={field.value}
                    />
                  )}
                />

                <Controller
                  name="working_information.work_position_id"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar una posición',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Posición / Cargo"
                      isRequired
                      options={props.optionsJobPositions ?? []}
                      className="rounded-md!"
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.working_information?.work_position_id &&
                        errors.working_information?.work_position_id?.message
                      }
                      value={field.value}
                    />
                  )}
                />

                <Controller
                  name="working_information.branch_id"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar una sucursal',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Sucursal / Sede"
                      isRequired
                      options={props.optionsBranches ?? []}
                      className="rounded-md!"
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.working_information?.branch_id &&
                        errors.working_information?.branch_id?.message
                      }
                      value={field.value}
                    />
                  )}
                />

                <InputText
                  label="Cuenta Bancaria"
                  placeholder="Ej. 123456789"
                  className="dark:text-black! rounded-md!"
                  inputMode="numeric"
                  {...register('working_information.bank_account_number', {
                    required: false,
                  })}
                />

                <InputText
                  label="Correo Trabajo"
                  placeholder="correo@ejemplo.com"
                  isRequired
                  type="email"
                  className="dark:text-black! rounded-md!"
                  {...register('working_information.work_email', {
                    required: 'El correo de trabajo es requerido',
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
                  className="dark:text-black! rounded-md!"
                  {...register('working_information.work_phon_number', {
                    required: false,
                  })}
                />

                <InputText
                  label="Número INSS"
                  placeholder="Opcional"
                  className="dark:text-black! rounded-md!"
                  {...register('working_information.inss_number', {
                    required: false,
                  })}
                />

                <InputText
                  label="Fecha de Ingreso"
                  isRequired
                  type="date"
                  className="dark:text-black! rounded-md!"
                  {...register('working_information.entry_date', {
                    required: 'La fecha de ingreso es requerida',
                    validate: {
                      validToday: (value?: string) => validateToday(value),
                    },
                  })}
                  error={
                    errors.working_information?.entry_date &&
                    errors.working_information?.entry_date?.message
                  }
                />
              </div>
            </section>
          )}

          {/* Paso 4: Información Salarial */}
          {currentStep === 3 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
                  Información Salarial
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <Controller
                  name="salary_information.salary_type"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar una moneda',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Moneda"
                      isRequired
                      options={CurrencyOptions ?? []}
                      className="rounded-md!"
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.salary_information?.salary_type &&
                        errors.salary_information?.salary_type?.message
                      }
                      value={field.value}
                    />
                  )}
                />

                <InputText
                  label="Salario Mensual"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className="dark:text-black! rounded-md!"
                  {...register('salary_information.salary', {
                    required: 'El salario es requerido',
                    setValueAs: (value: string) =>
                      value
                        ? parseFloat(value.toString().replace(/,/g, ''))
                        : 0,
                    validate: (value?: number) =>
                      (value !== undefined && value > 0) ||
                      'El salario debe ser mayor a 0',
                  })}
                  error={
                    errors.salary_information?.salary &&
                    errors.salary_information?.salary?.message
                  }
                  onChange={(evt) => {
                    evt.target.value = formatAmount(evt.target.value, 18, 3);
                    register('salary_information.salary').onChange(evt);
                  }}
                />

                <Controller
                  name="salary_information.salary_type"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar un tipo de pago',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Tipo de Pago"
                      isRequired
                      options={SalaryTypeOptions ?? []}
                      className="rounded-md!"
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.salary_information?.salary_type &&
                        errors.salary_information?.salary_type?.message
                      }
                      value={field.value}
                    />
                  )}
                />

                <Controller
                  name="salary_information.sub_catalog_bank_id"
                  control={control}
                  rules={{
                    required: 'Debe seleccionar una institución bancaria',
                    validate: (val) => val !== 0 || 'Selección inválida',
                  }}
                  render={({ field }) => (
                    <Dropdown
                      label="Institución Bancaria"
                      isRequired
                      options={props.optionsBanks ?? []}
                      className="rounded-md!"
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={
                        errors.salary_information?.sub_catalog_bank_id &&
                        errors.salary_information?.sub_catalog_bank_id?.message
                      }
                      value={field.value}
                    />
                  )}
                />
              </div>
            </section>
          )}
        </div>

        <div className="border-t border-t-slate-300 -mx-6 mb-6"></div>

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
              className="text-[15px]! rounded-md! bg-slate-100! text-slate-500! hover:bg-slate-200!"
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
