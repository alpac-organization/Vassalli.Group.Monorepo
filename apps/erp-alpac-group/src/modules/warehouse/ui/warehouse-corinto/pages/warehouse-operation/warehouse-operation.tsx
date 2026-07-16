import {
   Badges,
   Breadcrumb,
   Button,
   DataTable,
   InputText,
   Modal,
   Pagination,
   type TableColumn,
} from "@alpac/design-system";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";
import { m } from "framer-motion";
import { Warehouse } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UnloadingTimerModal } from "./components/unloading-timer-modal/unloading-timer-modal";
import type { ReceivingProps, ReceivingRecord, ReceivingStatus } from "./types/receiving.types";
import { MOCK_RECEIVING_RECORDS, WAREHOUSE_VISUAL_MOCK } from "../../mock/receiving-mocked-data";
import { TruckBanner } from "@app/shared/components/truck-banner/truck-banner";

const PAGE_SIZE = 10;

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

const RECEIVING_STATUS_LABELS: Record<ReceivingStatus, string> = {
   pending: "Pendiente ubicación",
   located: "Ubicado",
};

const getReceivingStatusBadgeColor = (status: ReceivingStatus): string => {
   switch (status) {
      case "pending":
         return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
      case "located":
         return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
      default:
         return "bg-slate-100 text-slate-800";
   }
};

