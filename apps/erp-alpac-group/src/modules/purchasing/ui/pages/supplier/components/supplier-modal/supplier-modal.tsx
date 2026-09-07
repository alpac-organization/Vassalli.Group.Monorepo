import { useEffect, useMemo } from "react";
import { Button, Checkbox, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { IdentificationEnum, IdentificationOptions } from "@app/core/enums/identification.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { CreatedSupplierDto, SupplierModalProps } from "./supplier-modal.types";
import { ConstitutionEnum, ConstitutionOptions } from "@app/core/enums/constitution.enum";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import {
   formatIdentificationNumber,
   formatRuc,
   validateEmail,
   validateIdentificationNumber,
   validateNicaraguaPhone,
} from "@app/shared/utils/string.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import { useFieldTracker } from "@app/shared/hooks/useFieldTracker";
import { isValidateValue } from "@app/shared/utils/values.utils";
import { Loader } from "@app/shared/components/loaders/loader";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
   `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";

const constitutionEnumMap = new Map<string, number>([
   [ConstitutionEnum.Legal.stringValue, ConstitutionEnum.Legal.value],
   [ConstitutionEnum.Natural.stringValue, ConstitutionEnum.Natural.value]
]);

const identificationEnumMap = new Map<string, number>([
   [IdentificationEnum.RUC.stringValue, IdentificationEnum.RUC.value],
   [IdentificationEnum.NATIONAL_ID.stringValue, IdentificationEnum.NATIONAL_ID.value],
]);

const resolveConstitutionType = (value: string): number => {
   return constitutionEnumMap.get(value) ?? 0;
};


const getIdentificationTypeByConstitution = (constitutionType?: number): number => {
   if (constitutionType === ConstitutionEnum.Legal.value) return IdentificationEnum.RUC.value;
   if (constitutionType === ConstitutionEnum.Natural.value) return IdentificationEnum.NATIONAL_ID.value;
   return 0;
};

const resolveIdentificationType = (identificationType?: string | null, constitutionType?: string | null): number => {
   if (
      ConstitutionEnum.Legal.stringValue === constitutionType &&
      IdentificationEnum.NATIONAL_ID.stringValue === identificationType
   ) {
      return IdentificationEnum.RUC.value;
   }

   if (identificationType) {
      const mapped = identificationEnumMap.get(identificationType);
      if (isValidateValue(mapped)) return mapped!;
   }

   return getIdentificationTypeByConstitution(constitutionEnumMap.get(constitutionType ?? ""));
};

const hasConstitutionData = (constitutionType?: number) =>
   constitutionType === ConstitutionEnum.Natural.value ||
   constitutionType === ConstitutionEnum.Legal.value;

const emptyFormValues: Partial<CreateSupplierRequest> = {
   suppliers_legal_name: "",
   constitution_type: 0,
   identification_type: undefined,
   identification_number: "",
   supplier_details: {
      credit_days: 0,
      has_credit: false,
      contact_name: "",
      contact_phone_number: "",
      contact_email: "",
      email_support: "",
      address: "",
   }
};

export const SupplierModal = ({
   isOpen,
   onClose,
   onSubmit,
   onRequestError,
   onRequestSuccess,
   selectedSupplier,
}: SupplierModalProps) => {

   const { companyId, moduleCode } = useUserStore();
   const isEditMode = Boolean(selectedSupplier?.supplier_id);

   const {
      CreateSupplier,
      UpdateSupplier,
      GetSupplierDetails
   } = useSupplier({
      supplierDetailFilters:
         isOpen && selectedSupplier?.supplier_id
            ? {
               company_id: companyId,
               module_code: moduleCode,
               supplier_id: selectedSupplier.supplier_id,
            }
            : undefined,
   });

   const { data: supplierDetails, isPending: isSupplierDetailsPending } = GetSupplierDetails;

   const { getMappedError } = useMappedError();

   const trackerInitial = useMemo((): UpdateSupplierRequest => {
      if (!selectedSupplier || !supplierDetails) {
         return {} as UpdateSupplierRequest;
      }

      const constitutionType = resolveConstitutionType(supplierDetails.constitution_type);
      const identificationType = resolveIdentificationType(
         supplierDetails.identification_type,
         supplierDetails.constitution_type,
      );
      const identificationNumber = String(supplierDetails.identification_number ?? "")
         .replace(/-/g, "")
         .toUpperCase();
      const details = supplierDetails.supplier_details;

      return {
         company_id: companyId,
         module_code: moduleCode,
         supplier_id: selectedSupplier.supplier_id,
         suppliers_legal_name: supplierDetails.supplier_legal_name,
         supplier_details: {
            address: details?.address ?? undefined,
            email_support: details?.email_support ?? undefined,
            contact_name: details?.contact_name ?? undefined,
            contact_email: details?.contact_email ?? undefined,
            contact_phone_number: details?.contact_phone_number ?? undefined,
            credit_days: details?.credit_days ?? 0,
            has_credit: Boolean(details?.has_credit),
         },
         ...(hasConstitutionData(constitutionType)
            ? {
               identification_number: identificationNumber,
               constitution_type: constitutionType,
               identification_type: identificationType,
            }
            : {}),
      };
   }, [selectedSupplier, supplierDetails, companyId, moduleCode]);

   const { updateData, updateFiledTracker, resetFieldTracker } =
      useFieldTracker<UpdateSupplierRequest>(trackerInitial);

   const {
      control,
      register,
      handleSubmit,
      reset,
      watch,
      setValue,
      clearErrors,
      formState: { errors },
   } = useForm<CreateSupplierRequest>({
      defaultValues: emptyFormValues as CreateSupplierRequest,
   });

   const constitutionType = watch("constitution_type");
   const identificationType = watch("identification_type");
   const hasCredit = watch("supplier_details.has_credit");
   const isLegalPerson = constitutionType === ConstitutionEnum.Legal.value;
   const isNaturalPerson = constitutionType === ConstitutionEnum.Natural.value;
   const hasIdentificationType = isValidateValue(identificationType);

   const filteredIdentificationTypes = useMemo(() => {
      const filter = getIdentificationTypeByConstitution(Number(constitutionType));
      return IdentificationOptions.filter((item) => item.value === filter);
   }, [constitutionType]);

   const trackField = <K extends keyof UpdateSupplierRequest>(
      field: K,
      value: UpdateSupplierRequest[K],
   ) => {
      if (!isEditMode) return;
      updateFiledTracker(field, value);
   };

   const trackDetailField = <K extends keyof SupplierDetailsInformation>(
      field: K,
      value: SupplierDetailsInformation[K],
   ) => {
      if (!isEditMode) return;

      const initialValue = trackerInitial.supplier_details?.[field];
      const current = { ...(updateData.supplier_details ?? {}) };

      if (initialValue === value) {
         delete current[field];
      } else {
         current[field] = value;
      }

      updateFiledTracker(
         "supplier_details",
         Object.keys(current).length === 0
            ? trackerInitial.supplier_details
            : current,
      );
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
         supplier_details,
         ...rest
      } = data;

      const hasCredit = Boolean(supplier_details?.has_credit);

      const payload: CreateSupplierRequest = {
         ...rest,
         company_id: companyId,
         module_code: moduleCode,
         supplier_details: {
            ...supplier_details,
            has_credit: hasCredit,
            credit_days: hasCredit ? Number(supplier_details?.credit_days) || 0 : 0,
         },
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
         company_id: companyId,
         module_code: moduleCode,
         supplier_id: selectedSupplier!.supplier_id,
         ...updateData,
      };

      if (
         payload.supplier_details &&
         Object.keys(payload.supplier_details).length === 0
      ) {
         delete payload.supplier_details;
      }

      if (!hasConstitutionData(constitutionType)) {
         delete payload.constitution_type;
      }

      return payload;
   };

   const handleCreateSupplier = (data: CreateSupplierRequest) => {
      const payload = buildCreatePayload(data);

      CreateSupplier.mutate(payload, {
         onSuccess(supplier) {

            const createdSupplier: CreatedSupplierDto = {
               data: supplier,
               supplier_name: payload.suppliers_legal_name
            }

            onRequestSuccess?.("Proveedor registrado exitosamente.");
            reset(emptyFormValues);
            resetFieldTracker();
            onSubmit?.(createdSupplier);
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
            handleClose();
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

      if (!selectedSupplier) {
         reset(emptyFormValues);
         resetFieldTracker();
         return;
      }

      if (!supplierDetails) return;

      const constitutionTypeValue = resolveConstitutionType(supplierDetails.constitution_type);

      const hasConstitution = hasConstitutionData(constitutionTypeValue);

      const identificationTypeValue = resolveIdentificationType(supplierDetails.identification_type, supplierDetails.constitution_type);

      const identificationNumber = hasConstitution
         ? String(supplierDetails.identification_number ?? "")
            .replace(/-/g, "")
            .toUpperCase()
         : "";

      const details = supplierDetails.supplier_details;

      reset({
         suppliers_legal_name: supplierDetails.supplier_legal_name,
         constitution_type: constitutionTypeValue,
         identification_type: identificationTypeValue,
         identification_number: identificationNumber,
         supplier_details: {
            credit_days: details?.credit_days ?? 0,
            has_credit: Boolean(details?.has_credit),
            contact_name: details?.contact_name ?? "",
            contact_phone_number: details?.contact_phone_number ?? "",
            contact_email: details?.contact_email ?? "",
            email_support: details?.email_support ?? "",
            address: details?.address ?? "",
         },
      });
      resetFieldTracker();
   }, [isOpen, selectedSupplier, supplierDetails, reset, resetFieldTracker]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         title={isEditMode ? "Actualizar proveedor" : "Registro de nuevo proveedor"}
         variant="form"
         size="4xl"
         description={
            isEditMode
               ? "Modifique la información del proveedor"
               : "Complete la información del proveedor"
         }
      >
         {isEditMode && isSupplierDetailsPending && (
            <Loader title="Cargando detalle del proveedor..." />
         )}
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
                  rules={{
                     required: true,
                     validate: (val) => val !== 0 || "Tipo de constitución es requerido inválida",
                  }}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de constitución"
                        placeholder="Seleccione..."
                        isRequired
                        options={ConstitutionOptions}
                        value={field.value}
                        onChange={(value) => {
                           const nextType = Number(value);
                           const nextIdentificationType = getIdentificationTypeByConstitution(nextType);

                           field.onChange(nextType);
                           setValue("identification_type", nextIdentificationType);
                           setValue("identification_number", "");
                           clearErrors(["identification_number", "identification_type"]);
                           if (hasConstitutionData(nextType)) {
                              trackField("constitution_type", nextType);
                              trackField("identification_type", nextIdentificationType);
                              trackField("identification_number", null);
                           } else {
                              trackField("constitution_type", undefined);
                              trackField("identification_type", null);
                              trackField("identification_number", null);
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
                  rules={{
                     required: "El tipo de identificación es requerido",
                     validate: (val) =>
                        isValidateValue(val) || "El tipo de identificación es requerido",
                  }}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de identificación"
                        placeholder="Seleccione..."
                        isRequired
                        disabled={!hasConstitutionData(constitutionType)}
                        options={filteredIdentificationTypes}
                        value={field.value}
                        onChange={(value) => {
                           const nextType = Number(value);
                           field.onChange(nextType);
                           setValue("identification_number", "");
                           clearErrors("identification_number");
                           trackField("identification_type", nextType);
                        }}
                        appearance="dark"
                        className={dropdownClassName}
                        labelClassName={labelClassName}
                        valueClassName="text-black! dark:text-white!"
                        error={errors.identification_type?.message}
                     />
                  )}
               />

               <InputText
                  label="Número de identificación"
                  placeholder={
                     isLegalPerson ? "Ej. J0310000000001" : "Ej. 001-220145-0078D"
                  }
                  isRequired
                  className={inputClassName}
                  labelClassName={labelClassName}
                  disabled={!hasConstitutionData(constitutionType) || !hasIdentificationType}
                  {...register("identification_number", {
                     setValueAs: (value: string) =>
                        value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                     validate: {
                        required: (value?: string) =>
                           Boolean(value?.trim()) || "El número de identificación es requerido",
                        validIdentification: (value?: string) => {
                           if (!value?.trim()) return true;

                           if (isNaturalPerson) {
                              return validateIdentificationNumber(
                                 value,
                                 IdentificationEnum.NATIONAL_ID.value,
                              );
                           }
                           if (isLegalPerson) {
                              const clean = value.replace(/-/g, "");
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
                  {...register("supplier_details.contact_name", {
                     onChange: (evt) => trackDetailField("contact_name", evt.target.value),
                  })}
                  error={errors.supplier_details?.contact_name?.message}
               />

               <InputText
                  label="Teléfono de contacto"
                  placeholder="Ej. 8888-1234"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("supplier_details.contact_phone_number", {
                     onChange: (evt) =>
                        trackDetailField("contact_phone_number", evt.target.value),
                     validate: (value) => !value || validateNicaraguaPhone(value),
                  })}
                  error={errors.supplier_details?.contact_phone_number?.message}
               />

               <InputText
                  label="Correo de contacto"
                  placeholder="Ej. contacto@proveedor.com"
                  type="email"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("supplier_details.contact_email", {
                     required: false,
                     setValueAs: (value: string) => value?.trim(),
                     validate: {
                        validEmail: (value?: string) => validateEmail(value),
                     },
                     onChange: (evt) =>
                        trackDetailField("contact_email", evt.target.value?.trim()),
                  })}
                  error={errors.supplier_details?.contact_email?.message}
               />

               <InputText
                  label="Correo de soporte"
                  placeholder="Ej. soporte@proveedor.com"
                  type="email"
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("supplier_details.email_support", {
                     required: false,
                     setValueAs: (value: string) => value?.trim(),
                     validate: {
                        validEmail: (value?: string) => validateEmail(value),
                     },
                     onChange: (evt) =>
                        trackDetailField("email_support", evt.target.value?.trim()),
                  })}
                  error={errors.supplier_details?.email_support?.message}
               />

               <Controller
                  control={control}
                  name="supplier_details.has_credit"
                  render={({ field }) => (
                     <div className="flex items-start">
                        <Checkbox
                           label="Tiene crédito"
                           checked={Boolean(field.value)}
                           onChange={(e) => {
                              const checked = e.target.checked;
                              field.onChange(checked);
                              if (!checked) {
                                 setValue("supplier_details.credit_days", 0);
                                 trackDetailField("has_credit", checked);
                                 trackDetailField("credit_days", 0);
                                 return;
                              }
                              trackDetailField("has_credit", checked);
                           }}
                           className="whitespace-nowrap"
                        />
                     </div>
                  )}
               />

               {
                  hasCredit && (
                     <InputText
                        label="Días de crédito"
                        type="number"
                        min="0"
                        placeholder="0"
                        isRequired
                        className={inputClassName}
                        labelClassName={labelClassName}
                        {...register("supplier_details.credit_days", {
                           setValueAs: (value) => {
                              if (value === "" || value === null || value === undefined) {
                                 return 0;
                              }
                              return Number(value);
                           },
                           validate: (value) => {
                              if (!hasCredit) return true;

                              const days = Number(value);
                              if (value === null || value === undefined || Number.isNaN(days) || days < 1) {
                                 return "Los días de crédito son requeridos";
                              }
                              if (days <= 0) {
                                 return "Los días de crédito deben ser mayores a 0";
                              }
                              return true;
                           },
                           onChange: (evt) => {
                              trackDetailField("credit_days", Number(evt.target.value) || 0);
                           },
                        })}
                        error={errors.supplier_details?.credit_days?.message}
                     />
                  )
               }


               <div className="md:col-span-2">
                  <Textarea
                     label="Dirección"
                     placeholder="Ej. Managua, Km 7.5 Carretera Norte"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     {...register("supplier_details.address", {
                        onChange: (evt) => trackDetailField("address", evt.target.value),
                     })}
                     error={errors.supplier_details?.address?.message}
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
