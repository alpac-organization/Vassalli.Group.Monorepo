import { Button, Modal } from "@alpac/design-system";
import type { UnloadingTimerModalProps } from "./unloading-timer-modal.types";
import { UnloadingTimer } from "../unloading-timer/unloading-timer";

const classButton = "rounded-md! px-6! border shadow-sm transition-all duration-200";
const classButtonExit = "rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";

export const UnloadingTimerModal = (props: UnloadingTimerModalProps) => {

   return (
      <Modal
         size="md"
         variant="warning"
         isOpen={props.isOpen}
         onClose={() => props.onClose?.()}
      >
         <div className="flex flex-col gap-4 text-center">

            <p>Desea iniciar temporizador</p>

            <UnloadingTimer />

            <div className="flex justify-center gap-3 mt-4">
               <Button
                  type="button"
                  label="Salir"
                  size="giant"
                  className={`${classButtonExit}`}
                  onClick={() => props.onClose?.()}
                  disabled={false}
               />
               <Button
                  type="button"
                  label="Iniciar Temporizador"
                  size="giant"
                  className={`${classButton}`}
                  onClick={() => { }}
                  disabled={false}
                  isLoading={false}
               />
            </div>
         </div>
      </Modal>
   );

}
