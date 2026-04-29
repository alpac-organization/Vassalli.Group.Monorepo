import { Button, Modal } from "@alpac/design-system"
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types"
import type { ConfirmActionProps } from "./confirm-modal.types";

export const ConfirmModal = ({
   isOpen,
   onClose,
   type,
   handleFinalAction,
   isLoading = false,
   disabled = false
}: ConfirmActionProps) => {

   const classButton = "rounded-md! px-6! border shadow-sm transition-all duration-200";
   const classButtonExit = "rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";
   const classButtonCancel = "border border-orange-200 dark:border-orange-500/30 rounded-md! bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-500/20 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-40"
   const classButtonAction = type === 'APPROVE' ?
      'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40' :
      'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-40';

   const handleFinalActionInternal = (type: ConfirmActionType) => {
      handleFinalAction(type);
   }

   return (
      <Modal
         size="md"
         variant="warning"
         isOpen={isOpen}
         onClose={() => !isLoading && onClose?.()}
      >
         <div className="flex flex-col gap-4 text-center">
            <p className="text-slate-600 dark:text-slate-300">
               Se procederá a {type === 'APPROVE' ? 'aprobar' : type === 'REJECT' ? 'rechazar' : 'cancelar'} esta solicitud.
               Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center gap-3 mt-4">
               <Button
                  type="button"
                  label="Salir"
                  size="giant"
                  className={`${classButtonExit}`}
                  onClick={() => onClose?.()}
                  disabled={isLoading || disabled}
               />
               <Button
                  type="button"
                  label={type === 'APPROVE' ? 'Sí, Aprobar' : type === 'REJECT' ? 'Sí, Rechazar' : 'Sí, Cancelar'}
                  size="giant"
                  className={`${classButton} ${type === 'APPROVE' ? classButtonAction : type === 'REJECT' ? classButtonAction : classButtonCancel}`}
                  onClick={() => handleFinalActionInternal(type)}
                  disabled={disabled}
                  isLoading={isLoading}
               />
            </div>
         </div>
      </Modal>
   )
}