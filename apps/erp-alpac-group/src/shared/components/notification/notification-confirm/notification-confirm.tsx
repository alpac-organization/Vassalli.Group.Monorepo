import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { NotificationConfirmProps } from "./notification-confirm.types";
import { detectPlatform, getInstructions } from "../notification-banner/notification-banner.variants";

const approveButtonClass = "rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 disabled:opacity-40 shadow-sm transition-all duration-200";

export const NotificationConfirm = ({
   isOpen,
   onClose,
   onConfirm,
   isLoading = false,
}: NotificationConfirmProps) => {

   const platform = detectPlatform();

   const instructions = getInstructions(platform);

   const { title, steps } = instructions;

   const handleFinalAction = async () => {

      await onConfirm();

      onClose();
   };

   return (
      <ConfirmModal
         isOpen={isOpen}
         type="APPROVE"
         title={title}
         variant="info"
         buttonActionLabel="Activar"
         buttonActionClass={approveButtonClass}
         buttonCancelClass="rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
         onClose={onClose}
         handleFinalAction={handleFinalAction}
         isLoading={isLoading}
         disabled={isLoading}
      >
         <ol className="list-decimal list-outside space-y-2 pl-6 text-slate-600 dark:text-slate-300 text-sm flex flex-col gap-1">
            {steps.length > 0 && steps.map((step) => (
               <li key={step}>{step}</li>
            ))}
         </ol>
      </ConfirmModal>
   );
};
