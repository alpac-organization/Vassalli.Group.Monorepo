import {
   Badges,
   Breadcrumb,
   Button,
   // Checkbox,
   DataTable,
   InputText,
   Pagination,
   type TableColumn,
} from "@alpac/design-system";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { GeneralInformation } from "./components/general-information/general-information";
// import { RecordData } from "./components/record-data/record-data";
import { ScaleBanner } from "./components/scale-banner/scale-banner";
import {
   getScaleStatusActionLabel,
   getScaleStatusBadgeColor,
   getScaleStatusButtonColor,
   SCALE_STATUS_LABELS,
   type ScaleRecord,
} from "../../types/driver.types";
import { useCallback, useMemo, useState } from "react";
import { WeightModal } from "./components/weight-modal/weight-modal";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";
import { scaleRecords } from "../../mock/scale-mocked-data";

const PAGE_SIZE = 10;

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

export const ScalePage = () => {

   const navigate = useNavigate();

   const [page, setPage] = useState(1);
   const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
   const [selectedRecord, setSelectedRecord] = useState<ScaleRecord | null>(null);

   const handleOpenWeightModal = useCallback((record: ScaleRecord) => {
      setSelectedRecord(record);
      setIsWeightModalOpen(true);
   }, []);

   const handleCloseWeightModal = useCallback(() => {
      setIsWeightModalOpen(false);
      setSelectedRecord(null);
   }, []);

   const scales = useMemo(() => {
      return scaleRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
   }, [page]);

   /* 
      {
       "id": 1,
       "licensePlate": "M 123-456",
       "driverName": "Juan Carlos Pérez",
       "status": "entry",
       "arrivalDate": "2026-06-29T07:15:00Z",
       "arrivalTime": "2026-06-29T07:15:00Z",
       "action": "ver detalles",
       "custumer": "CASUR",
       "product": "Azucar en Jumbo",
       "package_number": 22,
       "arrived_time": "15:00pm",
       "exit_time": "15:00am",
       "entry_number": 4,
       "exit_number": 3
   }
        */

   const columns = useMemo<TableColumn<ScaleRecord>[]>(
      () => [
         { key: "identification_number", label: "Cédula" },
         { key: "driverName", label: "Conductor" },
         { key: "licensePlate", label: "Placa" },
         {
            key: "status",
            label: "Estado",
            render(row: ScaleRecord) {
               return (
                  <Badges
                     label={SCALE_STATUS_LABELS[row.status]}
                     color="transparent"
                     className={getScaleStatusBadgeColor(row.status)}
                  />
               );
            },
         },
         {
            key: "date", label: "Fecha Pesaje",
            render(row: ScaleRecord) {
               return formatDate(row.date)
            }
         },
         {
            key: "start_time", label: "Hora Inicio",
            render(row: ScaleRecord) {
               return formatTime(row.start_time)
            }
         },
         {
            key: "end_time", label: "Hora Fin",
            render(row: ScaleRecord) {
               return formatTime(row.end_time)
            }
         },
         {
            key: "actions", label: "Acciones",
            render(row: ScaleRecord) {
               return (
                  <Button
                     type="button"
                     label={getScaleStatusActionLabel(row.status)}
                     size="small"
                     className={getScaleStatusButtonColor(row.status)}
                     onClick={() => handleOpenWeightModal(row)}
                  />
               );
            },
         },
      ],
      [handleOpenWeightModal],
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
                     url: "/",
                     onClick: (url) => navigate(url),
                  },
                  {
                     label: "Báscula",
                     url: "/warehouse-corinto/scale",
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <form
            onSubmit={() => { }}
            className="relative mx-auto w-[100%] rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">

            <ScaleBanner />

            {/* <div className="grid grid-cols-3 gap-4"> */}

            {/* <div className="h-fit col-span-3 rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">
                  <GeneralInformation />
               </div> */}

            {/* <div className="h-fit col-span-3 rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">
                  <RecordData />
               </div> */}

            {/* <div className="h-fit col-span-3 rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">
                  <DriverData />
               </div> */}

            {/* <div className="h-[200px] rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">

               </div> */}

            {/* <div className="h-[200px] rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">

               </div> */}

            {/* <div className="h-[200px] rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">

               </div> */}

            {/* <div className="h-[100px] col-span-3 rounded-xl border border-slate-200 bg-white shadow-slate-200/60 dark:border-neutral-700 p-6">

               </div> */}

            {/* </div> */}

            <div className="flex justify-between items-center mb-2">
               <div className="flex flex-col justify-center">
                  <h4 className="p-0! m-0!">Filtros</h4>
               </div>
            </div>

            <div
               onSubmit={() => { }}
               className="w-full flex flex-row gap-4 items-end justify-start mb-4">

               <div className="flex flex-col">
                  <InputText
                     label="Nombre conductor"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     type="text"
                     placeholder="Ingrese la identificación"
                     errorVariant="tooltip"
                  />
               </div>

               <div className="flex flex-col">
                  <InputText
                     label="Identificación"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     type="text"
                     placeholder="Ingrese la identificación"
                     errorVariant="tooltip"
                  />
               </div>

               <div className="flex flex-col w-[200px]">
                  <Button
                     type="submit"
                     size="giant"
                     disabled={false}
                     className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     label="Aplicar filtros"
                  />
               </div>

               <div className="flex flex-col w-[200px]">
                  <Button
                     type="button"
                     size="giant"
                     className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                     label="Limpiar filtros"
                     onClick={() => { }}
                  />
               </div>
            </div>

            <div className="flex flex-col">
               <DataTable
                  title="Lista de conductores"
                  data={scales}
                  columns={columns}
                  pagination={
                     <Pagination
                        currentPage={0}
                        pageSize={0}
                        totalRecords={0}
                        onPageChange={() => { }}
                        disabled={false}
                     />
                  }
               />
            </div>

            {/* <div className="flex flex-col gap-4">

               <div className="mt-4 flex flex-col gap-4 border-t border-slate-200 pt-4 dark:border-slate-600">

                  <div className="flex justify-center gap-4">

                     <Button
                        type="button"
                        label="Guardar"
                        size="giant"
                        onClick={() => { }}
                        isHiddenLabelOnMobile
                        className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     />

                     <Button
                        type="button"
                        label="Limpiar"
                        size="giant"
                        onClick={() => { }}
                        isHiddenLabelOnMobile
                        className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     />

                     <Button
                        type="button"
                        label="Imprimir Inicial"
                        size="giant"
                        onClick={() => { }}
                        isHiddenLabelOnMobile
                        className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     />

                     <Button
                        type="button"
                        label="Imprimir Final"
                        size="giant"
                        onClick={() => { }}
                        isHiddenLabelOnMobile
                        className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     />

                     <Button
                        type="button"
                        label="Obtener Peso Inicial"
                        size="giant"
                        onClick={() => { }}
                        isHiddenLabelOnMobile
                        className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     />

                     <Button
                        type="button"
                        label="Obtener Peso Final"
                        size="giant"
                        onClick={() => { }}
                        isHiddenLabelOnMobile
                        className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     />

                  </div>
               </div>
            </div>*/}

         </form>

         <WeightModal
            isOpen={isWeightModalOpen}
            onClose={handleCloseWeightModal}
            record={selectedRecord}
         />
      </m.div>
   );
};
