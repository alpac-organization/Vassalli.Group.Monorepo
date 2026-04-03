import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputText, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { EditableField } from "./EditableField";
import type { PersonalFormData } from "../types/profile-details.types";

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

      setAlertInfo({
        type: "error",
        title: "¡error!",
        message: "el campo no se actualio",
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
    <div className="flex flex-col w-full max-w-full relative min-h-0">
      <AnimatedAlertWrapper open={!!alertInfo}>
        {alertInfo ? (
          <Alert
            type={alertInfo.type}
            title={alertInfo.title}
            message={alertInfo.message}
            showCloseButton
            onClose={() => setAlertInfo(null)}
          />
        ) : null}
      </AnimatedAlertWrapper>
      <div className="w-full max-w-full mb-8">
        <section className="w-full dark:bg-[#272b34] bg-white rounded-xl border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-w-0 w-full flex-col gap-2">
                <InputText
                  label="Tipo de Identificación"
                  labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                  disabled
                  editable={false}
                  className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!"
                  {...register("identificationType")}
                />
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <InputText
                  label="Número de Identificación"
                  labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                  disabled
                  editable={false}
                  className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!"
                  {...register("identificationNumber")}
                />
              </div>
              <div className="flex min-w-0 w-full flex-col gap-2">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                  <InputText
                    label="Registrado por"
                    labelClassName="text-[14px] font-medium ml-0.5 text-white!"
                    disabled
                    editable={false}
                    className="disabled:dark:bg-[#1e2229]! disabled:dark:text-slate-200! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium! min-w-0 flex-1"
                    {...register("registeredBy")}
                  />
                </div>
              </div>

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
              <div className="min-w-0 sm:col-span-2 lg:col-span-2">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
