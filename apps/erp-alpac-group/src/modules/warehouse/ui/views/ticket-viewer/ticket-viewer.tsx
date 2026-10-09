import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "@alpac/design-system";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import type { TicketParams } from "./ticket-viewer.types";
import { useWarehouseAssignment } from "../../hooks/warehouse-managua/useAssignment";
import { Loader } from "@app/shared/components/loaders/loader";

// Handheld / QR → http://localhost:5173/alpac/dashboard/warehouse-mga/ticket?code=39823983
// Esta ruta vive fuera de DashboardLayout a propósito: solo requiere sesión (AuthGuard),
// no contexto de módulo elegido en el Home.

export const TicketViewer = () => {

   const { moduleCode: modulePath } = useParams<TicketParams>();
   const [searchParams] = useSearchParams();
   
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();
   const { companyAlias, companyName, companyId} = useUserStore();

   const [hasHydrated, setHasHydrated] = useState(() =>
      useUserStore.persist.hasHydrated(),
   );

   useEffect(() => {
      const unsub = useUserStore.persist.onFinishHydration(() => {
         setHasHydrated(true);
      });
      setHasHydrated(useUserStore.persist.hasHydrated());
      return unsub;
   }, []);

   const code = searchParams.get("code") ?? "—";

   console.log(code)
   console.log(modulePath)

   const documentName = "Ticket de almacén";


   const { GetAssignmentDetailsByCode } = useWarehouseAssignment({
      payloadAssignmentDetailsByCode : {
         assignment_code : code,
         company_id      : companyId,
         module_code     : modulePath ?? ""
      }
   });
   
   const { data, isPending, isLoading } = GetAssignmentDetailsByCode;

   console.log(JSON.stringify(data, null, 3))

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

   if (!hasHydrated) {
      return null;
   }

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
                     url: `${baseUrl}/${modulePath}/access-control`,
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Ticket",
                     url: `${baseUrl}/${modulePath}/ticket`,
                  },
               ]}
            />
         </div>

         {
            (isPending || isLoading) && (
               <Loader title="Cargando información" />
            )
         }

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
                  value={modulePath}
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
                  value={modulePath}
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
