import { ContextMenuButton } from "@alpac/design-system";
import type { StackingOrderMenuProps } from "./stacking-order-menu.types";

export const StackingOderMenu = ({ onBringToFront, onSendToBack }: StackingOrderMenuProps) => {
   return (
      <>
         <ContextMenuButton
            label="Enviar hacia atrás"
            onClick={onSendToBack}
         />

         <li
            role="separator"
            className="m-0 p-0 h-0 border-t border-slate-200 dark:border-slate-600"
         />

         <ContextMenuButton
            label="Traer al frente"
            onClick={onBringToFront}
         />
      </>

   );
}