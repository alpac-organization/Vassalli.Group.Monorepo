import {
   Breadcrumb,
   Tabs,
   type TabItem
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Supplier } from "../supplier/supplier";
import { Product } from "@app/modules/product/ui/pages/product/product";

export const SupplierProduct = () => {
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();   

   const tabs: TabItem<string>[] = [
      {
         id: "suppliers",
         label: "Proveedores",
         render: () => <Supplier />

      },
      {
         id: "products",
         label: "Productos",
         render: () => <Product />
      },
   ]

   return (
      <m.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5 }}
         className="flex flex-col gap-4"
      >
         <div className="flex justify-start">
            <Breadcrumb
               items={[
                  {
                     label: "Dashboard",
                     url: `${baseUrl}/`,
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Proveedores y Productos",
                     url: `${baseUrl}/purchasing/suppliers`,
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
            <Tabs tabItems={tabs ?? []} activeTab="suppliers" animation="fade" />
         </div>         

      </m.div>
   );
};
