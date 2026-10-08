import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Modal } from "@alpac/design-system";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import {
   getAuthorizedPaths,
   isRouteAuthorized,
} from "@app/shared/layouts/dashboard-layout/utils/route-authorization.utils";
import type { TicketParams } from "./ticket-viewer.types";

// http://localhost:5173/alpac/dashboard/warehouse-mga/ticket?code=39823983


export const TicketViewer = () => {
   const { moduleCode = "" } = useParams<TicketParams>();
   const [searchParams] = useSearchParams();
   const location = useLocation();
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();
   const { companyAlias, companyName } = useUserStore();
   const [showModal, setShowModal] = useState(false);

   const code = searchParams.get("code") ?? "—";
   const authorizedPaths = getAuthorizedPaths();
   const isAuthorizedPath = isRouteAuthorized(location.pathname, authorizedPaths);
   const documentName = "Ticket de almacén";

   const scannedAt = new Date();
   const dateLabel = scannedAt
      .toLocaleDateString("es-NI", { day: "2-digit", month: "short" })
      .replace(".", "")
      .toUpperCase();
   const timeLabel = scannedAt.toLocaleTimeString("es-NI", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
   });

   useEffect(() => {
      if (!isAuthorizedPath) {
         setShowModal(true);
      }
   }, [isAuthorizedPath]);

   if (!isAuthorizedPath) {
      return (
         <Modal
            isOpen={showModal}
            variant="warning"
            title="Acceso denegado"
            description="No tienes permiso para acceder a esta ruta"
            onClose={() => {
               setShowModal(false);
               navigate(companyAlias ? `/${companyAlias}/dashboard` : "/dashboard");
            }}
         />
      );
   }

   const warehouseModulePath = moduleCode || "warehouse-mga";

   return (
      <section className="flex min-h-[80vh] w-full flex-col items-center gap-4 p-4 md:p-8">
         <div className="w-full max-w-100">
            <Breadcrumb
               items={[
                  {
                     label: "Dashboard",
                     url: baseUrl,
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Almacén",
                     url: `${baseUrl}/${warehouseModulePath}/access-control`,
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Ticket",
                     url: `${baseUrl}/${warehouseModulePath}/ticket`,
                  },
               ]}
            />
         </div>

         <article
            className="relative w-full max-w-100 overflow-visible rounded-[15px] border border-slate-200 dark:border-slate-600 dark:bg-[#242529]">
            <div className="h-4 rounded-t-[15px] bg-[repeating-linear-gradient(-45deg,#7ea0d4_0_10px,#ffffff_10px_20px)] dark:bg-[repeating-linear-gradient(-45deg,#7ea0d4_0_10px,#1e2229_10px_20px)]" />

            <header className="relative z-10 border-b border-slate-200 px-5 py-2 text-center dark:border-slate-600">
               <p className="m-0 text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                  {companyName || companyAlias || "—"}
               </p>
               <p className="m-0 mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">
                  {documentName}
               </p>
               <p className="m-0 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {dateLabel} · {timeLabel}
               </p>
            </header>

            <div className="relative z-10 space-y-6 px-8 pb-6 pt-6">
               <DetailField
                  label="Ticket Code"
                  value={code}
               />

               <DetailField
                  label="Módulo"
                  value={moduleCode || "—"}
               />

               <div className="grid grid-cols-2 gap-4">
                  <DetailField
                     label="Date"
                     value={dateLabel}
                  />
                  <DetailField
                     label="Time"
                     value={timeLabel}
                  />
               </div>

               <DetailField
                  label="Warehouse"
                  value={moduleCode || "—"}
               />

               <DetailField
                  label="Place"
                  value="Almacén Managua"
               />
            </div>

            <div className="relative my-8">
               <div className="mx-6 border-t border-dashed border-slate-200 dark:border-[#c5d2e8]" />
               <span className="absolute -left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#363a45]" />
               <span className="absolute -right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#363a45]" />
            </div>

            <div className="h-4 rounded-b-[15px] bg-[repeating-linear-gradient(-45deg,#7ea0d4_0_10px,#ffffff_10px_20px)] dark:bg-[repeating-linear-gradient(-45deg,#7ea0d4_0_10px,#1e2229_10px_20px)]" />
         </article>
      </section>
   );
};
