import { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Chips, ContextMenu, Dropdown, RadioButton, Textarea } from "@alpac/design-system";
import { PurchaseRequestDetail } from "../purchase-request-detail/purchase-request-detail";
import { SelectServiceOrderModal } from "../select-service-order-modal/select-service-order-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { RoleEnum } from "@app/core/enums/role.enum";
import { PriorityLevelOptions } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import {
   PurchaseRequestDestinationEnum,
   type PurchaseRequestDestinationType,
} from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { CostCenters } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";
import type { PurchaseRequestFormBlockProps } from "./purchase-request-form-block.types";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const originFromDestination = (
   destination: number,
): PurchaseRequestDestinationType =>
   destination === PurchaseRequestDestinationEnum.ServiceOrder.value
      ? "ServiceOrder"
      : "Internal";

export const PurchaseRequestFormBlock = ({
   index,
   defaults,
   role,
   requestType,
   onDuplicate,
   onRemove,
   onRequestError,
   onRequestSuccess,
   ref,
}: PurchaseRequestFormBlockProps) => {

   const { companyId, areaId } = useUserStore();
   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const isRequisition = requestType.textValue === PurchaseRequestEnum.Requisition.textValue;
   const isEventual = requestType.textValue === PurchaseRequestEnum.Eventual.textValue;

   const methods = useForm<CreatePurchaseRequestPayload>({
      defaultValues: defaults,
      mode: "onSubmit",
   });

   const {
      control,
      setValue,
      formState: { errors },
   } = methods;

   const [costCenters, setCostCenters] = useState<CostCenters[]>([]);
   const [selectedOrigen, setSelectedOrigin] = useState<PurchaseRequestDestinationType>(originFromDestination(defaults.destination));
   const [selectedServiceOrder, setSelectedServiceOrder] = useState<GetServiceOrdersResponse | null>(null);
   const [isSelectServiceOrderModalOpen, setIsSelectServiceOrderModalOpen] = useState(false);
   const didConfirmServiceOrderRef = useRef(false);
   const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null);

   const { GetAreasByCompany } = useAreas({ company_id: companyId });

   const { GetCostCenters } = useCostCenters({
      company_id: companyId,
      area_id: areaId
   });

   const areaOptions = useMemo(() => {
      const areas = GetAreasByCompany.data ?? [];
      return areas.map((area) => ({
         label: area.work_area_name,
         value: area.work_area_id,
         cost_centers: area.cost_centers,
      }));
   }, [GetAreasByCompany.data]);

   const selectedAreaId = methods.watch("area_id");

   const priorityLevelId = methods.watch("priority_level");
   const observations = methods.watch("observations");
   const hasPrioritySelected = Number(priorityLevelId) > 0;

   const isDisabledActions = Boolean(
      (isAdministrator && !selectedAreaId?.trim()) ||
      (isRequisition && !hasPrioritySelected) ||
      !observations?.trim() ||
      (selectedOrigen === "ServiceOrder" && !selectedServiceOrder),
   );

   const costCenterOptions = useMemo(
      () => {

         if (!isAdministrator) {

            if (!GetCostCenters?.data) return [];

            return GetCostCenters?.data?.map(item => ({
               label: item.cost_center_name,
               value: item.cost_center_id
            }));
         }

         return costCenters.map((center) => ({
            label: center.cost_center_name,
            value: center.cost_center_id,
         }))
      },
      [costCenters, GetCostCenters.data]
   );

   useEffect(() => {
      const area = areaOptions.find((item) => item.value === defaults.area_id);
      setCostCenters(area?.cost_centers ?? []);
   }, [areaOptions, defaults.area_id]);

   useImperativeHandle(ref, () => ({
      validate: () => methods.trigger(),
      getValues: () => ({
         ...methods.getValues(),
         destination: PurchaseRequestDestinationEnum[selectedOrigen].value,
         ...(selectedOrigen === "ServiceOrder" &&
            selectedServiceOrder?.service_order_id
            ? { service_order_id: selectedServiceOrder.service_order_id }
            : {}),
      }),
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
            </div>

            <div className="flex flex-col gap-4 pb-2">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {isAdministrator && (
                     <div className="min-w-0">
                        <Controller
                           name="area_id"
                           control={control}
                           rules={{
                              required: "El área es requerida",
                           }}
                           render={({ field }) => (
                              <Dropdown
                                 label="Área de trabajo"
                                 isRequired
                                 appearance="dark"
                                 placeholder="Seleccione una de las áreas de la empresa"
                                 value={field.value}
                                 onChange={(value) => {
                                    const [filteredAreas] = areaOptions.filter(
                                       (area) => area.value === value,
                                    );
                                    const filteredCostCenters = filteredAreas?.cost_centers;
                                    setCostCenters(filteredCostCenters ?? []);
                                    field.onChange(value);
                                 }}
                                 options={areaOptions}
                                 labelClassName={labelClassName}
                                 valueClassName={labelClassName}
                                 className={`${dropdownClassName} `}
                                 error={errors.area_id?.message}
                              />
                           )}
                        />
                     </div>
                  )}

                  <div className="min-w-0">
                     <Dropdown
                        label="Centro de costo"
                        isRequired
                        appearance="dark"
                        placeholder="Seleccione un centro de costo"
                        value={selectedCostCenter}
                        onChange={(value) => setSelectedCostCenter(value)}
                        options={costCenterOptions ?? []}
                        labelClassName={labelClassName}
                        valueClassName={labelClassName}
                        className={`${dropdownClassName}`}
                     />
                  </div>

                  {isRequisition && (
                     <div className="min-w-0 w-full">
                        <Controller
                           name="priority_level"
                           control={control}
                           rules={{
                              required: isRequisition
                                 ? "El nivel de prioridad es requerida"
                                 : false,
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
                                 options={PriorityLevelOptions ?? []}
                                 labelClassName={labelClassName}
                                 valueClassName={labelClassName}
                                 className={`${dropdownClassName} `}
                                 error={errors.priority_level?.message}
                              />
                           )}
                        />
                     </div>
                  )}

                  <div
                     className={
                        isEventual || !isAdministrator
                           ? "flex min-w-0 w-full flex-col gap-3 md:col-span-2"
                           : "flex min-w-0 w-full flex-col gap-3"
                     }
                  >
                     {isRequisition &&
                        <>
                           <span className="text-[15px] text-black dark:text-white">
                              Asociar a:
                           </span>

                           <div className={
                              isEventual
                                 ? "flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                                 : "flex min-h-12 min-w-0 w-full flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3"}>

                              <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
                                 <RadioButton
                                    id={`suppliesRadiusButton-${index}`}
                                    value={PurchaseRequestDestinationEnum.Internal.textValue}
                                    label="Insumos"
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
