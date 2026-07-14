import { m } from "framer-motion";
import { Button } from "@alpac/design-system";
import { TruckBanner } from "@app/shared/components/truck-banner/truck-banner";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import { UserRoundPlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { CustomerModal } from "./components/customer-modal/customer-modal";
import { CustomerTable } from "./components/customer-table/customer-table";
import { TabModal } from "./components/tab-modal/tab-modal";

export const Customer = () => {

   const { companyId } = useUserStore();

   const { GetCustomer } = useCustomer();

   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
   const [isTabModalOpen, setIsTabModalOpen] = useState(false);

   const { data } = GetCustomer({ company_id: companyId });

   const handleCreateCustomer = useCallback(() => {
      setIsCustomerModalOpen(true);
   }, []);

   const handleTabModal = useCallback(() => {
      setIsTabModalOpen(true);
   }, []);

   return (
      <m.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4">

         <div className="relative mx-auto w-[100%] rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">

            <TruckBanner title="Clientes" subTitle="Gestión de Clientes" />

            <div className="flex gap-4">
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
                  label="Tab Modal"
                  icon={<UserRoundPlusIcon size={20} />}
                  className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                  onClick={handleTabModal}
               />
            </div>

            <CustomerTable data={data} />

            <CustomerModal
               isOpen={isCustomerModalOpen}
               onSubmit={(data) => {
                  console.log(data)
               }}
               onClose={() => {
                  setIsCustomerModalOpen(false)
               }}
            />

            <TabModal
               isOpen={isTabModalOpen}
               onClose={() => {
                  setIsTabModalOpen(false)
               }}
            />
         </div>

      </m.div>
   );
}