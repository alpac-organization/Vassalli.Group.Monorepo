import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { EditableField } from "./EditableField";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "./field-missing-message";
import type { PersonalFormData } from "../types/profile-details.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import { splitFullNameForForm } from "../utils/split-full-name";
import { FormatIdentificationNumber } from "@app/shared/utils/format-identification-number";

const defaultPersonalInformation: PersonalFormData = {
  identificationNumber: "",
  gender: "",
  firstName: "",
  firstLastName: "",
  secondLastName: "",
  address: "",
  personalEmail: "",
  personalPhone: "",
  department: "",
};

export type PersonalInformationProps = {
  profile?: GetCollaboratorProfileDetailsResponse | null;
};

export const PersonalInformation = ({ profile }: PersonalInformationProps) => {
  const formMethods = useForm<PersonalFormData>({
    mode: "onChange",
    defaultValues: defaultPersonalInformation,
  });

  const { reset, control } = formMethods;

  useEffect(() => {
    if (!profile) return;
    const p = profile.personal_information;
    const department = p.department ?? p.departament ?? "";
    const names = splitFullNameForForm(profile.full_name);
    reset({
      identificationNumber: FormatIdentificationNumber(
        p.identification_number ?? "",
      ),
      gender: p.gender ?? "",
      firstName: names.firstName,
      secondName: names.secondName,
      firstLastName: names.firstLastName,
      secondLastName: names.secondLastName,
      address: p.address ?? "",
      personalEmail: p.personal_email ?? "",
      personalPhone: p.personal_phone_number ?? "",
      department,
    });
  }, [profile, reset]);

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

  const readOnlyInputClasses =
    "disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!";

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
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="identificationNumber"
                control={control}
                render={({ field }) => {
                  const missing = isValueMissing(field.value);
                  return (
                    <InputText
                      label="Número de Identificación"
                      labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
                      disabled
                      editable={false}
                      value={
                        missing
                          ? "Número de identificación no registrado"
                          : String(field.value ?? "")
                      }
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${missing ? missingDataInInputClassName : ""}`}
                    />
                  );
                }}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  const missing = isValueMissing(field.value);
                  return (
                    <InputText
                      label="Género"
                      labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
                      disabled
                      editable={false}
                      value={
                        missing ? "Género no registrado" : String(field.value ?? "")
                      }
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${missing ? missingDataInInputClassName : ""}`}
                    />
                  );
                }}
              />

              <EditableField
                name="firstName"
                label="Primer Nombre"
                missingMessage="Primer nombre no registrado"
                validation={{ required: "Requerido" }}
                formMethods={formMethods}
                isEditing={editingFields.firstName}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
              />
              <EditableField
                name="secondName"
                label="Segundo Nombre"
                missingMessage="Segundo nombre no registrado"
                formMethods={formMethods}
                isEditing={editingFields.secondName}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
              />
              <EditableField
                name="firstLastName"
                label="Primer Apellido"
                missingMessage="Primer apellido no registrado"
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
                missingMessage="Segundo apellido no registrado"
                formMethods={formMethods}
                isEditing={editingFields.secondLastName}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
              />
              <EditableField
                name="personalEmail"
                label="Correo Personal"
                missingMessage="Correo personal no registrado"
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
                missingMessage="Teléfono personal no registrado"
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
                missingMessage="Departamento no registrado"
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
                  missingMessage="Dirección no registrada"
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
