import { useEffect, useState } from "react";
import { Button, Dropdown, InputText, Modal } from "@alpac/design-system";
import { ArrowRight, PlusIcon, Trash2Icon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { UnloadingMerchandiseType, UnloadingMerchandiseTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse-managua/unloading-merchandise-type";
import { PalletType, PalletTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse-managua/pallet-type";
import type { StartUnloadingConfirmModalProps } from "./start-unloading-confirm-modal.types";
import { validateIntegerNumber, validatePositiveNumber } from "@app/shared/utils/number.utils";

const dropdownClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const startUnloadingButtonClass =
   "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";
const cancelButtonClass =
   "rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";
const addRowButtonClass =
   "text-[13px]! rounded-md! h-9 px-3! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const sectionTitleClassName =
   "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

type PalletFormValues = {
   type: number | "";
   quantity: string;
   length_metres: string;
   width_metres: string;
};

type PalletsAndSuppliesValues = {
   pallets: PalletFormValues[];
};

type SupplyFormRow = {
   id: string;
   supplies_id: string;
   quantity: string;
};

const emptyPallet: PalletFormValues = {
   type: "",
   quantity: "",
   length_metres: "",
   width_metres: "",
};

const createSupplyRow = (): SupplyFormRow => ({
   id: crypto.randomUUID(),
   supplies_id: "",
   quantity: "",
});

const toIntegerInput = (value: string): string => value.replace(/\D/g, "");

export const StartUnloadingConfirmModal = ({
   isOpen,
   onClose,
   onConfirm,
}: StartUnloadingConfirmModalProps) => {

   const [merchandiseType, setMerchandiseType] = useState<number | "">("");
   const [supplies, setSupplies] = useState<SupplyFormRow[]>([createSupplyRow()]);

   const isArmed = merchandiseType === UnloadingMerchandiseType.Armed.value;
   const isBulk = merchandiseType === UnloadingMerchandiseType.Bulk.value;

   const {
      control,
      watch,
      reset,
      setValue,
      formState: { errors },
   } = useForm<PalletsAndSuppliesValues>({
      defaultValues: {
         pallets: [emptyPallet],
      },
   });

   const { fields: pallets, append: appendPallet, remove: removePallet } = useFieldArray({
      control,
      name: "pallets",
   });

   const palletValues = watch("pallets");

   const validPallets = (palletValues ?? []).filter((row) => {
      if (row.type === "" || Number(row.quantity) <= 0) return false;
      if (row.type !== PalletType.Oversized.value) return true;
      return Number(row.length_metres) > 0 && Number(row.width_metres) > 0;
   });

   const validSupplies = supplies.filter(
      (row) => row.supplies_id.trim() !== "" && Number(row.quantity) > 0,
   );

   const canSaveDetails =
      merchandiseType !== "" &&
      validPallets.length > 0 &&
      (isArmed || validSupplies.length > 0);

   const resetForm = () => {
      setMerchandiseType("");
      setSupplies([createSupplyRow()]);
      reset({ pallets: [emptyPallet] });
   };

   useEffect(() => {
      if (!isOpen) resetForm();
   }, [isOpen]);

   const handleClose = () => {
      resetForm();
      onClose();
   };

   const updateSupply = (id: string, field: keyof Omit<SupplyFormRow, "id">, value: string) => {
      setSupplies((rows) =>
         rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
      );
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         variant="default"
         size="6xl"
         title={"Iniciar descargue"}
         panelClassName="flex max-h-[min(92dvh,52rem)] min-h-0 flex-col overflow-hidden"
         contentClassName="flex min-h-0 flex-1 flex-col"
      >
         <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
               <div className="flex flex-col gap-4 pb-2">

                  <Dropdown
                     label="Tipo de mercancía"
                     placeholder="Seleccione un tipo"
                     isRequired
                     appearance="dark"
                     options={UnloadingMerchandiseTypeOptions}
                     value={merchandiseType}
                     onChange={(value) => setMerchandiseType(value === "" ? "" : Number(value))}
                     className={dropdownClassName}
                     labelClassName={labelClassName}
                     valueClassName="text-black! dark:text-white!"
                  />

                  <section className="flex flex-col gap-3">
                     <div className="flex items-center justify-between gap-3">
                        <h4 className={`${sectionTitleClassName} flex-1`}>Pallets</h4>
                        <Button
                           type="button"
                           label="Agregar"
                           size="medium"
                           icon={<PlusIcon size={16} />}
                           className={addRowButtonClass}
                           onClick={() => appendPallet(emptyPallet)}
                        />
                     </div>

                     <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
                        Los pallets son obligatorios.
                     </p>

                     {pallets.map((row, index) => {
                        const palletType = watch(`pallets.${index}.type`);
                        const isOversized = palletType === PalletType.Oversized.value;

                        return (
                           <div
                              key={row.id}
                              className={`grid grid-cols-1 gap-3 sm:grid-cols-2 items-end ${isOversized
                                 ? "lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                                 : "lg:grid-cols-[1fr_1fr_auto]"
                                 }`}
                           >
                              <Controller
                                 name={`pallets.${index}.type`}
                                 control={control}
                                 rules={{ required: "El tipo es requerido" }}
                                 render={({ field }) => (
                                    <Dropdown
                                       label="Tipo"
                                       placeholder="Seleccione un tipo"
                                       isRequired
                                       appearance="dark"
                                       options={PalletTypeOptions}
                                       value={field.value}
                                       className={dropdownClassName}
                                       labelClassName={labelClassName}
                                       valueClassName="text-black! dark:text-white!"
                                       error={errors.pallets?.[index]?.type?.message}
                                       onChange={(value) => {
                                          const nextType = value === "" ? "" : Number(value);
                                          field.onChange(nextType);
                                          if (nextType !== PalletType.Oversized.value) {
                                             setValue(`pallets.${index}.length_metres`, "");
                                             setValue(`pallets.${index}.width_metres`, "");
                                          }
                                       }}
                                    />
                                 )}
                              />

                              <Controller
                                 name={`pallets.${index}.quantity`}
                                 control={control}
                                 rules={{
                                    required: "La cantidad es requerida",
                                    validate: {
                                       validateInteger: (value) => validateIntegerNumber(value),
                                       validatePositive: (value) => validatePositiveNumber(value),
                                    },
                                 }}
                                 render={({ field }) => (
                                    <InputText
                                       label="Cantidad"
                                       isRequired
                                       type="text"
                                       inputMode="numeric"
                                       placeholder="0"
                                       value={field.value}
                                       className={inputClassName}
                                       labelClassName={labelClassName}
                                       error={errors.pallets?.[index]?.quantity?.message}
                                       onChange={(event) =>
                                          field.onChange(toIntegerInput(event.target.value))
                                       }
                                    />
                                 )}
                              />

                              {isOversized && (
                                 <>
                                    <Controller
                                       name={`pallets.${index}.length_metres`}
                                       control={control}
                                       rules={{
                                          required: "El largo es requerido",
                                          validate: {
                                             validatePositive: (value) => validatePositiveNumber(value),
                                          },
                                       }}
                                       render={({ field }) => (
                                          <InputText
                                             label="Largo (m)"
                                             isRequired
                                             type="number"
                                             placeholder="0"
                                             value={field.value ?? ""}
                                             className={inputClassName}
                                             labelClassName={labelClassName}
                                             error={errors.pallets?.[index]?.length_metres?.message}
                                             onChange={(event) => field.onChange(event.target.value)}
                                          />
                                       )}
                                    />

                                    <Controller
                                       name={`pallets.${index}.width_metres`}
                                       control={control}
                                       rules={{
                                          required: "El ancho es requerido",
                                          validate: {
                                             validatePositive: (value) => validatePositiveNumber(value),
                                          },
                                       }}
                                       render={({ field }) => (
                                          <InputText
                                             label="Ancho (m)"
                                             isRequired
                                             type="number"
                                             placeholder="0"
                                             value={field.value ?? ""}
                                             className={inputClassName}
                                             labelClassName={labelClassName}
                                             error={errors.pallets?.[index]?.width_metres?.message}
                                             onChange={(event) => field.onChange(event.target.value)}
                                          />
                                       )}
                                    />
                                 </>
                              )}

                              <Button
                                 type="button"
                                 size="small"
                                 tooltip="Quitar pallet"
                                 icon={<Trash2Icon size={18} />}
                                 disabled={pallets.length === 1}
                                 onClick={() => {
                                    if (pallets.length === 1) return;
                                    removePallet(index);
                                 }}
                                 className="h-12 w-12! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!"
                              />
                           </div>
                        );
                     })}
                  </section>

                  <section className="flex flex-col gap-3">
                     <div className="flex items-center justify-between gap-3">
                        <h4 className={`${sectionTitleClassName} flex-1`}>
                           Insumos
                        </h4>
                        <Button
                           type="button"
                           label="Agregar"
                           size="medium"
                           icon={<PlusIcon size={16} />}
                           className={addRowButtonClass}
                           disabled={false}
                           onClick={() => setSupplies((rows) => [...rows, createSupplyRow()])}
                        />
                     </div>
                     <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
                        {isArmed
                           ? "Los insumos son opcionales para mercancía armada."
                           : isBulk
                              ? "Los insumos son obligatorios para mercancía a granel."
                              : "Seleccione el tipo de mercancía para definir si los insumos son obligatorios."}
                     </p>
                     {supplies.map((row) => (
                        <div
                           key={row.id}
                           className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] items-end"
                        >
                           <InputText
                              label="Identificador"
                              isRequired={isBulk}
                              placeholder="ID del insumo"
                              value={row.supplies_id}
                              disabled={false}
                              className={inputClassName}
                              labelClassName={labelClassName}
                              onChange={(event) =>
                                 updateSupply(row.id, "supplies_id", event.target.value)
                              }
                           />

                           <InputText
                              label="Cantidad"
                              isRequired={isBulk}
                              type="text"
                              inputMode="numeric"
                              placeholder="0"
                              value={row.quantity}
                              disabled={false}
                              className={inputClassName}
                              labelClassName={labelClassName}
                              onChange={(event) =>
                                 updateSupply(
                                    row.id,
                                    "quantity",
                                    toIntegerInput(event.target.value)

                                 )
                              }
                           />

                           <Button
                              type="button"
                              size="small"
                              tooltip="Quitar producto"
                              icon={<Trash2Icon size={18} />}
                              onClick={() =>
                                 setSupplies((rows) =>
                                    rows.length === 1 ? rows : rows.filter((item) => item.id !== row.id),
                                 )
                              }
                              className="h-12 w-12! shrink-0 rounded-md! bg-red-500! text-[13px]! text-white! hover:bg-red-800! dark:bg-red-900!"
                           />
                        </div>
                     ))}
                  </section>

               </div>
            </div>

            <div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
               <div className="flex justify-end gap-3">
                  <Button
                     type="button"
                     label="Salir"
                     size="giant"
                     className={cancelButtonClass}
                     onClick={handleClose}
                     disabled={false}
                  />
                  <Button
                     type="button"
                     label="Iniciar"
                     size="giant"
                     className={startUnloadingButtonClass}
                     // onClick={onConfirm}
                     icon={<ArrowRight size={18} />}
                     disabled={!canSaveDetails}
                     isLoading={false}
                  />
               </div>
            </div>
         </div>
      </Modal>
   );
};
