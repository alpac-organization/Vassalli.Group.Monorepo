import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CreditCard, User, Mail, MapPin } from "lucide-react";
import { InputText, Alert } from "@alpac/design-system";
import { EditableField } from "./EditableField";
import { AnimatedAlertWrapper } from "./AnimatedAlertWrapper";
import type { PersonalFormData } from "../types/profile-details.types";

const readOnlyInputClasses =
  "!h-[42px] disabled:dark:!bg-[#1e2229] disabled:dark:!text-slate-200 disabled:dark:!border-slate-700/50 disabled:!px-3 disabled:!opacity-100 disabled:!shadow-none disabled:!font-medium";

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
        type: "success",
        title: "¡Actualizado!",
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

      <div className="w-full max-w-full space-y-6 mb-8">
        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/10">
                <CreditCard className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Identificación Oficial
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Información de registro y documentación
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  Tipo de Identificación
                </label>
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("identificationType")}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-500" />
                  Número de Identificación
                </label>
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("identificationNumber")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full pt-1 border-t border-slate-200 dark:border-slate-700/30">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                Registrado por
              </label>
              <div className="flex items-center gap-2">
                <InputText
                  disabled
                  editable={false}
                  className={readOnlyInputClasses}
                  {...register("registeredBy")}
                />
                <span className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 whitespace-nowrap">
                  Verificado
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/10">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Datos Personales
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Nombre completo y datos básicos
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
          </div>
        </section>

        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 dark:bg-teal-500/10">
                <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Información de Contacto
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Medios de comunicación personal
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            </div>
          </div>
        </section>

        <section className="w-full dark:bg-[#1a1d24] bg-white rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/10">
                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  Ubicación
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Dirección y localización geográfica
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>
        </section>
      </div>
    </div>
  );
};
