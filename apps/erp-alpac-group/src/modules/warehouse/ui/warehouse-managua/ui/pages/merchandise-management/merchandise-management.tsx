import { m } from "framer-motion";
import { Alert, Breadcrumb, SectionHeader, Tabs, useTheme, type TabItem } from "@alpac/design-system";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useNavigate } from "react-router-dom";
import { MerchandiseUnloadingControl } from "../../../pages/merchandise-unloading-control/merchandise-unloading-control";

export const MerchandiseManagement = () => {

   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

   const {
      handleRequestError,
      handleRequestSuccess,
      AlertComponent
   } = useAlertState();

   const alert = (<Alert
      type="info"
      title="Aviso"
      message="Esta funcionalidad se encuentra en desarrollo."
   />);

   const tabs: TabItem<string>[] = [
      {
         id: "unloading",
         label: "Descargue",
         render: () => <MerchandiseUnloadingControl />,
      },
      {
         id: "reassignment",
         label: "Reasignación",
         render: () => alert,
      },
      {
         id: "dispatch",
         label: "Despacho",
         render: () => alert,
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
                     label: "Control de Descarga",
                     url: `${baseUrl}/warehouse`,
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <SectionHeader
            title="Gestión de Mercancía"
            subtitle="Operaciones de entrada, salida y movimiento de mercancía"
            logoImage={activeLogo}
         />      

         <div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
            <Tabs tabItems={tabs ?? []} activeTab="unloading" animation="slide" />
         </div>

         {AlertComponent}
      </m.div>
   );
}