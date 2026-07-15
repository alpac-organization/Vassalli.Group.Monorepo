import { m } from "framer-motion";
import { Button } from "@alpac/design-system";
import { TruckBanner } from "@app/shared/components/truck-banner/truck-banner";
import { BoxesIcon, UserRoundPlusIcon, Warehouse } from "lucide-react";
import { useCallback, useState } from "react";
import { StartOperationModal } from "./components/start-operation-modal/start-operation-modal";
import { CustomerModal } from "../customer/components/customer-modal/customer-modal";
import { OperationTable } from "./components/operation-table/operation-table";
import { WarehouseModal } from "../../../warehouse/components/warehouse-modal/warehouse-modal";

export const AdministrativeSection = () => {

   const [isStartOperationOpen, setIsStartOperationOpen] = useState(false);
   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
   const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);

   const handleBeginOperation = useCallback(() => {
      setIsStartOperationOpen(true);
   }, []);

   const handleCreateCustomer = useCallback(() => {
      setIsCustomerModalOpen(true);
   }, []);

   const handleCreateWarehouse = useCallback(() => {
      setIsWarehouseModalOpen(true);
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

            <div className="flex gap-4">

               <Button
                  type="button"
                  size="giant"
                  label="Iniciar Nueva Operación"
                  icon={<BoxesIcon size={20} />}
                  className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  onClick={handleBeginOperation}
               />

               <Button
                  type="button"
                  size="giant"
                  label="Registrar Cliente Nuevo"
                  icon={<UserRoundPlusIcon size={20} />}
                  className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  onClick={handleCreateCustomer}
               />

               <Button
                  type="button"
                  size="giant"
                  label="Registrar Nueva Bodega"
                  icon={<Warehouse size={20} />}
                  className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  onClick={handleCreateWarehouse}
               />
            </div>

            <OperationTable data={[]} />

            <StartOperationModal
               isOpen={isStartOperationOpen}
               onSubmit={(data) => { console.log(data) }}
               onClose={() => { setIsStartOperationOpen(false) }}
            />

            <CustomerModal
               isOpen={isCustomerModalOpen}
               onSubmit={(data) => { console.log(data) }}
               onClose={() => { setIsCustomerModalOpen(false) }}
            />

            <WarehouseModal
               isOpen={isWarehouseModalOpen}
               onSubmit={(data) => { console.log(data) }}
               onClose={() => { setIsWarehouseModalOpen(false) }}
            />

         </div>

      </m.div>
   );
}