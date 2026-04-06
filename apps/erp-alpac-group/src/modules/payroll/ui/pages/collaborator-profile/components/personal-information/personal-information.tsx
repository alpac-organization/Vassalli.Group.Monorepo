import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputText, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditablePersonalField";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import type { PersonalInformationProps } from "./types/personal-information.type";
import { genderRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/genderRawToLabel";
import { maritalRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/maritalRawToLabel";
import { identificationRawToLabel } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/identificationRawToLabel";
import { IdentificationEnum } from "@app/core/enums/identifcation.enum";

const defaultPersonalInformation: PersonalFormData = {
  identification_number: "",
  identification_type: "",
  gender: "",
  marital_status: "",
  firstName: "",
  secondName: "",
  firstLastName: "",
  secondLastName: "",
  address: "",
  personalEmail: "",
  personalPhone: "",
  departament: "",
};

export const PersonalInformation = ({ profile }: PersonalInformationProps) => {
  const formMethods = useForm<PersonalFormData>({
    mode: "onChange",
    defaultValues: defaultPersonalInformation,
  });

  const { reset, watch, register } = formMethods;

  useEffect(() => {
    const personal_information = profile?.personal_information;

    reset({
      identification_type:
        identificationRawToLabel(personal_information?.identification_type) ||
        IdentificationEnum.NATIONAL_ID.label,
      identification_number: formatIdentificationNumber(
        personal_information?.identification_number ?? "",
      ),
      gender: genderRawToLabel(personal_information?.gender) ?? "",
      marital_status:
        maritalRawToLabel(personal_information?.marital_status) ?? "",
      address: personal_information?.address ?? "",
      personalEmail: personal_information?.personal_email ?? "",
      personalPhone: personal_information?.personal_phone_number ?? "",
      departament: personal_information?.departament ?? "",
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
    _name: keyof PersonalFormData,
    _value: string,
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAlertInfo({
        type: "success",
        title: "¡Éxito!",
        message: "El campo se actualizó",
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

  const idNumberValue = watch("identification_number");
  const idTypeValue = watch("identification_type");
  const genderValue = watch("gender");
  const maritalValue = watch("marital_status");
  const genderDisplay = genderRawToLabel(genderValue) ?? genderValue;
  const maritalDisplay = maritalRawToLabel(maritalValue) ?? maritalValue ?? "";
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
        <section className="w-full dark:bg-[#272b34] bg-white border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputText
                label="Tipo de Identificación"
                {...register("identification_type")}
                labelClassName="text-white"
                disabled
                editable={false}
                value={idTypeValue}
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isValueMissing(idTypeValue) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                label="Número de Identificación"
                labelClassName="text-white"
                disabled
                editable={false}
                {...register("identification_number")}
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isValueMissing(idNumberValue) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                label="Género"
                labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
                disabled
                editable={false}
                {...register("gender")}
                value={genderDisplay}
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isValueMissing(genderValue) ? missingDataInInputClassName : ""}`}
              />

              <InputText
                label="Estado civil"
                labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
                disabled
                editable={false}
                {...register("marital_status")}
                value={maritalDisplay}
                className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isValueMissing(maritalValue) ? missingDataInInputClassName : ""}`}
              />

              <EditableField
                name="firstName"
                label="Primer Nombre"
                missingMessage="Primer nombre no registrado"
                formMethods={formMethods}
                isEditing={false}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onConfirmUpdate={handleFieldUpdate}
              />

              <EditableField
                name="secondName"
                label="Segundo Nombre"
                missingMessage="Segundo nombre no registrado"
                formMethods={formMethods}
                isEditing={false}
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
                name="departament"
                label="Departamento"
                missingMessage="Departamento no registrado"
                formMethods={formMethods}
                isEditing={editingFields.departament}
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
