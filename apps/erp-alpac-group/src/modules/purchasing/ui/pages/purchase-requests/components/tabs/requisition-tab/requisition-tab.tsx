import { useCallback, useMemo, useState } from "react";
import { Button, ContextMenu, DataTable, Dropdown, InputText, Pagination, type TableColumn } from "@alpac/design-system";
import { PackagePlusIcon } from "lucide-react";
import { PurchaseRequestModal } from "../../purchase-request-modal/purchase-request-modal";
import type { RequisitionTabProps } from "./requisition-tab.types";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

export const RequisitionTab = ({ currentBranchId, onRequestError, onRequestSuccess }: RequisitionTabProps) => {

   const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
   const [requisitionNumber, setRequisitionNumber] = useState("");
   const [requesterName, setRequesterName] = useState("");
   const [status, setStatus] = useState<string>("");
   const [currentPage, setCurrentPage] = useState(1);

   const totalRecords = 0;

   const handleClearFilters = () => {
      setRequisitionNumber("");
      setRequesterName("");
      setStatus("");
      setCurrentPage(1);
   };

   const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
   }, []);

   const onEditRequisition = (data: any) => {
      setIsRequisitionModalOpen(true);
   };

   const onViewDetails = (data: any) => {
      console.log(data);
   };



   const columnConfig: TableColumn<any>[] = useMemo(
      () => [
         { key: "requisition_number", label: "N° Requisición" },
         { key: "requester_name", label: "Solicitante" },
         { key: "area_name", label: "Área" },
         { key: "required_date", label: "Fecha límite" },
         { key: "status", label: "Estado" },
         {
            key: "actions",
            label: "Acciones",
            render: (row: any) => (
               <ContextMenu
                  items={[
                     { label: "Editar", onClick: () => onEditRequisition(row) },
                     { label: "Ver detalle", onClick: () => onViewDetails(row) },
                  ]}
               />
            ),
         },
      ],
      [],
   );

   return (
      <div>
         <Button
            type="button"
            size="giant"
            label="Crear Requisición"
            icon={<PackagePlusIcon size={20} />}
            className="w-full! md:w-auto! mb-4! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => {
               setIsRequisitionModalOpen(true);
            }}
         />

         <div className="flex justify-between items-center pt-4 pb-4 border-t border-t-slate-600 dark:border-t-neutral-600">
            <div className="flex flex-col justify-center">
               <h3 className="p-0! m-0!">Filtros</h3>
            </div>
         </div>

         <form
            onSubmit={(event) => {
               event.preventDefault();
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end mb-4!"
         >
            <InputText
               label="N° Requisición"
               placeholder="Ej. REQ-2026-001"
               className={inputClassName}
               labelClassName={labelClassName}
               value={requisitionNumber}
               onChange={(event) => setRequisitionNumber(event.target.value)}
            />

            <InputText
               label="Solicitante"
               placeholder="Ej. Juan Pérez"
               className={inputClassName}
               labelClassName={labelClassName}
               value={requesterName}
               onChange={(event) => setRequesterName(event.target.value)}
            />

            <Dropdown
               label="Estado"
               placeholder="Seleccione..."
               appearance="dark"
               options={[]}
               value={status}
               onChange={(value) => setStatus(String(value))}
               className={dropdownClassName}
               labelClassName={labelClassName}
               valueClassName={labelClassName}
            />

            <Button
               type="submit"
               size="giant"
               label="Aplicar filtros"
               className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />

            <Button
               type="button"
               size="giant"
               label="Limpiar filtros"
               onClick={handleClearFilters}
               className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            />
         </form>

         <div className="flex flex-col">
            <DataTable
               title="Lista de requisiciones"
               data={[]}
               columns={columnConfig}
               pagination={
                  <Pagination
                     currentPage={currentPage}
                     pageSize={PAGE_SIZE}
                     totalRecords={totalRecords}
                     onPageChange={handlePageChange}
                  />
               }
            />
         </div>

         <PurchaseRequestModal
            isOpen={isRequisitionModalOpen}
            onClose={() => {
               setIsRequisitionModalOpen(false);
            }}
            onSubmit={(_payload) => {
               setIsRequisitionModalOpen(false);
               onRequestSuccess("Requisición guardada correctamente.");
            }}
            onRequestError={onRequestError}
            currentBranchId={currentBranchId}
            requestType={PurchaseRequestEnum.Requisition}
         />

      </div>
   );
} 