import { Button, Modal } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import {
   PlusIcon,
   SaveIcon,
   Trash2Icon,
   XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { Ducat } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/ducat/ducat";
import { VehicleDataStep } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data/vehicle-data";
import {
   GATE_ENTRY_DEFAULT_VALUES,
   type GateEntryFormValues,
   type GateEntryModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { stepVariants } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import { footerButtonClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
import { CustomsDeclaration } from "./components/customs-declaration/customs-declaration";

export function GateEntryModal({
   isOpen,
   onClose,
   onSubmit,
   isSubmitting = false,
}: GateEntryModalProps) {

   const [isDeleteAllDucasConfirmOpen, setIsDeleteAllDucasConfirmOpen] = useState(false);
   const [ducasError, setDucasError] = useState<string | null>(null);
   const [documentType, setDocumentType] = useState<DocumentType>(DocumentEnum.DUCA);

   const { register, handleSubmit, control, reset, setValue, formState: { errors } } =
      useForm<GateEntryFormValues>({
         mode: "onChange",
         defaultValues: GATE_ENTRY_DEFAULT_VALUES,
      });

   const { fields, append, remove, replace } = useFieldArray({
      control,
      name: "ducas",
   });

   useEffect(() => {
      if (!isOpen) {
         reset(GATE_ENTRY_DEFAULT_VALUES);
         setIsDeleteAllDucasConfirmOpen(false);
         setDucasError(null);
      }
   }, [isOpen, reset]);

   const handleClose = () => {
      if (isSubmitting) return;
      reset(GATE_ENTRY_DEFAULT_VALUES);
      setIsDeleteAllDucasConfirmOpen(false);
      setDucasError(null);
      onClose();
   };

   const handleAddDuca = () => {
      append({ value: "" });
      setDucasError(null);
   };

   const handleConfirmDeleteAllDucas = () => {
      replace([]);
      setDucasError(null);
      setIsDeleteAllDucasConfirmOpen(false);
   };

   const handleFormSubmit: SubmitHandler<GateEntryFormValues> = (data) => {

      const ducas = !!data.ducas && Array.isArray(data.ducas) ? data.ducas : [];

      const hasAtLeastOneDuca = ducas.some((duca) => duca.value.trim());

      const setDucas = new Set();

      const hasDuplicates = ducas.filter(duca => {
         if (setDucas.has(duca.value)) return true;
         setDucas.add(duca.value);
         return false;
      })

      if (!hasAtLeastOneDuca) {
         setDucasError("Debe agregar al menos una DUCA para guardar el registro.");
         return;
      }

      if (!!hasDuplicates.length) {
         setDucasError("Existen documentos DUCA duplicadas");
         return;
      }

      onSubmit(data);
   };

   return (
      <>
         <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Registro de Entrada de Vehículo"
            variant="form"
            size="7xl"
            panelClassName={[
               "flex! flex-col!",
               "max-h-[min(92dvh,60rem)]!",
               "overflow-hidden!",
               "p-4! sm:p-6!",
               "w-[calc(100%-1rem)]! sm:w-full!",
               "[&>div:last-of-type]:flex-1!",
               "[&>div:last-of-type]:min-h-0!",
               "[&>div:last-of-type]:flex!",
               "[&>div:last-of-type]:flex-col!",
               "[&>div:last-of-type]:overflow-hidden!",
            ].join(" ")}
         >
            <form
               onSubmit={handleSubmit(handleFormSubmit)}
               className="flex flex-col flex-1 min-h-0 h-full overflow-hidden"
            >

               <div
                  className={[
                     "relative flex-1 min-h-0",
                     "overflow-x-hidden",
                     "overscroll-contain scrollbar-dashboard",
                     "py-2 sm:py-1 pr-1",
                  ].join(" ")}
               >
                  <AnimatePresence
                     mode="wait"

                     initial={false}>
                     <m.div
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                        className="flex flex-col gap-6"
                     >
                        <VehicleDataStep
                           register={register}
                           setValue={setValue}
                           errors={errors}
                           documentType={documentType}
                           onChangeDocumentType={(type: DocumentType) => {
                              setDocumentType(type);
                              console.log("Tipo de documento: ", type);
                           }}
                        />

                        {
                           documentType === DocumentEnum.DUCA && (
                              <div className="border-t border-slate-600 dark:border-neutral-600">
                                 <h5>Documentos DUCA</h5>
                                 <div className="shrink-0 grid grid-cols-2 gap-2 mb-2 py-2 sm:flex sm:justify-end sm:items-center sm:gap-4 sm:mb-3 sm:pt-1">
                                    <Button
                                       type="button"
                                       label="Eliminar todas"
                                       size="medium"
                                       onClick={() => setIsDeleteAllDucasConfirmOpen(true)}
                                       disabled={fields.length === 0}
                                       icon={<Trash2Icon size={18} />}
                                       className="w-full! sm:w-auto! max-sm:h-8! max-sm:px-2! max-sm:py-1! max-sm:text-[12px]! text-[14px]! rounded-md! text-white! bg-red-600! hover:bg-red-500! dark:bg-red-900! dark:hover:bg-red-800! disabled:opacity-40! justify-center!"
                                    />
                                    <Button
                                       type="button"
                                       label="Agregar Duca"
                                       size="medium"
                                       onClick={handleAddDuca}
                                       icon={<PlusIcon size={18} />}
                                       className="w-full! sm:w-auto! max-sm:h-8! max-sm:px-2! max-sm:py-1! max-sm:text-[12px]! text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! justify-center!"
                                    />
                                 </div>

                                 <Ducat fields={fields} register={register} onRemove={remove} />
                              </div>
                           )
                        }

                        {
                           documentType === DocumentEnum.CustomsDeclaration && (
                              <div className="border-t border-slate-600 dark:border-neutral-600">
                                 <h5>Documentos de Declaración Aduanera</h5>
                                 <CustomsDeclaration />
                              </div>
                           )
                        }

                     </m.div>
                  </AnimatePresence>
               </div>

               <div className="shrink-0 sticky bottom-0 z-10 bg-white dark:bg-[#272b34] grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap sm:justify-end sm:items-center sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-600 dark:border-neutral-600">
                  <Button
                     type="button"
                     label="Cancelar"
                     size="giant"
                     onClick={handleClose}
                     disabled={isSubmitting}
                     className={`${footerButtonClass}                        
                         "col-span-1"
                         text-white! bg-red-600! hover:bg-red-500! dark:bg-red-900! dark:hover:bg-red-800!`}
                     icon={<XIcon size={18} />}
                  />
                  <Button
                     type="submit"
                     label="Finalizar y Guardar"
                     size="giant"
                     isLoading={isSubmitting}
                     disabled={isSubmitting}
                     className={`${footerButtonClass} col-span-1 order-2 sm:order-0 text-white! bg-emerald-800! hover:bg-emerald-700!`}
                     icon={<SaveIcon size={18} />}
                  />
               </div>
            </form>
         </Modal>

         <ConfirmModal
            isOpen={isDeleteAllDucasConfirmOpen}
            type="APPROVE"
            title="¿Está seguro de eliminar todas las DUCAs? Esta acción es irreversible."
            buttonActionLabel="Eliminar todas"
            buttonActionClass="border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300"
            onClose={() => setIsDeleteAllDucasConfirmOpen(false)}
            handleFinalAction={handleConfirmDeleteAllDucas}
         />

         <Modal
            isOpen={Boolean(ducasError)}
            onClose={() => setDucasError(null)}
            variant="info"
            size="sm"
            panelClassName="dark:border dark:border-neutral-700"
         >
            <div className="flex flex-col items-center gap-4 text-center">
               <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ducasError}
               </p>
               <Button
                  type="button"
                  label="OK"
                  size="giant"
                  onClick={() => setDucasError(null)}
                  className="rounded-md! px-8! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! justify-center!"
               />
            </div>
         </Modal>
      </>
   );
}
