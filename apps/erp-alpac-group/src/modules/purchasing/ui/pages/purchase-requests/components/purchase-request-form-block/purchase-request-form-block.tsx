import { useImperativeHandle, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { ContextMenu, Dropdown, Textarea } from "@alpac/design-system";
import { PurchaseRequestDetail } from "../purchase-request-detail/purchase-request-detail";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PriorityLevelEnum, PriorityLevelOptions } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { PurchaseRequestFormBlockProps } from "./purchase-request-form-block.types";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const filteredPriorityOptions = PriorityLevelOptions.filter(
   (priority) => PriorityLevelEnum.None.textValue !== priority.textValue,
).map((priority) => ({
   value: priority.textValue,
   label: priority.label,
}));

export const PurchaseRequestFormBlock = ({
   index,
   defaults,
   requestType,
   isEditMode = false,
   onDuplicate,
   onRemove,
   onRequestError,
   onRequestSuccess,
   ref,
}: PurchaseRequestFormBlockProps) => {

   const { costCenterName } = useUserStore();
   const isRequisition = requestType.textValue === PurchaseRequestEnum.Requisition.textValue;
   const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

   const methods = useForm<CreatePurchaseRequestPayload>({
      defaultValues: {
         ...defaults,
         destination: PurchaseRequestDestinationEnum.Internal.textValue,
      },
      mode: "onSubmit",
      reValidateMode: "onChange",
   });

   const {
      control,
      trigger,
      formState: { errors },
   } = methods;

   const priorityLevelId = methods.watch("priority_level");
   const observations = methods.watch("observations");
   const hasPrioritySelected = Boolean(
      priorityLevelId &&
         priorityLevelId !== PriorityLevelEnum.None.textValue,
   );

   const isDisabledActions = Boolean(
      (isRequisition && !hasPrioritySelected) ||
      !observations?.trim(),
   );

   useImperativeHandle(ref, () => ({
      validate: async () => {
         setHasAttemptedSubmit(true);
         return methods.trigger();
      },
      getValues: () => {
         const values = methods.getValues();
         const dirtyItems = methods.formState.dirtyFields.purchase_request_items;

         return {
            ...values,
            destination: PurchaseRequestDestinationEnum.Internal.textValue,
            purchase_request_items: values.purchase_request_items.map((item, index) => {
               const imagesDirtyField =
                  dirtyItems?.[index]?.images?.images_product_to_changed;
               const imagesDirty =
                  Array.isArray(imagesDirtyField) &&
                  imagesDirtyField.some(Boolean);

               return {
                  ...item,
                  images: {
                     ...item.images,
                     images_product_to_changed:
                        item.images?.images_product_to_changed ?? [],
                     isDirty: imagesDirty,
                  },
               };
            }),
         };
      },
   }));

   const handleDuplicate = () => {
      onDuplicate({
         ...methods.getValues(),
         destination: PurchaseRequestDestinationEnum.Internal.textValue,
      });
   };

   return (
      <FormProvider {...methods}>
         <div className="flex flex-col gap-4">
            <div className="mb-4 flex items-center justify-between">
               <h4 className="font-medium text-black dark:text-white text-[19px]!">
                  {requestType?.label} {index + 1}
               </h4>

               {!isEditMode && (
                  <ContextMenu
                     triggerLabel="Opciones"
                     triggerClassName="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     items={[
                        {
                           label: "Duplicar",
                           onClick: handleDuplicate,
                        },
                        {
                           label: "Eliminar",
                           onClick: onRemove,
                        },
                     ]}
                  />
               )}
            </div>

            <div className="flex flex-col gap-4 pb-2">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="min-w-0">
                     <span className={`mb-1.5 block text-[15px] ${labelClassName}`}>
                        Centro de costo
                     </span>
                     <p className={`m-0 border border-slate-300 bg-white px-3 py-2.5 text-slate-800 dark:text-white ${dropdownClassName}`}>
                        {costCenterName?.trim() || "Sin centro de costo asignado"}
                     </p>
                  </div>

                  {isRequisition && (
                     <div className="min-w-0 w-full">
                        <Controller
                           name="priority_level"
                           control={control}
                           rules={{
                              required: true,
                              validate: (value) =>
                                 (Boolean(value) &&
                                    value !== PriorityLevelEnum.None.textValue) ||
                                 "El nivel de prioridad es requerida",
                           }}
                           render={({ field }) => (
                              <Dropdown
                                 label="Nivel de prioridad"
                                 isRequired
                                 appearance="dark"
                                 placeholder="Seleccione la prioridad de la solicitud"
                                 value={field.value}
                                 onChange={(value) => {
                                    field.onChange(value);
                                    if (hasAttemptedSubmit) {
                                       void trigger("priority_level");
                                    }
                                 }}
                                 options={filteredPriorityOptions}
                                 labelClassName={labelClassName}
                                 valueClassName={labelClassName}
                                 className={`${dropdownClassName} `}
                                 error={errors.priority_level?.message}
                              />
                           )}
                        />
                     </div>
                  )}
               </div>

               <Controller
                  name="observations"
                  control={control}
                  rules={{
                     required: "Las observaciones son requerida",
                     validate: (value) =>
                        value.trim().length > 0 || "Las observaciones son requerida",
                  }}
                  render={({ field }) => (
                     <Textarea
                        label="Contexto"
                        placeholder="Ej. Solicitud de material de oficina para reposición en el área de finanzas."
                        isRequired
                        className={inputClassName}
                        labelClassName={labelClassName}
                        value={field.value}
                        onChange={(event) => {
                           field.onChange(event);
                           if (hasAttemptedSubmit) {
                              void trigger("observations");
                           }
                        }}
                        error={errors.observations?.message}
                        maxLength={500}
                        enableCharacterCount
                        style={{
                           resize: "none",
                           minHeight: "100px",
                        }}
                     />
                  )}
               />

               <PurchaseRequestDetail
                  requestType={requestType}
                  disableActions={isDisabledActions}
                  isEditMode={isEditMode}
                  hasAttemptedSubmit={hasAttemptedSubmit}
                  onRequestError={onRequestError}
                  onRequestSuccess={onRequestSuccess}
               />
            </div>
         </div>
      </FormProvider>
   );
};
