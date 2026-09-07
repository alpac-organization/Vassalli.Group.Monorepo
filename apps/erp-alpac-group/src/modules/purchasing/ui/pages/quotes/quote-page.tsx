import {
   Breadcrumb,
   Tabs,
   type TabItem,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { RequisitionQuoteTab } from "./components/tabs/requisition-quote-tab/requisition-quote-tab";
import { MonthlyMaterialsQuoteTab } from "./components/tabs/monthly-materials-quote-tab/monthly-materials-quote-tab";
import { OccasionalMaterialsQuoteTab } from "./components/tabs/occasional-materials-quote-tab/occasional-materials-quote-tab";
import { QuotesPageHeader } from "./components/quotes-page-header/quotes-page-header";
import { useUserStore } from "@app/shared/stores/useUserStore";

export const QuotePage = () => {

   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();
   const { branchId } = useUserStore();

   const {
      handleRequestError,
      handleRequestSuccess,
      AlertComponent
   } = useAlertState();

   const tabs: TabItem<string>[] = [
      {
         id: "requisitions",
         label: "Requisiciones",
         render: () => (
            <RequisitionQuoteTab
               currentBranchId={branchId!}
               onRequestError={handleRequestError}
               onRequestSuccess={handleRequestSuccess}
            />
         ),
      },
      {
         id: "monthly-applications",
         label: "Solicitudes Mensuales",
         render: () => (
            <MonthlyMaterialsQuoteTab
               currentBranchId={branchId!}
               onRequestError={handleRequestError}
               onRequestSuccess={handleRequestSuccess}
            />
         ),
      },
      {
         id: "occasional-applications",
         label: "Solicitudes Eventuales",
         render: () => (
            <OccasionalMaterialsQuoteTab
               currentBranchId={branchId!}
               onRequestError={handleRequestError}
               onRequestSuccess={handleRequestSuccess}
            />
         ),
      },
   ];

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
                     label: "Solicitudes de compras",
                     url: `${baseUrl}/purchasing/requisitions`,
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <QuotesPageHeader />

         <div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
            <Tabs tabItems={tabs ?? []} activeTab="requisitions" animation="slide" />
         </div>

         {AlertComponent}
      </m.div>
   );
};
