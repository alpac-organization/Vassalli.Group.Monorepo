import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText, Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { EditableField } from "@app/modules/payroll/ui/pages/collaborator-profile/components/EditablePersonalField";
import {
  isValueMissing,
  missingDataInInputClassName,
} from "@app/modules/payroll/ui/pages/collaborator-profile/utils/field-missing-message";
import type { PersonalFormData } from "@app/modules/payroll/ui/pages/collaborator-profile/types/profile-details.types";
import { splitFullNameForForm } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/split-full-name";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import type { PersonalInformationProps } from "./personal-information.type";
import { GenderValues } from "./personal-information.variants";

const defaultPersonalInformation: PersonalFormData = {
  identification_number: "",
  gender: "",
  firstName: "",
  firstLastName: "",
  secondLastName: "",
  address: "",
  personalEmail: "",
  personalPhone: "",
  department: "",
};

export const PersonalInformation = ({ profile }: PersonalInformationProps) => {
   
   const formMethods = useForm<PersonalFormData>({
      mode: "onChange",
      defaultValues: defaultPersonalInformation,
   });

   const { reset, control, register } = formMethods;

   useEffect(() => {

      const personal_information = profile?.personal_information;
      // const department = personal_information.department ?? personal_information.departament ?? "";
      // const names = splitFullNameForForm(profile.full_name);
      
      reset({
         identification_number: formatIdentificationNumber(personal_information?.identification_number ?? "No definido"),
         gender: personal_information?.gender ?? "No definido",
         address: personal_information?.address ?? "No definido",
         personalEmail: personal_information?.personal_email ?? "No definido",
         personalPhone: personal_information?.personal_phone_number ?? "No definido",
         department: personal_information?.department ?? "No definido",});

   }, [profile, reset]);

   // const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
   
   // const [alertInfo, setAlertInfo] = useState<{
   //    type: "success" | "error";
   //    title: string;
   //    message: string;
   // } | null>(null);

   // useEffect(() => {
   //    if (alertInfo) {
   //       const timer = setTimeout(() => setAlertInfo(null), 3000);
   //       return () => clearTimeout(timer);
   //    }
   // }, [alertInfo]);

   // const handleEditStart = (name: string) => setEditingFields((prev) => ({ ...prev, [name]: true }));
   // const handleEditEnd = (name: string) =>   setEditingFields((prev) => ({ ...prev, [name]: false }));

   // const handleFieldUpdate = async (name: keyof PersonalFormData, value: string) => {
   //    try {
   //       await new Promise((resolve) => setTimeout(resolve, 1500));


   //       setAlertInfo({
   //          type: "success",
   //          title: "¡exito!",
   //          message: "el campo se actualio",
   //       });
   //    } 
   //    catch (error) {
   //       setAlertInfo({
   //          type: "error",
   //          title: "Error",
   //          message: "No se pudo actualizar el campo.",
   //       });
   //       throw error;
   //    }
   // };

   const readOnlyInputClasses = "disabled:dark:bg-[#1e2229]! disabled:dark:border-slate-700/50! disabled:px-3! disabled:opacity-100! disabled:shadow-none! disabled:font-medium!";


   return (
      <div className="flex flex-col w-full max-w-full relative min-h-0">

         {/* <AnimatedAlertWrapper open={!!alertInfo}>
            {
               alertInfo ? (
                  <Alert
                     type={alertInfo.type}
                     title={alertInfo.title}
                     message={alertInfo.message}
                     showCloseButton
                     onClose={() => setAlertInfo(null)}
                  />
               ) : null
            }
         </AnimatedAlertWrapper> */}
                     
         <div className="w-full max-w-full mb-8">
            <section className="w-full dark:bg-[#272b34] bg-white border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
               <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4 ">

                     <InputText
                        label="Tipo de Identificación"
                        labelClassName="text-white "
                        disabled 
                        value="Cédula  Nicaraguense"
                        className={`${readOnlyInputClasses} min-w-0 w-full max-w-full` }
                     />

                     <InputText
                        label="Número de Identificación"
                        labelClassName="text-white "
                        disabled
                        editable={false}
                        value={formMethods.getValues("identification_number")}
                        className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isValueMissing(formMethods.getValues("identification_number")) ? missingDataInInputClassName : ""}`}
                     />

                     <InputText
                        label="Género"
                        labelClassName="text-[13px] sm:text-[14px] font-medium ml-0.5 text-white!"
                        disabled
                        editable={false}
                        value={GenderValues[formMethods.getValues("gender")] || formMethods.getValues("gender")}  
                        className={`${readOnlyInputClasses} min-w-0 w-full max-w-full ${isValueMissing(formMethods.getValues("gender")) ? missingDataInInputClassName : ""}`}
                     />

                  {/* <EditableField
                     name="firstName"
                     label="Primer Nombre"
                     missingMessage="Primer nombre no registrado"
                     validation={{ required: "Requerido" }}
                     formMethods={formMethods}
                     isEditing={editingFields.firstName}
                     onEditStart={handleEditStart}
                     onEditEnd={handleEditEnd}
                     onConfirmUpdate={handleFieldUpdate}
                  /> */}

                  {/* <EditableField
                     name="secondName"
                     label="Segundo Nombre"
                     missingMessage="Segundo nombre no registrado"
                     formMethods={formMethods}
                     isEditing={editingFields.secondName}
                     onEditStart={handleEditStart}
                     onEditEnd={handleEditEnd}
                     onConfirmUpdate={handleFieldUpdate}
                  /> */}

                  {/* <EditableField
                     name="firstLastName"
                     label="Primer Apellido"
                     missingMessage="Primer apellido no registrado"
                     validation={{ required: "Requerido" }}
                     formMethods={formMethods}
                     isEditing={editingFields.firstLastName}
                     onEditStart={handleEditStart}
                     onEditEnd={handleEditEnd}
                     onConfirmUpdate={handleFieldUpdate}
                  /> */}

                  {/* <EditableField
                     name="secondLastName"
                     label="Segundo Apellido"
                     missingMessage="Segundo apellido no registrado"
                     formMethods={formMethods}
                     isEditing={editingFields.secondLastName}
                     onEditStart={handleEditStart}
                     onEditEnd={handleEditEnd}
                     onConfirmUpdate={handleFieldUpdate}
                  /> */}
                  
                  {/* <EditableField
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
                  /> */}
                  
                  {/* <EditableField
                     name="personalPhone"
                     label="Teléfono Personal"
                     missingMessage="Teléfono personal no registrado"
                     type="tel"
                     formMethods={formMethods}
                     isEditing={editingFields.personalPhone}
                     onEditStart={handleEditStart}
                     onEditEnd={handleEditEnd}
                     onConfirmUpdate={handleFieldUpdate}
                  /> */}
                  
                  {/* <EditableField
                     name="department"
                     label="Departamento"
                     missingMessage="Departamento no registrado"
                     formMethods={formMethods}
                     isEditing={editingFields.department}
                     onEditStart={handleEditStart}
                     onEditEnd={handleEditEnd}
                     onConfirmUpdate={handleFieldUpdate}
                  /> */}
                  
                     {/* <div className="min-w-0 sm:col-span-2 lg:col-span-2">
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
                     </div> */}
                  </div>
               </div>
            </section>
         </div>
      </div>
   );
};
