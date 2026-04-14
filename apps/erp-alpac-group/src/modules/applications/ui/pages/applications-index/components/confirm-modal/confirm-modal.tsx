import { Button, Modal } from "@alpac/design-system"
import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types"


export const ConfirmModal = ({
   isOpen,
   onClose,
   type,
   handleFinalAction,
   isLoading = false,
   disabled = false
}: {
   isOpen: boolean;
   type: ConfirmActionType;
   onClose?: () => void;
   handleFinalAction: (type: ConfirmActionType) => void;
   isLoading?: boolean;
   disabled?: boolean;
}) => {

   const classButton = "rounded-md! px-6! border shadow-sm transition-all duration-200";
   const classButtonCancel = "rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";
   const classButtonAction = type === 'APPROVE' ?
      'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40' :
      'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-40';

   const handleFinalActionInternal = (type: ConfirmActionType) => {
      handleFinalAction(type);
      onClose?.();
   }

   return (
      <Modal
         variant="warning"
         size="md"
         isOpen={isOpen}
         onClose={() => onClose?.()}
      >
         <div className="flex flex-col gap-4 text-center">
            <p className="text-slate-600 dark:text-slate-300">
               Se procederá a {type === 'APPROVE' ? 'aprobar' : 'rechazar'} esta solicitud.
               Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center gap-3 mt-4">
               <Button
                  type="button"
                  label="Cancelar"
                  size="giant"
                  className={`${classButtonCancel}`}
                  onClick={() => onClose?.()}
               />
               <Button
                  type="button"
                  label={type === 'APPROVE' ? 'Sí, Aprobar' : 'Sí, Rechazar'}
                  size="giant"
                  className={`${classButton} ${classButtonAction}`}
                  onClick={() => handleFinalActionInternal(type)}
                  disabled={disabled}
                  isLoading={isLoading}
               />
            </div>
         </div>
      </Modal>
   )
}