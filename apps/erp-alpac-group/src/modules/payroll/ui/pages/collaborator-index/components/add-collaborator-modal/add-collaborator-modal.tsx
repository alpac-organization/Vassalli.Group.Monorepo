import { Button, Dropdown, InputText, Modal } from '@alpac/design-system';
import React from 'react';
import type { AddCollaboratorModalProps } from '@app/modules/payroll/ui/pages/collaborator-index/components/add-collaborator-modal/add-collaborator-modal.types';

export const AddCollaboratorModal = (
  props: AddCollaboratorModalProps,
): React.ReactNode => {
  const handleCloseModal = () => {
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      title="Agregar Colaborador"
      variant="form"
      size="7xl"
      description="Formulario para agregar un nuevo colaborador"
      onClose={handleCloseModal}
    >
      <form className="space-y-8">
        {/* Sección 1: Datos de Identidad */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
              Datos de Identidad
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputText
              label="Primer Nombre"
              placeholder="Ej. Juan"
              className="dark:text-black!"
              required
            />
            <InputText
              label="Segundo Nombre"
              placeholder="Ej. Antonio"
              className="dark:text-black!"
            />
            <InputText
              label="Tercer Nombre"
              placeholder="Opcional"
              className="dark:text-black!"
            />
            <InputText
              label="Primer Apellido"
              placeholder="Ej. Pérez"
              className="dark:text-black!"
            />
            <InputText
              label="Segundo Apellido"
              placeholder="Ej. García"
              className="dark:text-black!"
            />
            <InputText
              label="No. Identificación"
              placeholder="Ej. 001-010190-0001A"
              className="dark:text-black!"
            />
            <Dropdown
              label="Tipo Identificación"
              options={[]}
              placeholder="Seleccione tipo..."
            />
            <Dropdown
              label="Género"
              options={[]}
              placeholder="Seleccione género..."
            />
          </div>
        </section>

        <div className="border-t border-t-slate-600 dark:border-t-neutral-600 -mx-6 my-6 opacity-20"></div>

        {/* Sección 2: Información Personal */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
              Información Personal
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <InputText
                label="Dirección"
                placeholder="Dirección completa de residencia"
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
              placeholder="usuario@ejemplo.com"
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
        <div className="border-t border-t-slate-600 dark:border-t-neutral-600 -mx-6 my-6 opacity-20"></div>

        {/* Sección 3: Información Laboral */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
              Información Laboral
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Dropdown
              label="Área de Trabajo"
              options={[]}
              placeholder="Seleccione área..."
            />
            <Dropdown
              label="Posición / Cargo"
              options={[]}
              placeholder="Seleccione cargo..."
            />
            <Dropdown
              label="Sucursal / Sede"
              options={[]}
              placeholder="Seleccione sucursal..."
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
        <div className="border-t border-t-slate-600 dark:border-t-neutral-600 -mx-6 my-6 opacity-20"></div>
        {/* Sección 4: Información Salarial */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-[16px]! font-bold text-slate-800 dark:text-slate-800">
              Información Salarial
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Dropdown
              label="Moneda"
              options={[]}
              placeholder="Seleccione moneda..."
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
              placeholder="Seleccione tipo..."
            />
            <Dropdown
              label="Institución Bancaria"
              options={[]}
              placeholder="Seleccione banco..."
            />
          </div>
        </section>

        <div className="flex flex-row justify-end gap-4">
          <Button
            type="button"
            label="Descartar"
            size="giant"
            className="bg-slate-100! text-slate-600! hover:bg-slate-200! border-none!"
            onClick={handleCloseModal}
          />
          <Button
            type="submit"
            label="Guardar Colaborador"
            size="giant"
            className="shadow-lg shadow-blue-500/20"
          />
        </div>
      </form>
    </Modal>
  );
};