const WAREHOUSE_STATUS_LABELS = {
   available: { label: "Disponible", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" },
   almost_full: { label: "Casi llena", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" },
   maintenance: { label: "Mantenimiento", className: "bg-slate-200 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400" },
} as const;

const formatWeight = (kg: number) =>
   `${kg.toLocaleString("es-NI", { maximumFractionDigits: 0 })} kg`;

const LoadSummaryItem = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
   <div>
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <p className={`m-0! text-sm! font-medium ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
         {value}
      </p>
   </div>
);

const WarehouseCard = ({ warehouse, isSelected, onSelect }: ReceivingProps) => {

   const isDisabled = warehouse.status === "maintenance";
   const status = WAREHOUSE_STATUS_LABELS[warehouse.status];

   return (
      <button
         type="button"
         disabled={isDisabled}
         onClick={onSelect}
         className={`w-full rounded-xl border p-4 text-left transition-all ${isDisabled
            ? "cursor-not-allowed border-slate-200 opacity-60 dark:border-neutral-700"
            : isSelected
               ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30 dark:border-emerald-600 dark:bg-emerald-900/20"
               : "border-slate-200 bg-white hover:border-emerald-400 dark:border-neutral-600 dark:bg-[#1f232b] dark:hover:border-emerald-600"
            }`}
      >
         <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
               <Warehouse size={18} className="text-slate-600 dark:text-slate-300" />
               <p className="m-0! text-sm! font-semibold text-slate-900 dark:text-white">{warehouse.name}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${status.className}`}>
               {status.label}
            </span>
         </div>

         <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
               className={`h-full rounded-full ${warehouse.occupancyPercent >= 90 ? "bg-red-500" : warehouse.occupancyPercent >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
               style={{ width: `${warehouse.occupancyPercent}%` }}
            />
         </div>

         <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Ocupación: {warehouse.occupancyPercent}%</span>
            <span>Disponible: {formatWeight(warehouse.availableKg)}</span>
         </div>

         {warehouse.products.length > 0 && (
            <p className="m-0! mt-2 text-xs text-slate-500 dark:text-slate-400">
               Productos: {warehouse.products.join(", ")}
            </p>
         )}
      </button>
   );
};

const SummaryCard = ({
   label,
   value,
   icon,
}: {
   label: string;
   value: string;
   icon: React.ReactNode;
}) => (
   <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-600 dark:bg-[#1f232b]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
         {icon}
      </div>
      <div>
         <p className="m-0! text-[11px]! font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {label}
         </p>
         <p className="m-0! text-sm! font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
   </div>
);

export const WarehouseOperation = () => {

   const navigate = useNavigate();

   const [page, setPage] = useState(1);
   const [records, setRecords] = useState(MOCK_RECEIVING_RECORDS);
   const [selectedRecord, setSelectedRecord] = useState<ReceivingRecord | null>(null);
   const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
   const [isUnloadingTimerModalOpen, setUnloadingTimerModalOpen] = useState(false);

   const [selectedWarehouseId, setSelectedWarehouseId] = useState("");

   const selectedWarehouse = useMemo(
      () => WAREHOUSE_VISUAL_MOCK.find((w) => w.id === selectedWarehouseId) ?? null,
      [selectedWarehouseId],
   );

   const receivingList = useMemo(
      () => records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      [page, records],
   );

   const handleOpenLocationModal = useCallback((record: ReceivingRecord) => {
      const warehouseMatch = WAREHOUSE_VISUAL_MOCK.find((w) => w.name === record.warehouse);

      setSelectedRecord(record);
      setSelectedWarehouseId(warehouseMatch?.id ?? "");
      setIsLocationModalOpen(true);
   }, []);

   const handleCloseLocationModal = useCallback(() => {
      setIsLocationModalOpen(false);
      setSelectedRecord(null);
      setSelectedWarehouseId("");
   }, []);

   const handleConfirmLocation = useCallback(() => {

      if (!selectedRecord || !selectedWarehouse) return;

      setUnloadingTimerModalOpen(true)

      /* setRecords((prev) =>
         prev.map((record) =>
            record.id === selectedRecord.id
               ? {
                  ...record,
                  status: "located" as const,
                  warehouse: selectedWarehouse.name,
               }
               : record,
         ),
      );

      handleCloseLocationModal(); */

   }, [
      // handleCloseLocationModal,
      selectedRecord,
      selectedWarehouse
   ]);

   const columns = useMemo<TableColumn<ReceivingRecord>[]>(
      () => [
         { key: "scaleTicket", label: "Ticket báscula" },
         { key: "licensePlate", label: "Placa" },
         { key: "driverName", label: "Conductor" },
         { key: "customer", label: "Cliente" },
         { key: "product", label: "Producto" },
         {
            key: "netWeightKg",
            label: "Peso neto",
            render(row) {
               return formatWeight(row.netWeightKg);
            },
         },
         {
            key: "weighedAt",
            label: "Fecha pesaje",
            render(row) {
               return formatDate(row.weighedAt);
            },
         },
         {
            key: "status",
            label: "Estado",
            render(row) {
               return (
                  <Badges
                     label={RECEIVING_STATUS_LABELS[row.status]}
                     color="transparent"
                     className={getReceivingStatusBadgeColor(row.status)}
                  />
               );
            },
         },
         {
            key: "actions",
            label: "Acciones",
            render(row) {
               return (
                  <Button
                     type="button"
                     label={row.status === "pending" ? "Asignar ubicación" : "Ver ubicación"}
                     size="small"
                     className={
                        row.status === "pending"
                           ? "text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                           : "text-[13px]! text-emerald-800! bg-emerald-100! dark:text-emerald-200! dark:bg-emerald-900/60!"
                     }
                     onClick={() => handleOpenLocationModal(row)}
                  />
               );
            },
         },
      ],
      [handleOpenLocationModal],
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
                  { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
                  {
                     label: "Bodega",
                     url: "/warehouse-corinto/receiving",
                     onClick: (url) => navigate(url),
                  },
               ]}
            />
         </div>

         <div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">            

            <TruckBanner title="Recepción en Bodega" subTitle="Gestión de bodegas" />

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">               
               <SummaryCard
                  label="Inspector en turno"
                  value="Donald José Munguía"
                  icon={<Warehouse size={18} />}
               />               
            </div>

            <div className="mb-2 flex items-center justify-between">
               <h4 className="m-0! p-0!">Filtros</h4>
            </div>

            <div className="mb-4 flex w-full flex-row flex-wrap items-end justify-start gap-4">
               <div className="flex min-w-[200px] flex-col">
                  <InputText
                     label="Placa"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     type="text"
                     placeholder="Ej. M 123-456"
                     errorVariant="tooltip"
                  />
               </div>

               <div className="flex min-w-[200px] flex-col">
                  <InputText
                     label="Conductor"
                     className={inputClassName}
                     labelClassName={labelClassName}
                     type="text"
                     placeholder="Nombre del conductor"
                     errorVariant="tooltip"
                  />
               </div>

               <div className="flex w-[200px] flex-col">
                  <Button
                     type="button"
                     size="giant"
                     className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700!"
                     label="Aplicar filtros"
                  />
               </div>

               <div className="flex w-[200px] flex-col">
                  <Button
                     type="button"
                     size="giant"
                     className="w-full! rounded-md! bg-slate-500! text-[15px]! text-white! dark:bg-slate-700!"
                     label="Limpiar filtros"
                  />
               </div>
            </div>

            <DataTable
               title="Cargas listas para bodega"
               data={receivingList}
               columns={columns}
               pagination={
                  <Pagination
                     currentPage={page}
                     pageSize={PAGE_SIZE}
                     totalRecords={records.length}
                     onPageChange={setPage}
                     disabled={false}
                  />
               }
            />
         </div>

         <Modal
            isOpen={isLocationModalOpen}
            onClose={handleCloseLocationModal}
            size="5xl"
            title="Asignar bodega"
            description="Seleccione la bodega donde se almacenará la carga"
            variant="form"
         >
            {selectedRecord && (
               <div className="flex flex-col gap-5">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-neutral-600 dark:bg-[#1f232b]">
                     <p className="m-0! mb-3! text-[11px]! font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Resumen de la carga
                     </p>
                     <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        <LoadSummaryItem label="Ticket de báscula" value={selectedRecord.scaleTicket} />
                        <LoadSummaryItem label="Peso neto" value={formatWeight(selectedRecord.netWeightKg)} highlight />
                        <LoadSummaryItem label="Cliente" value={selectedRecord.customer} />
                        <LoadSummaryItem label="Exportador" value={selectedRecord.exporter} />
                        <LoadSummaryItem label="Producto" value={selectedRecord.product} />
                        <LoadSummaryItem label="Presentación" value={selectedRecord.presentation} />
                        <LoadSummaryItem label="Placa cabezal" value={selectedRecord.licensePlate} />
                        <LoadSummaryItem label="Placa remolque" value={selectedRecord.trailerPlate} />
                        <LoadSummaryItem label="Conductor" value={selectedRecord.driverName} />
                        <LoadSummaryItem label="Lote / Zafra" value={selectedRecord.lotOrZafra} />
                        <LoadSummaryItem
                           label="Pesado el"
                           value={`${formatDate(selectedRecord.weighedAt)} · ${formatTime(selectedRecord.weighedAt)}`}
                        />
                     </div>
                  </div>

                  <div>
                     <h5 className="m-0! mb-3! text-black! dark:text-white!">Seleccionar bodega</h5>
                     <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {WAREHOUSE_VISUAL_MOCK.map((warehouse) => (
                           <WarehouseCard
                              key={warehouse.id}
                              warehouse={warehouse}
                              isSelected={selectedWarehouseId === warehouse.id}
                              onSelect={() => setSelectedWarehouseId(warehouse.id)}
                           />
                        ))}
                     </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-neutral-600">
                     <Button
                        type="button"
                        label="Cancelar"
                        size="medium"
                        onClick={handleCloseLocationModal}
                        className="text-[14px]! bg-slate-500! text-white! dark:bg-slate-700!"
                     />
                     <Button
                        type="button"
                        label="Confirmar bodega"
                        size="medium"
                        disabled={!selectedWarehouse}
                        onClick={handleConfirmLocation}
                        className="text-[14px]! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700!"
                     />
                  </div>
               </div>
            )}
         </Modal>
         <UnloadingTimerModal
            isOpen={isUnloadingTimerModalOpen}
            onClose={() => setUnloadingTimerModalOpen(false)}
         />
      </m.div>
   );
};
