import { m } from "framer-motion";
import { Button} from "@alpac/design-system";
import { TruckBanner } from "@app/shared/components/truck-banner/truck-banner";
import { InboundOperationTable } from "@app/modules/warehouse/ui/warehouse-corinto/pages/inbound-operation/components/inbound-operation-table/inbound-operation-table";
import { UserRoundPlusIcon } from "lucide-react";
import { useCallback } from "react";
import { InboundOperationForm } from "./components/inbound-operation-form/inbound-operation-form";

export const InboundOperation = () => {
   
   const handleBeginOperation = useCallback(() => {
      
   }, []);

   return (
      <m.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4">

         <div className="relative mx-auto w-[100%] rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">

            <TruckBanner title="Documentos" subTitle="Gestión de Documentación" />

            <Button
               type="button"
               size="giant"
               label="Iniciar Nueva Operación"
               icon={<UserRoundPlusIcon size={20} />}
               className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
               onClick={handleBeginOperation}
            />

            <InboundOperationTable data={[]} />

            <InboundOperationForm
               isOpen={false}
               onSubmit={(data) => {
                  console.log(data)
               }}
               onClose={() => {
                  
               }}
            />
         
         </div>

      </m.div>
   );
}