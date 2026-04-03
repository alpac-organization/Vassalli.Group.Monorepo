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

export const AddCollaboratorStepModal = (
  props: AddCollaboratorModalProps,
): React.ReactNode => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Identidad', 'Personal', 'Laboral', 'Salarial'];

  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useForm<AddCollaboratorRequest>({mode: 'onChange'});

  const handleCloseModal = () => {
    setCurrentStep(0);
    props.onClose();
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const fieldsToValidate = [
      'first_name',
      'first_lastname',
      'identification_number',
      'identification_type',
      'gender',
    ];

    const isValid = await trigger(fieldsToValidate as any);

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
                <h3 className="text-[20px]! font-bold text-slate-800 dark:text-slate-800">
                  Datos de Identidad
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
                <InputText
                  label="Primer Nombre"
                  placeholder="Ej. Juan"
                  className="dark:text-black!"
                  {...register('first_name', {
                    required: 'El primer nombre es requerido',
                  })}
                  error={errors.first_name && errors.first_name.message}
                />
                <InputText
                  label="Segundo Nombre"
                  placeholder="Ej. Antonio"
                  className="dark:text-black!"
                  {...register('second_name')}
                />
                <InputText
                  label="Tercer Nombre"
                  placeholder="Opcional"
                  className="dark:text-black!"
                  {...register('third_name', { required: false })}
                />
                <InputText
                  label="Primer Apellido"
                  placeholder="Ej. Pérez"
                  className="dark:text-black!"
                  {...register('first_lastname', {
                    required: 'El primer apellido es requerido',
                  })}
                  error={errors.first_lastname && errors.first_lastname.message}
                />
                <InputText
                  label="Segundo Apellido"
                  placeholder="Ej. García"
                  className="dark:text-black!"
                  {...register('second_lastname', { required: false })}
                />
                <InputText
                  label="No. Identificación"
                  placeholder="001-010190-0001A"
                  className="dark:text-black!"
                  {...register('identification_number', {
                    required: 'El número de identificación es requerido',
                  })}
                  error={
                    errors.identification_number &&
                    errors.identification_number.message
                  }
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
                      options={[
                        {
                          value: 1,
                          label: 'Cédula Niragüense',
                        },
                        {
                          value: 2,
                          label: 'Cédula de Residencia',
                        },
                        {
                          value: 3,
                          label: 'Pasaporte',
                        },
                      ]}
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
                      options={[
                        {
                          value: 1,
                          label: 'Masculino',
                        },
                        {
                          value: 2,
                          label: 'Femenino',
                        },
                      ]}
                      placeholder="Seleccione..."
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      error={errors.gender && errors.gender.message}
                      value={field.value}
                    />
                  )}
                />
              </div>
            </section>
          )}

          {/* Paso 2: Información Personal */}
          {currentStep === 1 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[20px]! font-bold text-slate-800 dark:text-slate-800">
                  Información Personal
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <InputText
                    label="Dirección"
                    placeholder="Dirección completa"
                    className="dark:text-black!"
                  />
                </div>
                <InputText
                  label="Departamento / Región"
                  placeholder="Ej. Managua"
                  className="dark:text-black!"
                />
                <InputText
                  label="Correo Personal"
                  placeholder="correo@ejemplo.com"
                  type="email"
                  className="dark:text-black!"
                />
                <InputText
                  label="Teléfono Personal"
                  placeholder="8888-8888"
                  className="dark:text-black!"
                />
                <InputText
                  label="Fecha de Nacimiento"
                  type="date"
                  className="dark:text-black!"
                />
              </div>
            </section>
          )}

          {/* Paso 3: Información Laboral */}
          {currentStep === 2 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[20px]! font-bold text-slate-800 dark:text-slate-800">
                  Información Laboral
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Dropdown
                  label="Área de Trabajo"
                  options={[]}
                  placeholder="Seleccione..."
                />
                <Dropdown
                  label="Posición / Cargo"
                  options={[]}
                  placeholder="Seleccione..."
                />
                <Dropdown
                  label="Sucursal / Sede"
                  options={[]}
                  placeholder="Seleccione..."
                />
                <InputText
                  label="Cuenta Bancaria"
                  placeholder="Ej. 123456789"
                  className="dark:text-black!"
                />
                <InputText
                  label="Correo Trabajo"
                  placeholder="usuario@alpac.com"
                  type="email"
                  className="dark:text-black!"
                />
                <InputText
                  label="Teléfono Trabajo"
                  placeholder="2222-2222"
                  className="dark:text-black!"
                />
                <InputText
                  label="Número INSS"
                  placeholder="Opcional"
                  className="dark:text-black!"
                />
                <InputText
                  label="Fecha de Ingreso"
                  type="date"
                  className="dark:text-black!"
                />
              </div>
            </section>
          )}

          {/* Paso 4: Información Salarial */}
          {currentStep === 3 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-[20px]! font-bold text-slate-800 dark:text-slate-800">
                  Información Salarial
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Dropdown
                  label="Moneda"
                  options={[]}
                  placeholder="Seleccione..."
                />
                <InputText
                  label="Salario Mensual"
                  type="number"
                  placeholder="0.00"
                  className="text-black! dark:text-white!"
                />
                <Dropdown
                  label="Tipo de Pago"
                  options={[]}
                  placeholder="Seleccione..."
                />
                <Dropdown
                  label="Institución Bancaria"
                  options={[]}
                  placeholder="Seleccione..."
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
                className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              label="Descartar"
              size="giant"
              className="text-[15px]! rounded-md! bg-slate-100! text-slate-500! hover:bg-slate-200!"
              onClick={handleCloseModal}
            />
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                label="Siguiente"
                size="giant"
                onClick={handleNext}
                className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
              />
            ) : (
              <Button
                type="submit"
                label="Finalizar y Guardar"
                size="giant"
                className="text-[15px]! rounded-md! bg-emerald-600! hover:bg-emerald-700!"
              />
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
