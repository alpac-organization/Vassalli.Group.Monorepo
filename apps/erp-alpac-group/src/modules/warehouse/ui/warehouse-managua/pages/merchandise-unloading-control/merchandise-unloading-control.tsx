import { useCallback, useMemo, useState, type FormEvent } from "react";
import { LazyMotion, m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
   Button,
   DataTable,
   Dropdown,
   InputText,
   Pagination,
   Breadcrumb,
   SectionHeader,
} from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useMerchandiseUnloading } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandiseUnloading";

import type {
   PendingAssignmentsQueries,
   PendingAssignmentsRequest,
} from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-pending-assignments.request";

import {
   getMerchandiseUnloadingColumns,
   getUnloadingStatusOptions,
} from "./merchandise-unloading-control.utils";

const PAGE_SIZE = 10;

const DEFAULT_QUERY: PendingAssignmentsQueries = {
   ducat_number: "",
   service_order_code: "",
   unloading_status: undefined,
   page_number: 1,
   page_size: PAGE_SIZE,
};

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const MerchandiseUnloadingControl = function () {
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();

   const companyId = useUserStore((state) => state.companyId);
   const moduleCode = useUserStore((state) => state.moduleCode);

   const [form, setForm] = useState<PendingAssignmentsQueries>(DEFAULT_QUERY);
   const [applied, setApplied] = useState<PendingAssignmentsQueries>(DEFAULT_QUERY);

   const payloadGetPendingAssignments = useMemo<PendingAssignmentsRequest>(
      () => ({
         company_id: companyId,
         module_code: moduleCode,
         ...applied,
      }),
      [companyId, moduleCode, applied],
   );

   const { GetPendingAssignmentsQuery } = useMerchandiseUnloading({
      payloadGetPendingAssignments,
   });

   const { data: pendingAssignments, isLoading, isFetching } = GetPendingAssignmentsQuery;

   const rows = pendingAssignments?.data ?? [];
   const totalRecords = pendingAssignments?.total ?? 0;

   const columns = useMemo(() => getMerchandiseUnloadingColumns(), []);

   const handleApplyFilters = useCallback(
      (event: FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         setApplied({ ...form, page_number: 1 });
      },
      [form],
   );

   const handleClearFilters = useCallback(() => {
      setForm(DEFAULT_QUERY);
      setApplied({ ...DEFAULT_QUERY, page_number: 1 });
   }, []);

   const handlePageChange = useCallback((page: number) => {
      setForm((prev) => ({ ...prev, page_number: page }));
      setApplied((prev) => ({ ...prev, page_number: page }));
   }, []);

   return (
      <LazyMotion features={loadFeatures} strict>
         <m.div
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

            <div className="flex flex-col xl:flex-row xl:items-end w-full gap-5 mb-5">
               <form onSubmit={handleApplyFilters} className="w-full min-w-0">
                  <div className="flex justify-between items-center mb-5">
                     <SectionHeader
                        title="Filtros de búsqueda"
                        subtitle="También puedes filtrar por los siguientes parámetros"
                     />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
                     <div className="flex flex-col min-w-0">
                        <InputText
                           label="N°. de ducado"
                           className={inputClassName}
                           labelClassName={labelClassName}
                           type="text"
                           value={form.ducat_number}
                           placeholder="Ingrese el número de ducado"
                           errorVariant="tooltip"
                           onChange={(event) =>
                              setForm((prev) => ({ ...prev, ducat_number: event.target.value }))
                           }
                        />
                     </div>

                     <div className="flex flex-col min-w-0">
                        <InputText
                           label="Orden de servicio"
                           className={inputClassName}
                           labelClassName={labelClassName}
                           type="text"
                           value={form.service_order_code}
                           placeholder="Ingrese la orden de servicio"
                           errorVariant="tooltip"
                           onChange={(event) =>
                              setForm((prev) => ({ ...prev, service_order_code: event.target.value }))
                           }
                        />
                     </div>

                     <div className="flex flex-col min-w-0">
                        <Dropdown
                           value={form.unloading_status ?? ""}
                           onChange={(value) =>
                              setForm((prev) => ({
                                 ...prev,
                                 unloading_status: value as PendingAssignmentsQueries["unloading_status"],
                              }))
                           }
                           label="Estado"
                           appearance="dark"
                           placeholder="Seleccione un estado"
                           labelClassName="text-black! dark:text-white!"
                           valueClassName="text-black! dark:text-white!"
                           className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                           options={getUnloadingStatusOptions()}
                        />
                     </div>

                     <div className="flex flex-col min-w-0">
                        <Button
                           type="submit"
                           size="giant"
                           disabled={false}
                           className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                           label="Aplicar filtros"
                        />
                     </div>

                     <div className="flex flex-col min-w-0 sm:col-span-2 lg:col-span-1">
                        <Button
                           type="button"
                           size="giant"
                           className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                           label="Limpiar filtros"
                           onClick={handleClearFilters}
                        />
                     </div>
                  </div>
               </form>
            </div>

            <div className="flex flex-col">
               <DataTable
                  title="Lista de descargues de mercancía pendientes"
                  data={rows}
                  columns={columns}
                  isLoading={isLoading}
                  loadingTitle="Cargando descargues..."
                  pagination={
                     <Pagination
                        currentPage={applied.page_number ?? 1}
                        pageSize={applied.page_size ?? PAGE_SIZE}
                        totalRecords={totalRecords}
                        onPageChange={handlePageChange}
                        disabled={isFetching}
                     />
                  }
               />
            </div>
         </m.div>
      </LazyMotion>
   );
};
