import { useImperativeHandle, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Chips, ContextMenu, Dropdown, RadioButton, Textarea } from "@alpac/design-system";
import { PurchaseRequestDetail } from "../purchase-request-detail/purchase-request-detail";
import { SelectServiceOrderModal } from "../select-service-order-modal/select-service-order-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { PriorityLevelEnum, PriorityLevelOptions } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import {
   PurchaseRequestDestinationEnum,
   type PurchaseRequestDestinationType,
} from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";
import type { PurchaseRequestFormBlockProps } from "./purchase-request-form-block.types";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const filteredPriorityOptions = PriorityLevelOptions.filter(
   (priority) => PriorityLevelEnum.None.textValue !== priority.textValue,
);

const originFromDestination = (
   destination: number,
): PurchaseRequestDestinationType =>
   destination === PurchaseRequestDestinationEnum.ServiceOrder.value
      ? "ServiceOrder"
      : "Internal";

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

   const methods = useForm<CreatePurchaseRequestPayload>({
      defaultValues: defaults,
      mode: "onSubmit",
   });

   const {
      control,
      setValue,
      formState: { errors },
   } = methods;

   const [selectedOrigen, setSelectedOrigin] = useState<PurchaseRequestDestinationType>(originFromDestination(defaults.destination));
   const [selectedServiceOrder, setSelectedServiceOrder] = useState<GetServiceOrdersResponse | null>(null);
   const [isSelectServiceOrderModalOpen, setIsSelectServiceOrderModalOpen] = useState(false);
   const didConfirmServiceOrderRef = useRef(false);

   const priorityLevelId = methods.watch("priority_level");
   const observations = methods.watch("observations");
   const hasPrioritySelected = Number(priorityLevelId) > 0;

   const isDisabledActions = Boolean(
      (isRequisition && !hasPrioritySelected) ||
      !observations?.trim() ||
      (selectedOrigen === "ServiceOrder" && !selectedServiceOrder),
   );

   useImperativeHandle(ref, () => ({
      validate: () => methods.trigger(),
      getValues: () => {
         const values = methods.getValues();
         const dirtyItems = methods.formState.dirtyFields.purchase_request_items;

         return {
            ...values,
            destination: PurchaseRequestDestinationEnum[selectedOrigen].value,
            ...(selectedOrigen === "ServiceOrder" &&
               selectedServiceOrder?.service_order_id
               ? { service_order_id: selectedServiceOrder.service_order_id }
               : {}),
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

   const handleOriginChange = (origin: PurchaseRequestDestinationType) => {
      setSelectedOrigin(origin);
      setValue("destination", PurchaseRequestDestinationEnum[origin].value);
      if (origin !== "ServiceOrder") {
         setSelectedServiceOrder(null);
      }
   };

   const handleDuplicate = () => {
      onDuplicate({
         ...methods.getValues(),
         destination: PurchaseRequestDestinationEnum[selectedOrigen].value,
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
                                 Number(value) > 0 || "El nivel de prioridad es requerida",
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

                  <div className="flex min-w-0 w-full flex-col gap-3 md:col-span-2">
                     {isRequisition &&
                        <>
                           <span className="text-[15px] text-black dark:text-white">
                              Asociar a:
                           </span>

                           <div className="flex min-h-12 min-w-0 w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">

                              <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
                                 <RadioButton
                                    id={`suppliesRadiusButton-${index}`}
                                    value={PurchaseRequestDestinationEnum.Internal.textValue}
                                    label={PurchaseRequestDestinationEnum.Internal.label}
                                    labelPosition="right"
                                    labelClassName={labelClassName}
                                    checked={selectedOrigen === "Internal"}
                                    onChange={() => {
                                       handleOriginChange("Internal");
                                    }}
                                 />

                                 <RadioButton
                                    id={`serviceOrderRadiusButton-${index}`}
                                    value={PurchaseRequestDestinationEnum.ServiceOrder.textValue}
                                    label={`Orden de Servicio${(isRequisition && selectedServiceOrder) ? ":" : ""}`}
                                    labelPosition="right"
                                    labelClassName={labelClassName}
                                    checked={selectedOrigen === "ServiceOrder"}
                                    onChange={() => {
                                       handleOriginChange("ServiceOrder");
                                       setIsSelectServiceOrderModalOpen(true);
                                    }}
                                 />

                                 {isRequisition && selectedServiceOrder && (
                                    <div className="flex min-w-0 w-full flex-col gap-2 sm:w-auto sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                                       <Chips
                                          key={selectedServiceOrder.service_order_id}
                                          label={selectedServiceOrder.code}
                                          onClose={() => {
                                             setSelectedServiceOrder(null);
                                             setSelectedOrigin("Internal");
                                          }}
                                       />
                                    </div>
                                 )}
                              </div>
                           </div>
                        </>
                     }

                  </div>
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
                        onChange={field.onChange}
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
                  disableActions={isDisabledActions}
                  lockItems={isEditMode}
                  onRequestError={onRequestError}
                  onRequestSuccess={onRequestSuccess}
               />
            </div>

            <SelectServiceOrderModal
               selectionType="single"
               isOpen={isSelectServiceOrderModalOpen}
               onClose={() => {
                  setIsSelectServiceOrderModalOpen(false);
                  if (!didConfirmServiceOrderRef.current) {
                     handleOriginChange("Internal");
                  }
                  didConfirmServiceOrderRef.current = false;
               }}
               onSelect={(serviceOrders) => {
                  const order = serviceOrders[0] ?? null;
                  didConfirmServiceOrderRef.current = true;
                  setSelectedServiceOrder(order);
                  setSelectedOrigin("ServiceOrder");
               }}
            />
         </div>
      </FormProvider>
   );
};
