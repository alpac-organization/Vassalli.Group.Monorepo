
import { Badges, Breadcrumb, Button, DataTable, Pagination, StatsCard, useTheme, type TableColumn } from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDate, formatNumber, formatTime } from "@app/shared/utils/string.utils";
import { m } from "framer-motion";
import { CircleCheckBig, TruckIcon, WeightTildeIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { driverRecords } from "../../mock/driver-mocked-data";
import type { DriverRecord } from "../../types/driver.types";

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<DriverRecord["status"], string> = {
   weighing: "En pesaje",
   waiting: "En espera",
   loading: "En carga",
   completed: "Completado"
};

const getStatusBadgeColor = (status: DriverRecord["status"]): string => {
   switch (status) {
      case "weighing":
         return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
      case "waiting":
         return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
      case "loading":
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
      default:
         return "bg-slate-100 text-slate-800";
   }
};

const columns: TableColumn<DriverRecord>[] = [

   { key: "licensePlate", label: "Placa" },
   { key: "driverName", label: "Conductor" },
   {
      key: "status",
      label: "Estado",
      render: (row) => (
         <Badges
            label={STATUS_LABELS[row.status]}
            color="transparent"
            className={getStatusBadgeColor(row.status)}
         />
      ),
   },
   {
      key: "arrivalDate",
      label: "Fecha llegada",
      render: (row) => formatDate(row.arrivalTime),
   },
   {
      key: "arrivalTime",
      label: "Hora llegada",
      render: (row) => formatTime(row.arrivalTime),
   },
   {
      key: "action",
      label: "Acciones",
      render: (row) => (
         <Button
            label={row.action}
            size="small"
            className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
         />
      ),
   },
   
];

export const WarehouseCorintoPage = () => {

   const navigate = useNavigate();
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

   const [page, setPage] =  useState(1);

   const drivers = useMemo(() => {
      return driverRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
   }, [page])

   const handlePageChange = useCallback((page: number) => {
      setPage(page)
   }, []);


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
                     url: "/",
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Panel Logístico",
                     url: "/warehouse",
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <div className="flex flex-col">
            <div className="flex justify-between items-center">
               <div className="flex flex-col justify-center">
                  <h3 className="p-0! m-0!">Actividad Logística</h3>
                  <small className="text-gray-500 dark:text-gray-300">
                     Datos y stadisticas de la actividad logística
                  </small>
               </div>
               <img
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  src={activeLogo}
                  alt="logo alpac"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            <StatsCard
               title="CAMIONES EN PLANTA"
               value={formatNumber("42")}
               trend="Total de camiones en planta"
               icon={<TruckIcon size={30} />}
               borderColor="border-red-600! dark:border-red-500!"
            />

            <StatsCard
               title="PENDIENTE DE PESAJE"
               value={`0${formatNumber("8")}`}
               trend="Total de camiones pendiente de pesaje en báscula"
               icon={<WeightTildeIcon size={30} />}
               borderColor="border-yellow-600! dark:border-yellow-500!"
            />

            <StatsCard
               title="DESPACHOS COMPLETO"
               value={formatNumber("20")}
               trend="Total de camiones despachados"
               icon={<CircleCheckBig size={30} />}
               borderColor="border-green-800! dark:border-green-600!"
            />

         </div>

         <div className="flex flex-col">
            <DataTable
               title="Lista de conductores"
               data={drivers}
               columns={columns}
               pagination={
                  <Pagination
                     currentPage={page}
                     pageSize={PAGE_SIZE}
                     totalRecords={driverRecords.length}
                     onPageChange={handlePageChange}
                     disabled={false}
                  />
               }
            />
         </div>

      </m.div>
   )
}