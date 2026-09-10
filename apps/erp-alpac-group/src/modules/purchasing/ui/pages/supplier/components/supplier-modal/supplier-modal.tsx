import { useEffect, useMemo, useState } from "react";
import {
   Button,
   Checkbox,
   Dropdown,
   InputText,
   Modal,
   Textarea,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { IdentificationEnum, IdentificationOptions } from "@app/core/enums/identification.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { CreatedSupplierDto, SupplierModalProps } from "./supplier-modal.types";
import { ConstitutionEnum, ConstitutionOptions } from "@app/core/enums/constitution.enum";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import {
   formatIdentificationNumber,
   formatPhone,
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
import { PaymentMethodOptions } from "@app/core/enums/payment-method.enum";
import { BankAccountList } from "../bank-account-list/bank-account-list";
import type {
   CreateSupplierBankAccountPayload,
   SupplierBankAccount
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import {inputClassName, labelClassName, dropdownClassName} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

const currencyOptions = [
   { value: "USD", label: "Dólares ($)" },
   { value: "NIO", label: "Córdobas (C$)" },
];

const constitutionEnumMap = new Map<string, number>([
   [ConstitutionEnum.Legal.stringValue, ConstitutionEnum.Legal.value],
   [ConstitutionEnum.Natural.stringValue, ConstitutionEnum.Natural.value],
]);

const identificationEnumMap = new Map<string, number>([
   [IdentificationEnum.RUC.stringValue, IdentificationEnum.RUC.value],
   [IdentificationEnum.NATIONAL_ID.stringValue, IdentificationEnum.NATIONAL_ID.value],
   [IdentificationEnum.PASSPORT.stringValue, IdentificationEnum.PASSPORT.value],
   [IdentificationEnum.RESIDENCE_ID.stringValue, IdentificationEnum.RESIDENCE_ID.value],
]);

const resolveConstitutionType = (value?: string | number | null): number => {
   if (typeof value === "number") return value;
   if (!value) return 0;
   return constitutionEnumMap.get(value) ?? 0;
};

const getIdentificationTypeByConstitution = (constitutionType?: number): number => {
   if (constitutionType === ConstitutionEnum.Legal.value) return IdentificationEnum.RUC.value;
   if (constitutionType === ConstitutionEnum.Natural.value) return IdentificationEnum.NATIONAL_ID.value;
   return 0;
};

const resolveIdentificationType = (
   identificationType?: string | number | null,
   constitutionType?: string | number | null,
): number => {
   if (typeof identificationType === "number") return identificationType;
   const constStr = typeof constitutionType === "string" ? constitutionType : "";

   if (
      ConstitutionEnum.Legal.stringValue === constStr &&
      IdentificationEnum.NATIONAL_ID.stringValue === identificationType
   ) {
      return IdentificationEnum.RUC.value;
   }

   if (identificationType) {
      const mapped = identificationEnumMap.get(identificationType);
      if (isValidateValue(mapped)) return mapped!;
   }

   return getIdentificationTypeByConstitution(resolveConstitutionType(constitutionType));
};

const hasConstitutionData = (constitutionType?: number | string) => {
   const val = Number(constitutionType);
   return val === ConstitutionEnum.Natural.value || val === ConstitutionEnum.Legal.value;
};

const emptyFormValues: Partial<CreateSupplierRequest> = {
   suppliers_legal_name: "",
   commercial_name: "",
   constitution_type: 0,
   identification_type: undefined,
   identification_number: "",
   supplier_details: {
      credit_days: 0,
      has_credit: false,
      is_exclusive: false,
      exclusive_brands_or_parts: "",
      credit_limit: null,
      credit_currency: "USD",
      alert_days_before_due: 5,
      preferred_payment_method: "ACH",
      apply_ir_retention: false,
      apply_municipal_retention: false,
      is_tax_exempt: false,
      contact_name: "",
      contact_phone_number: "",
      contact_email: "",
      email_support: "",
      address: "",
   },
   bank_accounts: [],
};

type TabType = "general" | "commercial" | "bank_accounts";

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
   const [activeTab, setActiveTab] = useState<TabType>("general");
   const [localBankAccounts, setLocalBankAccounts] = useState<CreateSupplierBankAccountPayload[]>([]);

   const {
      CreateSupplier,
      UpdateSupplier,
      GetSupplierDetails,
      CreateBankAccount,
      UpdateBankAccount,
      DeleteBankAccount,
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
         suppliers_legal_name: supplierDetails.suppliers_legal_name ?? supplierDetails.supplier_legal_name,
         commercial_name: supplierDetails.commercial_name ?? undefined,
         supplier_details: {
            address: details?.address ?? undefined,
            email_support: details?.email_support ?? undefined,
            contact_name: details?.contact_name ?? undefined,
            contact_email: details?.contact_email ?? undefined,
            contact_phone_number: details?.contact_phone_number ?? undefined,
            credit_days: details?.credit_days ?? 0,
            has_credit: Boolean(details?.has_credit),
            is_exclusive: Boolean(details?.is_exclusive),
            exclusive_brands_or_parts: details?.exclusive_brands_or_parts ?? undefined,
            credit_limit: details?.credit_limit ?? null,
            credit_currency: details?.credit_currency ?? "USD",
            alert_days_before_due: details?.alert_days_before_due ?? 5,
            preferred_payment_method: details?.preferred_payment_method ?? "ACH",
            apply_ir_retention: Boolean(details?.apply_ir_retention),
            apply_municipal_retention: Boolean(details?.apply_municipal_retention),
            is_tax_exempt: Boolean(details?.is_tax_exempt),
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
   const isExclusive = watch("supplier_details.is_exclusive");

   const isLegalPerson = Number(constitutionType) === ConstitutionEnum.Legal.value;
   const isNaturalPerson = Number(constitutionType) === ConstitutionEnum.Natural.value;
   const hasIdentificationType = isValidateValue(identificationType);

   const filteredIdentificationTypes = useMemo(() => {
      if (isLegalPerson) {
         return IdentificationOptions.filter(
            (item) => item.value === IdentificationEnum.RUC.value,
         );
      }
      if (isNaturalPerson) {
         return IdentificationOptions.filter(
            (item) => item.value !== IdentificationEnum.RUC.value,
         );
      }
      return IdentificationOptions;
   }, [isLegalPerson, isNaturalPerson]);

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

   const trackMultipleDetailFields = (
      changes: Partial<SupplierDetailsInformation>,
   ) => {
      if (!isEditMode) return;

      const initial = trackerInitial.supplier_details ?? {};
      const current = { ...(updateData.supplier_details ?? {}) };

      (Object.keys(changes) as (keyof SupplierDetailsInformation)[]).forEach(
         (key) => {
            const val = changes[key];
            if (initial[key] === val) {
               delete current[key];
            } else {
               current[key] = val as never;
            }
         },
      );

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
      setLocalBankAccounts([]);
      setActiveTab("general");
      onClose();
   };

   // Bank account handlers for creation mode
   const handleAddLocalAccount = (acc: CreateSupplierBankAccountPayload) => {
      setLocalBankAccounts((prev) => {
         if (acc.is_primary) {
            return [...prev.map((item) => ({ ...item, is_primary: false })), acc];
         }
         if (prev.length === 0) {
            return [{ ...acc, is_primary: true }];
         }
         return [...prev, acc];
      });
   };

   const handleEditLocalAccount = (
      acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
      index: number,
   ) => {
      setLocalBankAccounts((prev) => {
         const next = [...prev];
         if (acc.is_primary) {
            next.forEach((item, i) => {
               if (i !== index) item.is_primary = false;
            });
         }
         next[index] = acc;
         return next;
      });
   };

   const handleDeleteLocalAccount = (
      _acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
      index: number,
   ) => {
      setLocalBankAccounts((prev) => {
         const wasPrimary = prev[index]?.is_primary;
         const filtered = prev.filter((_, i) => i !== index);
         if (wasPrimary && filtered.length > 0) {
            filtered[0].is_primary = true;
         }
         return filtered;
      });
   };

   const handleSetPrimaryLocalAccount = (
      _acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
      index: number,
   ) => {
      setLocalBankAccounts((prev) =>
         prev.map((item, i) => ({
            ...item,
            is_primary: i === index,
         })),
      );
   };

   // Bank account handlers for edit mode (via API)
   const handleAddApiAccount = (acc: CreateSupplierBankAccountPayload) => {
      if (!selectedSupplier?.supplier_id) return;
      CreateBankAccount.mutate(
         {
            companyId,
            moduleCode,
            supplierId: selectedSupplier.supplier_id,
            payload: acc,
         },
         {
            onSuccess: () => {
               onRequestSuccess?.("Cuenta bancaria agregada exitosamente.");
            },
            onError: (err) => {
               const mapped = getMappedError(err);
               onRequestError?.(mapped.description);
            },
         },
      );
   };

   const handleEditApiAccount = (
      acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
   ) => {
      const bankAccountId = (acc as SupplierBankAccount).id;
      if (!selectedSupplier?.supplier_id || !bankAccountId) return;
      const payloadData = { ...(acc as SupplierBankAccount) };
      delete (payloadData as { id?: string }).id;
      UpdateBankAccount.mutate(
         {
            companyId,
            moduleCode,
            supplierId: selectedSupplier.supplier_id,
            bankAccountId,
            payload: payloadData,
         },
         {
            onSuccess: () => {
               onRequestSuccess?.("Cuenta bancaria actualizada exitosamente.");
            },
            onError: (err) => {
               const mapped = getMappedError(err);
               onRequestError?.(mapped.description);
            },
         },
      );
   };

   const handleSetPrimaryApiAccount = (
      acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
   ) => {
      const bankAccountId = (acc as SupplierBankAccount).id;
      if (!selectedSupplier?.supplier_id || !bankAccountId) return;
      UpdateBankAccount.mutate(
         {
            companyId,
            moduleCode,
            supplierId: selectedSupplier.supplier_id,
            bankAccountId,
            payload: { is_primary: true },
         },
         {
            onSuccess: () => {
               onRequestSuccess?.("Cuenta bancaria marcada como principal.");
            },
            onError: (err) => {
               const mapped = getMappedError(err);
               onRequestError?.(mapped.description);
            },
         },
      );
   };

   const handleDeleteApiAccount = (
      acc: CreateSupplierBankAccountPayload | SupplierBankAccount,
   ) => {
      const bankAccountId = (acc as SupplierBankAccount).id;
      if (!selectedSupplier?.supplier_id || !bankAccountId) return;
      DeleteBankAccount.mutate(
         {
            companyId,
            moduleCode,
            supplierId: selectedSupplier.supplier_id,
            bankAccountId,
         },
         {
            onSuccess: () => {
               onRequestSuccess?.("Cuenta bancaria eliminada exitosamente.");
            },
            onError: (err) => {
               const mapped = getMappedError(err);
               onRequestError?.(mapped.description);
            },
         },
      );
   };

   const buildCreatePayload = (data: CreateSupplierRequest): CreateSupplierRequest => {
      const {
         constitution_type,
         identification_type,
         identification_number,
         supplier_details,
         ...rest
      } = data;

      const hasCreditVal = Boolean(supplier_details?.has_credit);
      const isExclusiveVal = Boolean(supplier_details?.is_exclusive);

      const payload: CreateSupplierRequest = {
         ...rest,
         company_id: companyId,
         module_code: moduleCode,
         commercial_name: data.commercial_name?.trim() || null,
         supplier_details: {
            ...supplier_details,
            has_credit: hasCreditVal,
            credit_days: hasCreditVal ? Number(supplier_details?.credit_days) || 0 : 0,
            credit_limit: hasCreditVal && supplier_details?.credit_limit != null
               ? Number(supplier_details.credit_limit)
               : null,
            credit_currency: hasCreditVal ? supplier_details?.credit_currency || "USD" : null,
            alert_days_before_due: hasCreditVal
               ? Number(supplier_details?.alert_days_before_due) || 0
               : 0,
            is_exclusive: isExclusiveVal,
            exclusive_brands_or_parts: isExclusiveVal
               ? supplier_details?.exclusive_brands_or_parts?.trim() || null
               : null,
            preferred_payment_method: supplier_details?.preferred_payment_method || "ACH",
            apply_ir_retention: Boolean(supplier_details?.apply_ir_retention),
            apply_municipal_retention: Boolean(supplier_details?.apply_municipal_retention),
            is_tax_exempt: Boolean(supplier_details?.is_tax_exempt),
         },
         bank_accounts: localBankAccounts.length > 0 ? localBankAccounts : undefined,
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

      delete payload.constitution_type;
      delete payload.identification_type;
      delete payload.identification_number;

      return payload;
   };

   const handleCreateSupplier = (data: CreateSupplierRequest) => {
      const payload = buildCreatePayload(data);

      CreateSupplier.mutate(payload, {
         onSuccess(supplier) {
            const createdSupplier: CreatedSupplierDto = {
               data: supplier,
               supplier_name: payload.suppliers_legal_name,
            };

            onRequestSuccess?.("Proveedor registrado exitosamente.");
            handleClose();
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

      const hasChanges = Object.keys(payload).some(
         (key) => !["company_id", "module_code", "supplier_id"].includes(key),
      );

      if (!hasChanges) {
         onRequestSuccess?.("No se detectaron cambios para actualizar.");
         handleClose();
         return;
      }

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
         setLocalBankAccounts([]);
         setActiveTab("general");
         return;
      }

      if (!selectedSupplier) {
         reset(emptyFormValues);
         resetFieldTracker();
         setLocalBankAccounts([]);
         setActiveTab("general");
         return;
      }

      if (!supplierDetails) return;

      const constitutionTypeValue = resolveConstitutionType(supplierDetails.constitution_type);
      const hasConstitution = hasConstitutionData(constitutionTypeValue);
      const identificationTypeValue = resolveIdentificationType(
         supplierDetails.identification_type,
         supplierDetails.constitution_type,
      );

      const identificationNumber = hasConstitution
         ? String(supplierDetails.identification_number ?? "")
            .replace(/-/g, "")
            .toUpperCase()
         : "";

      const details = supplierDetails.supplier_details;

      reset({
         suppliers_legal_name:
            supplierDetails.suppliers_legal_name ?? supplierDetails.supplier_legal_name ?? "",
         commercial_name: supplierDetails.commercial_name ?? "",
         constitution_type: constitutionTypeValue,
         identification_type: identificationTypeValue,
         identification_number: identificationNumber,
         supplier_details: {
            credit_days: details?.credit_days ?? 0,
            has_credit: Boolean(details?.has_credit),
            is_exclusive: Boolean(details?.is_exclusive),
            exclusive_brands_or_parts: details?.exclusive_brands_or_parts ?? "",
            credit_limit: details?.credit_limit ?? null,
            credit_currency: details?.credit_currency ?? "USD",
            alert_days_before_due: details?.alert_days_before_due ?? 5,
            preferred_payment_method: details?.preferred_payment_method ?? "ACH",
            apply_ir_retention: Boolean(details?.apply_ir_retention),
            apply_municipal_retention: Boolean(details?.apply_municipal_retention),
            is_tax_exempt: Boolean(details?.is_tax_exempt),
            contact_name: details?.contact_name ?? "",
            contact_phone_number: details?.contact_phone_number ? formatPhone(details.contact_phone_number) : "",
            contact_email: details?.contact_email ?? "",
            email_support: details?.email_support ?? "",
            address: details?.address ?? "",
         },
      });
      resetFieldTracker();
   }, [isOpen, selectedSupplier, supplierDetails, reset, resetFieldTracker]);

   const currentBankAccounts = isEditMode
      ? supplierDetails?.bank_accounts ?? []
      : localBankAccounts;

   const isSubmitting = CreateSupplier.isPending || UpdateSupplier.isPending;

   const hasGeneralErrors = Boolean(
      errors.suppliers_legal_name ||
      errors.constitution_type ||
      errors.identification_type ||
      errors.identification_number ||
      errors.supplier_details?.contact_email ||
      errors.supplier_details?.email_support ||
      errors.supplier_details?.contact_phone_number,
   );

   const hasCommercialErrors = Boolean(
      errors.supplier_details?.credit_days ||
      errors.supplier_details?.credit_limit,
   );

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         title={isEditMode ? "Actualizar proveedor" : "Registro de nuevo proveedor"}
         variant="form"
         size="5xl"
         description={
            isEditMode
               ? "Modifique la información general, financiera y cuentas bancarias del proveedor"
               : "Complete los datos del proveedor y configure sus cuentas bancarias"
         }
      >
         {isEditMode && isSupplierDetailsPending && (
            <Loader title="Cargando detalle del proveedor..." />
         )}

         {/* Navigation tabs */}
         <div className="flex border-b border-slate-200 dark:border-neutral-700 mb-6 gap-2">
            <button
               type="button"
               onClick={() => setActiveTab("general")}
               className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === "general"
                     ? "border-alpac-primary-500 text-alpac-primary-500 font-semibold"
                     : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
               }`}
            >
               <span>Datos Generales</span>
               {hasGeneralErrors && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
               )}
            </button>

            <button
               type="button"
               onClick={() => setActiveTab("commercial")}
               className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === "commercial"
                     ? "border-alpac-primary-500 text-alpac-primary-500 font-semibold"
                     : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
               }`}
            >
               <span>Condiciones y Régimen Fiscal</span>
               {hasCommercialErrors && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
               )}
            </button>

            <button
               type="button"
               onClick={() => setActiveTab("bank_accounts")}
               className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === "bank_accounts"
                     ? "border-alpac-primary-500 text-alpac-primary-500 font-semibold"
                     : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
               }`}
            >
               <span>Cuentas Bancarias</span>
               <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-slate-300">
                  {currentBankAccounts.length}
               </span>
            </button>
         </div>

         <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(handleSupplier)}
         >
            {/* TAB 1: GENERAL & CONTACT */}
            <div className={activeTab === "general" ? "flex flex-col gap-6" : "hidden"}>
               <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
                     Identificación Legal y Comercial
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                     <InputText
                        label="Nombre comercial (opcional)"
                        placeholder="Ej. DIMAC Nicaragua"
                        className={inputClassName}
                        labelClassName={labelClassName}
                        {...register("commercial_name", {
                           onChange: (evt) => {
                              trackField("commercial_name", evt.target.value || null);
                           },
                        })}
                     />

                     <Controller
                        control={control}
                        name="constitution_type"
                        rules={{
                           required: true,
                           validate: (val) => val !== 0 || "Tipo de constitución es requerido",
                        }}
                        render={({ field }) => (
                           <Dropdown
                              label="Tipo de constitución"
                              placeholder="Seleccione..."
                              isRequired
                              disabled={isEditMode}
                              options={ConstitutionOptions}
                              value={field.value}
                              onChange={(value) => {
                                 if (isEditMode) return;
                                 const nextType = Number(value);
                                 const nextIdentificationType =
                                    getIdentificationTypeByConstitution(nextType);

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
                              disabled={isEditMode || !hasConstitutionData(constitutionType)}
                              options={filteredIdentificationTypes}
                              value={field.value}
                              onChange={(value) => {
                                 if (isEditMode) return;
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

                     <div className="md:col-span-2">
                        <InputText
                           label="Número de identificación"
                           placeholder={
                              isLegalPerson
                                 ? "Ej. J0310000045678"
                                 : identificationType === IdentificationEnum.PASSPORT.value
                                    ? "Ej. A1234567"
                                    : "Ej. 001-150885-0012X"
                           }
                           isRequired
                           className={inputClassName}
                           labelClassName={labelClassName}
                           disabled={isEditMode || !hasConstitutionData(constitutionType) || !hasIdentificationType}
                           {...register("identification_number", {
                              setValueAs: (value: string) =>
                                 value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                              validate: {
                                 required: (value?: string | null) =>
                                    Boolean(value?.trim()) || "El número de identificación es requerido",
                                 validIdentification: (value?: string | null) => {
                                    if (!value?.trim()) return true;

                                    if (isNaturalPerson) {
                                       return validateIdentificationNumber(
                                          value,
                                          Number(identificationType) || IdentificationEnum.NATIONAL_ID.value,
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
                                 } else if (
                                    isNaturalPerson &&
                                    identificationType === IdentificationEnum.NATIONAL_ID.value
                                 ) {
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
                     </div>
                  </div>
               </div>

               <div className="border-t border-slate-200 dark:border-neutral-700 pt-4">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
                     Información de Contacto
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <InputText
                        label="Nombre de contacto"
                        placeholder="Ej. Carlos Mendoza"
                        className={inputClassName}
                        labelClassName={labelClassName}
                        {...register("supplier_details.contact_name", {
                           onChange: (evt) => trackDetailField("contact_name", evt.target.value),
                        })}
                        error={errors.supplier_details?.contact_name?.message}
                     />

                     <InputText
                        label="Teléfono de contacto"
                        placeholder="Ej. 8888-8888"
                        type="tel"
                        className={inputClassName}
                        labelClassName={labelClassName}
                        {...register("supplier_details.contact_phone_number", {
                           onChange: (evt) => {
                              evt.target.value = formatPhone(evt.target.value);
                              trackDetailField("contact_phone_number", evt.target.value);
                           },
                           validate: (value) => !value || validateNicaraguaPhone(value),
                        })}
                        error={errors.supplier_details?.contact_phone_number?.message}
                     />

                     <InputText
                        label="Correo de contacto"
                        placeholder="Ej. ventas@proveedor.com"
                        type="email"
                        className={inputClassName}
                        labelClassName={labelClassName}
                        {...register("supplier_details.contact_email", {
                           setValueAs: (value: string) => value?.trim(),
                           validate: {
                              validEmail: (value?: string | null) => validateEmail(value ?? undefined),
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
                           setValueAs: (value: string) => value?.trim(),
                           validate: {
                              validEmail: (value?: string | null) => validateEmail(value ?? undefined),
                           },
                           onChange: (evt) =>
                              trackDetailField("email_support", evt.target.value?.trim()),
                        })}
                        error={errors.supplier_details?.email_support?.message}
                     />

                     <div className="md:col-span-2">
                        <Textarea
                           label="Dirección física"
                           placeholder="Ej. Km 6.5 Carretera Norte, frente a Enatrel, Managua"
                           className={inputClassName}
                           labelClassName={labelClassName}
                           {...register("supplier_details.address", {
                              onChange: (evt) => trackDetailField("address", evt.target.value),
                           })}
                           error={errors.supplier_details?.address?.message}
                           maxLength={500}
                           style={{
                              resize: "none",
                              height: "90px",
                           }}
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* TAB 2: COMMERCIAL & TAX CONDITIONS */}
            <div className={activeTab === "commercial" ? "flex flex-col gap-6" : "hidden"}>
               {/* Financial and credit conditions */}
               <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
                     Condiciones Comerciales y de Crédito
                  </h4>

                  <div className="flex flex-col gap-4">
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Controller
                           control={control}
                           name="supplier_details.preferred_payment_method"
                           render={({ field }) => (
                              <Dropdown
                                 label="Método de pago preferido"
                                 placeholder="Seleccione..."
                                 options={PaymentMethodOptions}
                                 value={field.value}
                                 onChange={(val) => {
                                    field.onChange(val);
                                    trackDetailField("preferred_payment_method", val as string);
                                 }}
                                 appearance="dark"
                                 className={dropdownClassName}
                                 labelClassName={labelClassName}
                                 valueClassName="text-black! dark:text-white!"
                              />
                           )}
                        />

                        <div className="flex items-center pt-6">
                           <Controller
                              control={control}
                              name="supplier_details.has_credit"
                              render={({ field }) => (
                                 <Checkbox
                                    label="¿Ofrece línea de crédito?"
                                    checked={Boolean(field.value)}
                                    onChange={(e) => {
                                       const checked = e.target.checked;
                                       field.onChange(checked);
                                       if (!checked) {
                                          setValue("supplier_details.credit_days", 0);
                                          setValue("supplier_details.credit_limit", null);
                                          trackMultipleDetailFields({
                                             has_credit: false,
                                             credit_days: 0,
                                             credit_limit: null,
                                          });
                                       } else {
                                          trackDetailField("has_credit", true);
                                       }
                                    }}
                                 />
                              )}
                           />
                        </div>
                     </div>

                     {hasCredit && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-lg border border-slate-200 dark:border-neutral-700 p-4 bg-slate-50/50 dark:bg-neutral-800/30">
                           <InputText
                              label="Días de crédito"
                              type="number"
                              min="1"
                              placeholder="30"
                              isRequired
                              className={inputClassName}
                              labelClassName={labelClassName}
                              {...register("supplier_details.credit_days", {
                                 setValueAs: (val) => Number(val) || 0,
                                 validate: (val) =>
                                    !hasCredit || (Number(val) > 0 || "Debe ingresar al menos 1 día de crédito"),
                                 onChange: (evt) =>
                                    trackDetailField("credit_days", Number(evt.target.value) || 0),
                              })}
                              error={errors.supplier_details?.credit_days?.message}
                           />

                           <InputText
                              label="Límite de crédito (monto)"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="50000.00"
                              className={inputClassName}
                              labelClassName={labelClassName}
                              {...register("supplier_details.credit_limit", {
                                 setValueAs: (val) => (val === "" ? null : Number(val)),
                                 onChange: (evt) =>
                                    trackDetailField(
                                       "credit_limit",
                                       evt.target.value === "" ? null : Number(evt.target.value),
                                    ),
                              })}
                           />

                           <Controller
                              control={control}
                              name="supplier_details.credit_currency"
                              render={({ field }) => (
                                 <Dropdown
                                    label="Moneda del crédito"
                                    options={currencyOptions}
                                    value={field.value ?? "USD"}
                                    onChange={(val) => {
                                       field.onChange(val);
                                       trackDetailField("credit_currency", val as string);
                                    }}
                                    appearance="dark"
                                    className={dropdownClassName}
                                    labelClassName={labelClassName}
                                    valueClassName="text-black! dark:text-white!"
                                 />
                              )}
                           />

                           <div className="md:col-span-3">
                              <InputText
                                 label="Alerta de vencimiento (días antes)"
                                 type="number"
                                 min="0"
                                 placeholder="5"
                                 className={inputClassName}
                                 labelClassName={labelClassName}
                                 {...register("supplier_details.alert_days_before_due", {
                                    setValueAs: (val) => Number(val) || 0,
                                    onChange: (evt) =>
                                       trackDetailField(
                                          "alert_days_before_due",
                                          Number(evt.target.value) || 0,
                                       ),
                                 })}
                              />
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Tax and retentions */}
               <div className="border-t border-slate-200 dark:border-neutral-700 pt-4">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
                     Régimen Fiscal y Retenciones
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                     <Controller
                        control={control}
                        name="supplier_details.apply_ir_retention"
                        render={({ field }) => (
                           <Checkbox
                              label="Aplica retención IR"
                              checked={Boolean(field.value)}
                              onChange={(e) => {
                                 field.onChange(e.target.checked);
                                 trackDetailField("apply_ir_retention", e.target.checked);
                              }}
                           />
                        )}
                     />

                     <Controller
                        control={control}
                        name="supplier_details.apply_municipal_retention"
                        render={({ field }) => (
                           <Checkbox
                              label="Aplica retención Municipal (IMI)"
                              checked={Boolean(field.value)}
                              onChange={(e) => {
                                 field.onChange(e.target.checked);
                                 trackDetailField("apply_municipal_retention", e.target.checked);
                              }}
                           />
                        )}
                     />

                     <Controller
                        control={control}
                        name="supplier_details.is_tax_exempt"
                        render={({ field }) => (
                           <Checkbox
                              label="Exento de impuestos (Exonerado)"
                              checked={Boolean(field.value)}
                              onChange={(e) => {
                                 field.onChange(e.target.checked);
                                 trackDetailField("is_tax_exempt", e.target.checked);
                              }}
                           />
                        )}
                     />
                  </div>
               </div>

               {/* Exclusivity */}
               <div className="border-t border-slate-200 dark:border-neutral-700 pt-4">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
                     Distribución y Exclusividad
                  </h4>
                  <div className="flex flex-col gap-4">
                     <Controller
                        control={control}
                        name="supplier_details.is_exclusive"
                        render={({ field }) => (
                           <Checkbox
                              label="Es distribuidor o proveedor exclusivo"
                              checked={Boolean(field.value)}
                                    onChange={(e) => {
                                       const checked = e.target.checked;
                                       field.onChange(checked);
                                       if (!checked) {
                                          setValue("supplier_details.exclusive_brands_or_parts", null);
                                          trackMultipleDetailFields({
                                             is_exclusive: false,
                                             exclusive_brands_or_parts: null,
                                          });
                                       } else {
                                          trackDetailField("is_exclusive", true);
                                       }
                                    }}
                           />
                        )}
                     />

                     {isExclusive && (
                        <Textarea
                           label="Marcas o partes autorizadas en exclusiva"
                           placeholder="Ej. Distribuidor autorizado Caterpillar, Donaldson y Timken"
                           className={inputClassName}
                           labelClassName={labelClassName}
                           {...register("supplier_details.exclusive_brands_or_parts", {
                              onChange: (evt) =>
                                 trackDetailField("exclusive_brands_or_parts", evt.target.value),
                           })}
                           maxLength={500}
                           style={{
                              resize: "none",
                              height: "80px",
                           }}
                        />
                     )}
                  </div>
               </div>
            </div>

            {/* TAB 3: BANK ACCOUNTS */}
            <div className={activeTab === "bank_accounts" ? "flex flex-col gap-4" : "hidden"}>
               <BankAccountList
                  accounts={currentBankAccounts}
                  onAddAccount={isEditMode ? handleAddApiAccount : handleAddLocalAccount}
                  onEditAccount={isEditMode ? handleEditApiAccount : handleEditLocalAccount}
                  onSetPrimary={isEditMode ? handleSetPrimaryApiAccount : handleSetPrimaryLocalAccount}
                  onDeleteAccount={isEditMode ? handleDeleteApiAccount : handleDeleteLocalAccount}
                  isLoading={
                     CreateBankAccount.isPending ||
                     UpdateBankAccount.isPending ||
                     DeleteBankAccount.isPending
                  }
               />
            </div>

            {/* Modal action buttons */}
            <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 pt-4" />

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
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
               />
            </div>
         </form>
      </Modal>
   );
};
