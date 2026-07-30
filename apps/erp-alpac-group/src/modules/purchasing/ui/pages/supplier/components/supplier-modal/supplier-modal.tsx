import { useEffect, useMemo } from "react";
import { Button, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { IdentificationEnum, IdentificationOptions } from "@app/core/enums/identification.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/suppliers/requests/create-supplier-request";
import type { SupplierModalProps } from "./supplier-modal.types";
import { ConstitutionEnum, ConstitutionOptions } from "@app/core/enums/constitution.enum";
import { useSuppliers } from "@app/modules/purchasing/ui/hooks/suppliers/useSuppliers";
import {
   formatIdentificationNumber,
   formatRuc,
   validateEmail,
   validateIdentificationNumber,
} from "@app/shared/utils/string.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/suppliers/requests/update-suppliers-request";
import { useFieldTracker } from "@app/shared/hooks/useFieldTracker";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
   `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

const resolveConstitutionType = (value: number | string | null | undefined): number => {
   if (value === null || value === undefined || value === "") {
      return ConstitutionEnum.None.value;
   }
   if (typeof value === "number") return value;
   if (value === ConstitutionEnum.Natural.stringValue) return ConstitutionEnum.Natural.value;
   if (value === ConstitutionEnum.Legal.stringValue) return ConstitutionEnum.Legal.value;
   if (value === ConstitutionEnum.None.stringValue) return ConstitutionEnum.None.value;
   const parsed = Number(value);
   return Number.isFinite(parsed) ? parsed : ConstitutionEnum.None.value;
};

const resolveIdentificationType = (constitutionType: number): number | undefined => {
   if (constitutionType === ConstitutionEnum.Legal.value) {
      return IdentificationEnum.RUC.value;
   }
   if (constitutionType === ConstitutionEnum.Natural.value) {
      return IdentificationEnum.NATIONAL_ID.value;
   }
   return undefined;
};

const hasConstitutionData = (constitutionType?: number) =>
   constitutionType === ConstitutionEnum.Natural.value ||
   constitutionType === ConstitutionEnum.Legal.value;

const emptyFormValues: Partial<CreateSupplierRequest> = {
   suppliers_legal_name: "",
   constitution_type: ConstitutionEnum.None.value,
   identification_type: undefined,
   identification_number: "",
   contact_name: "",
   contact_phone_number: "",
   contact_email: "",
   email_support: "",
   address: "",
};

export const SupplierModal = ({
   isOpen,
   onClose,
   onSubmit,
   onRequestError,
   onRequestSuccess,
   selectedSupplier,
}: SupplierModalProps) => {


   const { CreateSupplier, UpdateSupplier } = useSuppliers();
   const { companyId, moduleCode } = useUserStore();
   const { getMappedError } = useMappedError();
   const isEditMode = Boolean(selectedSupplier?.supplier_id);

   const trackerInitial = useMemo((): UpdateSupplierRequest => {
      if (!selectedSupplier) {
         return {} as UpdateSupplierRequest;
      }

      const constitutionType = resolveConstitutionType(selectedSupplier.constitution_type);
      const identificationNumber = String(selectedSupplier.identification_number ?? "")
         .replace(/-/g, "")
         .toUpperCase();

      return {
         company_id: companyId,
         module_code: moduleCode,
         supplier_id: selectedSupplier.supplier_id,
         suppliers_legal_name: selectedSupplier.supplier_legal_name,
         ...(hasConstitutionData(constitutionType)
            ? {
                 identification_number: identificationNumber,
                 constitution_type: constitutionType,
                 identification_type: resolveIdentificationType(constitutionType),
              }
            : {}),
         //contact_name: selectedSupplier.contact_name,
         // contact_phone_number: selectedSupplier.contact_phone_number,
         // contact_email: selectedSupplier.contact_email,
         // email_support: selectedSupplier.email_support,
         // address: selectedSupplier.address,
      };
   }, [selectedSupplier, companyId, moduleCode]);

   const { updateData, updateFiledTracker, resetFieldTracker } =
      useFieldTracker<UpdateSupplierRequest>(trackerInitial);

   const {
      control,
      register,
      handleSubmit,
      reset,
      watch,
      setValue,
      formState: { errors },
   } = useForm<CreateSupplierRequest>();

   const constitutionType = watch("constitution_type");
   const isLegalPerson = constitutionType === ConstitutionEnum.Legal.value;
   const isNaturalPerson = constitutionType === ConstitutionEnum.Natural.value;

   const filteredIdentificationTypes = useMemo(() => {
      const filter = isLegalPerson ? IdentificationEnum.RUC.value : isNaturalPerson ? IdentificationEnum.NATIONAL_ID.value : null;
      return IdentificationOptions.filter(item => item.value === filter);
   }, [isLegalPerson, isNaturalPerson])

   const trackField = <K extends keyof UpdateSupplierRequest>(
      field: K,
      value: UpdateSupplierRequest[K],
   ) => {
      if (!isEditMode) return;
      updateFiledTracker(field, value);
   };

   const handleClose = () => {
      reset(emptyFormValues);
      resetFieldTracker();
      onClose();
   };

   const buildCreatePayload = (data: CreateSupplierRequest): CreateSupplierRequest => {
      const {
         constitution_type,
         identification_type,
         identification_number,
         ...rest
      } = data;

      const payload: CreateSupplierRequest = {
         ...rest,
         company_id: companyId,
         module_code: moduleCode,
      };

      if (hasConstitutionData(constitution_type)) {
         payload.constitution_type = constitution_type;
         payload.identification_type = identification_type;
         payload.identification_number = identification_number;
      }

      return payload;
   };

   const buildUpdatePayload = (): UpdateSupplierRequest => {
      const payload: UpdateSupplierRequest = {
         ...updateData,
         company_id: companyId,
         module_code: moduleCode,
         supplier_id: selectedSupplier!.supplier_id,
      };

      if (!hasConstitutionData(constitutionType)) {
         delete payload.constitution_type;
         delete payload.identification_type;
         delete payload.identification_number;
      }

      return payload;
   };

   const handleCreateSupplier = (data: CreateSupplierRequest) => {
      const payload = buildCreatePayload(data);

      CreateSupplier.mutate(payload, {
         onSuccess() {
            onRequestSuccess?.("Proveedor registrado exitosamente.");
            reset(emptyFormValues);
            resetFieldTracker();
            onSubmit?.(payload);
         },
         onError(error) {
            const mappedError = getMappedError(error);
            onRequestError?.(mappedError.description);
         },
      });
   };

   const handleUpdateSupplier = () => {
      if (!selectedSupplier?.supplier_id) return;

      const payload = buildUpdatePayload();

      UpdateSupplier.mutate(payload, {
         onSuccess() {
            onRequestSuccess?.("Proveedor actualizado exitosamente.");
            reset(emptyFormValues);
            resetFieldTracker();
            onSubmit?.(payload);
         },
         onError(error) {
            const mappedError = getMappedError(error);
            onRequestError?.(mappedError.description);
         },
      });
   };

   const handleSupplier = (data: CreateSupplierRequest) => {
      if (isEditMode) {
         handleUpdateSupplier();
         return;
      }
      handleCreateSupplier(data);
   };

   useEffect(() => {
      if (!isOpen) {
         reset(emptyFormValues);
         resetFieldTracker();
         return;
      }

      if (selectedSupplier) {
         const constitutionTypeValue = resolveConstitutionType(
            selectedSupplier.constitution_type,
         );
         const hasConstitution = hasConstitutionData(constitutionTypeValue);
         const identificationTypeValue = hasConstitution
            ? resolveIdentificationType(constitutionTypeValue)
            : undefined;
         const identificationNumber = hasConstitution
            ? String(selectedSupplier.identification_number ?? "")
                 .replace(/-/g, "")
                 .toUpperCase()
            : "";

         reset({
            suppliers_legal_name: selectedSupplier.supplier_legal_name,
            constitution_type: constitutionTypeValue,
            identification_type: identificationTypeValue,
            identification_number: identificationNumber,
            // contact_name: selectedSupplier.contact_name,
            // contact_phone_number: selectedSupplier.contact_phone_number,
            // contact_email: selectedSupplier.contact_email,
            // email_support: selectedSupplier.email_support,
            // address: selectedSupplier.address,
         });
         resetFieldTracker();
         return;
      }

      reset(emptyFormValues);
      resetFieldTracker();
   }, [isOpen, selectedSupplier, reset, resetFieldTracker]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         title={isEditMode ? "Actualizar proveedor" : "Registro de nuevo proveedor"}
         variant="form"
         size="5xl"
         description={
            isEditMode
               ? "Modifique la información del proveedor"
               : "Complete la información del proveedor"
         }
      >
         <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handleSupplier)}
         >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <InputText
                  label="Razón social"
                  placeholder="Ej. Distribuidora del Pacífico S.A."
                  isRequired
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("suppliers_legal_name", {
                     required: "La razón social es requerida",
                     onChange: (evt) => {
                        trackField("suppliers_legal_name", evt.target.value);
                     },
                  })}
                  error={errors.suppliers_legal_name?.message}
               />

               <Controller
                  control={control}
                  name="constitution_type"
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de constitución"
                        placeholder="Seleccione..."
                        options={ConstitutionOptions}
                        value={field.value}
                        onChange={(value) => {
                           const nextType = Number(value);
                           const nextIdentificationType = resolveIdentificationType(nextType);
                           field.onChange(nextType);
                           setValue("identification_type", nextIdentificationType);
                           setValue("identification_number", "");
                           if (hasConstitutionData(nextType)) {
                              trackField("constitution_type", nextType);
                              trackField("identification_type", nextIdentificationType);
                              trackField("identification_number", "");
                           } else {
                              trackField("constitution_type", undefined);
                              trackField("identification_type", undefined);
                              trackField("identification_number", undefined);
                           }
                        }}
                        appearance="dark"
                        className={dropdownClassName}
                        labelClassName={labelClassName}
                        valueClassName="text-black! dark:text-white!"
                        error={errors.constitution_type?.message}
                     />
                  )}
               />

               <Controller
                  control={control}
                  name="identification_type"
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de identificación"
                        placeholder="Seleccione..."
                        options={filteredIdentificationTypes}
                        value={field.value}
                        onChange={(value) => {
                           field.onChange(Number(value));
                        }}
                        appearance="dark"
                        className={dropdownClassName}
                        labelClassName={labelClassName}
                        valueClassName="text-black! dark:text-white!"
                     />
                  )}
               />

               <InputText
                  label="Número de identificación"
                  placeholder={
                     isLegalPerson ? "Ej. J0310000000001" : "Ej. 001-220145-0078D"
                  }
                  className={inputClassName}
                  labelClassName={labelClassName}
                  disabled={!hasConstitutionData(constitutionType)}
                  {...register("identification_number", {
                     setValueAs: (value: string) =>
                        value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                     validate: {
                        validIdentification: (value?: string) => {
                           if (isNaturalPerson) {
                              return validateIdentificationNumber(
                                 value ?? "",
                                 IdentificationEnum.NATIONAL_ID.value,
                              );
                           }
                           if (isLegalPerson) {
                              const clean = (value ?? "").replace(/-/g, "");
                              return (
                                 /^[A-Z]\d{13}$/.test(clean) ||
                                 "El RUC debe iniciar con letra y tener 14 caracteres"
                              );
                           }
                           return true;
                        },
                     },
                     onChange: (evt) => {
                        if (isLegalPerson) {
                           evt.target.value = formatRuc(evt.target.value);
                        } else if (isNaturalPerson) {
                           evt.target.value = formatIdentificationNumber(evt.target.value);
                        }
                        trackField(
                           "identification_number",
                           String(evt.target.value ?? "")
                              .replace(/-/g, "")
                              .toUpperCase(),
                        );
                     },
                  })}
                  error={errors.identification_number?.message}
               />

               <InputText
                  label="Nombre de contacto"
                  placeholder="Ej. Ana López"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("contact_name", {
                     onChange: (evt) => trackField("contact_name", evt.target.value),
                  })}
                  error={errors.contact_name?.message}
               />

               <InputText
                  label="Teléfono de contacto"
                  placeholder="Ej. 8888-1234"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("contact_phone_number", {
                     onChange: (evt) =>
                        trackField("contact_phone_number", evt.target.value),
                  })}
                  error={errors.contact_phone_number?.message}
               />

               <InputText
                  label="Correo de contacto"
                  placeholder="Ej. contacto@proveedor.com"
                  type="email"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("contact_email", {
                     required: false,
                     setValueAs: (value: string) => value?.trim(),
                     validate: {
                        validEmail: (value?: string) => validateEmail(value),
                     },
                     onChange: (evt) => trackField("contact_email", evt.target.value?.trim()),
                  })}
                  error={errors.contact_email?.message}
               />

               <InputText
                  label="Correo de soporte"
                  placeholder="Ej. soporte@proveedor.com"
                  type="email"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("email_support", {
                     required: false,
                     setValueAs: (value: string) => value?.trim(),
                     validate: {
                        validEmail: (value?: string) => validateEmail(value),
                     },
                     onChange: (evt) => trackField("email_support", evt.target.value?.trim()),
                  })}
                  error={errors.email_support?.message}
               />

               <div className="md:col-span-2">
                  <Textarea
                     label="Dirección"
                     placeholder="Ej. Managua, Km 7.5 Carretera Norte"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     {...register("address", {
                        onChange: (evt) => trackField("address", evt.target.value),
                     })}
                     error={errors.address?.message}
                     maxLength={500}
                     style={{
                        resize: "none",
                        height: "100px"
                     }}                     
                  />
               </div>
            </div>

            <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

            <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  onClick={handleClose}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
               />
               <Button
                  type="submit"
                  size="giant"
                  label="Guardar"
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
                  disabled={CreateSupplier.isPending || UpdateSupplier.isPending}
                  isLoading={CreateSupplier.isPending || UpdateSupplier.isPending}
               />
            </div>
         </form>
      </Modal>
   );
};
