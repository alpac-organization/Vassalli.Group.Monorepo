import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputText, Alert } from "@alpac/design-system";
import { EditableField } from "./EditableField";
import { AnimatedAlertWrapper } from "./AnimatedAlertWrapper";
import type { PersonalFormData } from "../types/profile-details.types";

const readOnlyInputClasses =
  "!h-[42px] disabled:dark:!bg-transparent disabled:dark:!text-slate-300 disabled:dark:!border-transparent disabled:!px-0 disabled:!opacity-100 disabled:!shadow-none";

export const PersonalInformation = () => {
  const formMethods = useForm<PersonalFormData>({
    mode: "onChange",
    defaultValues: {
      identificationNumber: "001-000000-0000A",
      identificationType: "Cédula",
      registeredBy: "Admin Sistema",
      firstName: "Luis f",
      firstLastName: "García",
      secondLastName: "López",
      address: "Managua, Nicaragua",
      personalEmail: "luis@personal.com",
      personalPhone: "+505 8000 0000",
      department: "Managua",
    },
  });

  const { register } = formMethods;

  const [editingFields, setEditingFields] = useState<Record<string, boolean>>(
    {},
  );
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleEditStart = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: true }));
  const handleEditEnd = (name: string) =>
    setEditingFields((prev) => ({ ...prev, [name]: false }));

  const handleFieldUpdate = async (
    name: keyof PersonalFormData,
    value: string,
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Campo actualizado -> ${name}: ${value}`);

      setAlertInfo({
        type: "error",
        title: "¡no Actualizado!",
        message: "El campo se ha guardado correctamente.",
      });
    } catch (error) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: "No se pudo actualizar el campo.",
      });
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {alertInfo && (
        <AnimatedAlertWrapper>
          <Alert
            type={alertInfo.type}
            title={alertInfo.title}
            message={alertInfo.message}
            showCloseButton
            onClose={() => setAlertInfo(null)}
          />
        </AnimatedAlertWrapper>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full mb-8 dark:bg-[#272b34] p-8 rounded-lg">
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Tipo de Identificación
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("identificationType")}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Número de Identificación
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("identificationNumber")}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[12px] font-medium text-slate-500 dark:text-slate-400 ml-0.5 uppercase tracking-wider">
                Registrado por
              </label>
              <InputText
                disabled
                editable={false}
                className={readOnlyInputClasses}
                {...register("registeredBy")}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-4">
            <EditableField
              name="firstName"
              label="Primer Nombre"
              validation={{ required: "Requerido" }}
              formMethods={formMethods}
              isEditing={editingFields.firstName}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
            <EditableField
              name="firstLastName"
              label="Primer Apellido"
              validation={{ required: "Requerido" }}
              formMethods={formMethods}
              isEditing={editingFields.firstLastName}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
            <EditableField
              name="secondLastName"
              label="Segundo Apellido"
              formMethods={formMethods}
              isEditing={editingFields.secondLastName}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-4">
            <EditableField
              name="personalEmail"
              label="Correo Personal"
              type="email"
              validation={{ required: "Requerido" }}
              formMethods={formMethods}
              isEditing={editingFields.personalEmail}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
            <EditableField
              name="personalPhone"
              label="Teléfono Personal"
              type="tel"
              formMethods={formMethods}
              isEditing={editingFields.personalPhone}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
            <EditableField
              name="department"
              label="Departamento"
              formMethods={formMethods}
              isEditing={editingFields.department}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
            <EditableField
              name="address"
              label="Dirección Exacta"
              formMethods={formMethods}
              isEditing={editingFields.address}
              onEditStart={handleEditStart}
              onEditEnd={handleEditEnd}
              onConfirmUpdate={handleFieldUpdate}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
