import { Badges, Breadcrumb, Button, DataTable, Dropdown, InputText, Pagination, StatsCard, type TableColumn } from "@alpac/design-system";
import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { driverRecords } from "../../mock/driver-mocked-data";
import { getStatusBadgeColor, getStatusButtonColor, STATUS_LABELS, type DriverRecord } from "@app/modules/warehouse/ui/pages/types/driver.types";
import { ArrowUpRightIcon, CheckCircle, TruckIcon } from "lucide-react";
import { formatTime } from "@app/shared/utils/string.utils";
import type { EnumType } from "@app/shared/types/enum.type";
import { RegisterArrivedModal } from "./components/register-arrived-modal/register-arrived-modal";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";

const PAGE_SIZE = 10;

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

export const AccessControlPage = () => {

   const navigate = useNavigate();

   const { baseUrl } = useBaseUrl();

   const [page, setPage] = useState(1);
   const [verifiedDrivers, setVerifiedDrivers] = useState<Record<number, boolean>>({});
   const [isRegisterArrivedModalOpen, setIsRegisterArrivedModalOpen] = useState(false);

   const drivers = useMemo(() => {
      return driverRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
   }, [page, driverRecords]);

   const handlePageChange = useCallback((page: number) => {
      setPage(page);
   }, []);

   const handleDriverVerified = useCallback((driverId: number, checked: boolean) => {
      setVerifiedDrivers((prev) => ({
         ...prev,
         [driverId]: checked,
      }));
   }, []);

   const handleArrivedOfFreight = useCallback((
      driver: DriverRecord,
      driverStatus: DriverRecord["status"]) => {

      console.log(driver, driverStatus);
      setIsRegisterArrivedModalOpen(true);
   }, []);

   const operationOptions: EnumType[] = [
      { value: "reception", label: "Recepción" },
      { value: "loading", label: "Embarque" },
      { value: "dispatch", label: "Despacho" }
   ]

   const columns = useMemo<TableColumn<DriverRecord>[]>(
      () => [
         { key: "identification_number", label: "Cédula" },
         { key: "driverName", label: "Conductor" },
         { key: "licensePlate", label: "Placa" },
         { key: "custumer", label: "Cliente" },
         { key: "product", label: "Producto" },
         { key: "package_number", label: "Bultos" },
         { key: "total_package_number", label: "Bultos Totales" },
         {
            key: "arrived_time", label: "Hora de llegada", render(row: DriverRecord) {
               return formatTime(row.arrivalTime)
            }
         },
         {
            key: "exit_time", label: "Hora de salida", render(row: DriverRecord) {
               return formatTime(row.exit_time)
            }
         },
         {
            key: "entry_number", label: "Entradas", render(row: DriverRecord) {
               return row.entry_number
            }
         },
         {
            key: "exit_number", label: "Salidas", render(row: DriverRecord) {
               return row.exit_number
            }
         },
         {
            key: "status",
            label: "Estado",
            render: (row) => {

               const status =
                  row.entry_number === 0 && row.exit_number === 0 ? STATUS_LABELS.waiting :
                     row.entry_number === row.exit_number ?
                        STATUS_LABELS.entry : STATUS_LABELS.exit;

               const statusType: DriverRecord["status"] =
                  row.entry_number === 0 && row.exit_number === 0 ? "waiting" :
                     row.entry_number === row.exit_number ?
                        "entry" : "exit";

               return (
                  <Badges
                     label={status}
                     color="transparent"
                     className={getStatusBadgeColor(statusType)}
                  />
               )
            },
         },
         {
            key: "action",
            label: "Acciones",
            render: (row) => {

               const status =
                  row.entry_number === 0 && row.exit_number === 0 ? "Llegó" :
                     row.entry_number === row.exit_number ?
                        "Llegó" : "Salió";

               const driverStatus: DriverRecord["status"] =
                  row.entry_number === 0 && row.exit_number === 0 ? "waiting" :
                     row.entry_number === row.exit_number ?
                        "entry" : "exit";

               const icon =
                  row.entry_number === 0 && row.exit_number === 0 ? <CheckCircle size={18} /> :
                     row.entry_number === row.exit_number ?
                        <CheckCircle size={18} /> : <ArrowUpRightIcon size={18} />;

               return (
                  <Button
                     label={status}
                     size="small"
                     icon={icon}
                     onClick={() => handleArrivedOfFreight(row, driverStatus)}
                     className={getStatusButtonColor(driverStatus)}
                  />
               )
            },
         },
      ],
      [verifiedDrivers, handleDriverVerified],
   );

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
                     label: "Control de Acceso",
                     url: `${baseUrl}/warehouse`,
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <div className="flex flex-col xl:flex-row xl:items-end w-full gap-5">

            <div className="w-full xl:w-[320px] xl:shrink-0">
               <StatsCard
                  title="Camiones dentro del Plantel"
                  value={"5"}
                  icon={<TruckIcon size={30} />}
                  borderColor="border-green-800! dark:border-green-600!"
               />
            </div>

            <form
               onSubmit={() => { }}
               className="w-full min-w-0"
            >
               <h3 className="p-0! m-0! mb-3">Filtros</h3>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
                  <div className="flex flex-col min-w-0">
                     <InputText
                        label="Nombre conductor"
                        className={inputClassName}
                        labelClassName={labelClassName}
                        type="text"
                        placeholder="Ingrese la identificación"
                        errorVariant="tooltip"
                     />
                  </div>

                  <div className="flex flex-col min-w-0">
                     <InputText
                        label="Identificación"
                        className={inputClassName}
                        labelClassName={labelClassName}
                        type="text"
                        placeholder="Ingrese la identificación"
                        errorVariant="tooltip"
                     />
                  </div>

                  <div className="flex flex-col min-w-0">
                     <Dropdown
                        value={""}
                        onChange={() => { }}
                        label="Tipo de operación"
                        appearance="dark"
                        placeholder="Seleccione un tipo de solicitud"
                        labelClassName="text-black! dark:text-white!"
                        valueClassName="text-black! dark:text-white!"
                        className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                        options={operationOptions ?? []}
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
                        onClick={() => { }}
                     />
                  </div>
               </div>
            </form>

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
                     totalRecords={drivers.length}
                     onPageChange={handlePageChange}
                     disabled={false}
                  />
               }
            />
         </div>

         <RegisterArrivedModal
            isOpen={isRegisterArrivedModalOpen}
            onClose={() => {
               setIsRegisterArrivedModalOpen(false);
            }} />

      </m.div>
   )
}