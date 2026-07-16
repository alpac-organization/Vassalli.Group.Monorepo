import { m } from "framer-motion";
import { Tabs, type TabItem } from "@alpac/design-system";
import { OperationTab } from "@app/modules/warehouse/ui/warehouse-corinto/views/administrative-section-views/operation-tab/operation-tab";
import { CustomerTab } from "@app/modules/warehouse/ui/warehouse-corinto/views/administrative-section-views/customer-tab/customer-tab";
import { WarehouseTab } from "@app/modules/warehouse/ui/warehouse-corinto/views/administrative-section-views/warehouse-tab/warehouse-tab";

export const AdministrativeSection = () => {

   const tabs: TabItem<string>[] = [
      {
         id: "operation",
         label: "Gestionar Operaciones",
         render: () => <OperationTab />
      },
      {
         id: "customer",
         label: "Gestionar Clientes",
         render: () => <CustomerTab />
      },
      {
         id: "warehouse",
         label: "Gestionar Bodegas",
         render: () => <WarehouseTab />
      },
   ]

   return (
      <m.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4">

         <div className="relative mx-auto w-[100%] rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
            <Tabs tabItems={tabs ?? []} activeTab="operation" />
         </div>

      </m.div>
   );
}