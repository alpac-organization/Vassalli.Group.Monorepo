

import { useCallback, useEffect, useMemo, useState } from "react";
import {
   Button,
   Checkbox,
   DataTable,
   InputText,
   Modal,
   Pagination,
   RadioButton,
   type TableColumn,
} from "@alpac/design-system";
import type {
   SelectableCustomer,
   SelectCustomerModalProps,
} from "@app/modules/customer/ui/views/select-customer-modal/select-customer-modal.types";
import { useCustomer } from "@app/modules/customer/ui/hooks/useCustomer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";

const PAGE_SIZE = 5;

const primaryButtonClassName =
   "text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
   "text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";
const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

export function SelectCustomerModal({
   isOpen,
   onClose,
   onSelect,
   selectionType = "single",
   excludeCustomerIds = [],
}: SelectCustomerModalProps) {
   const { companyId, moduleCode } = useUserStore();
   const { GetCustomer } = useCustomer();

   const [error, setError] = useState("");
   const [pageNumber, setPageNumber] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const [appliedSearch, setAppliedSearch] = useState("");
   const [tempSelected, setTempSelected] = useState<SelectableCustomer | null>(null);
   const [tempSelectedMultiple, setTempSelectedMultiple] = useState<SelectableCustomer[]>([]);

   const customersQuery = GetCustomer(
      {
         company_id: companyId,
         module_code: moduleCode,
      },
      { enabled: Boolean(isOpen && companyId && moduleCode) },
   );

   const registeredCustomers = useMemo(() => {

      const records = customersQuery.data?.data ?? [];
      if (!Array.isArray(records)) return [];

      const excluded = new Set(excludeCustomerIds);
      const available = records.filter((customer) => !excluded.has(customer.customer_id));

      const term = appliedSearch.trim().toLowerCase();
      if (!term) return available;

      return available.filter((customer) => {
         const name = (customer.legal_name ?? "").toLowerCase();
         const identification = (customer.identification_number ?? "").toLowerCase();
         const cif = (customer.cif ?? "").toLowerCase();
         const code = (customer.customer_code ?? "").toLowerCase();
         return (
            name.includes(term) ||
            identification.includes(term) ||
            cif.includes(term) ||
            code.includes(term)
         );
      });
   }, [customersQuery.data, excludeCustomerIds, appliedSearch]);

   const totalRecords = registeredCustomers.length;

   const paginatedCustomers = useMemo(() => {
      const start = (pageNumber - 1) * PAGE_SIZE;
      return registeredCustomers.slice(start, start + PAGE_SIZE);
   }, [registeredCustomers, pageNumber]);

   useEffect(() => {
      if (!isOpen) {
         setError("");
         setPageNumber(1);
         setSearchTerm("");
         setAppliedSearch("");
         setTempSelected(null);
         setTempSelectedMultiple([]);
      }
   }, [isOpen]);

   const handlePageChange = useCallback((page: number) => {
      setPageNumber(page);
   }, []);

   const handleClose = () => {
      setError("");
      setPageNumber(1);
      setSearchTerm("");
      setAppliedSearch("");
      setTempSelected(null);
      setTempSelectedMultiple([]);
      onClose();
   };

   const handleToggleMultipleSelection = (customer: SelectableCustomer) => {
      setError("");
      setTempSelectedMultiple((prev) => {
         const alreadySelected = prev.some(
            (item) => item.customer_id === customer.customer_id,
         );

         if (alreadySelected) {
            return prev.filter((item) => item.customer_id !== customer.customer_id);
         }

         return [...prev, customer];
      });
   };

   const handleConfirm = () => {
      if (selectionType === "multiple") {
         if (tempSelectedMultiple.length === 0) {
            setError("Seleccione al menos un cliente registrado.");
            return;
         }

         onSelect(tempSelectedMultiple);
         handleClose();
         return;
      }

      if (!tempSelected) {
         setError("Seleccione un cliente registrado.");
         return;
      }

      onSelect([tempSelected]);
      handleClose();
   };

   const onClearFilters = () => {
      setSearchTerm("");
      setAppliedSearch("");
      setPageNumber(1);
   };

   const columnConfig: TableColumn<SelectableCustomer>[] = useMemo(
      () => [
         {
            key: "select",
            label: "",
            render: (row) =>
               selectionType === "single" ? (
                  <RadioButton
                     name="select-customer-single"
                     checked={tempSelected?.customer_id === row.customer_id}
                     onChange={() => {
                        setError("");
                        setTempSelected(row);
                     }}
                     aria-label={`Seleccionar ${row.legal_name || row.customer_id}`}
                  />
               ) : (
                  <Checkbox
                     name="select-customer-multiple"
                     checked={tempSelectedMultiple.some(
                        (item) => item.customer_id === row.customer_id,
                     )}
                     onChange={() => handleToggleMultipleSelection(row)}
                     aria-label={`Seleccionar ${row.legal_name || row.customer_id}`}
                  />
               ),
         },
         {
            key: "legal_name",
            label: "Razón social",
            render: (row) => row.legal_name || "—",
         },
         {
            key: "customer_code",
            label: "Código",
            render: (row) => row.customer_code || "—",
         },
         {
            key: "cif",
            label: "CIF",
            render: (row) => row.cif || "—",
         },
         {
            key: "customer_type",
            label: "Tipo cliente",
            render: (row) => row.customer_type || "—",
         },
         {
            key: "identification_number",
            label: "Identificación",
            render: (row) => row.identification_number || "—",
         },
         {
            key: "identification_type",
            label: "Tipo ID",
            render: (row) => row.identification_type || "—",
         },
      ],
      [selectionType, tempSelected, tempSelectedMultiple],
   );

   const isLoadingCustomers =
      customersQuery.isPending || customersQuery.isFetching;

   const hasSelection =
      selectionType === "multiple"
         ? tempSelectedMultiple.length > 0
         : Boolean(tempSelected);

   const isConfirmDisabled =
      isLoadingCustomers || paginatedCustomers.length === 0 || !hasSelection;

   const selectedCount =
      selectionType === "multiple"
         ? tempSelectedMultiple.length
         : Number(Boolean(tempSelected));

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         variant="form"
         size="5xl"
         title="Seleccionar cliente"
         description={
            selectionType === "multiple"
               ? "Elija uno o más clientes registrados."
               : "Elija un cliente registrado."
         }
      >
         {isLoadingCustomers && <Loader title="Cargando clientes..." />}

         <div className="flex flex-col gap-6">
            {error ? (
               <p className="m-0 text-sm text-red-500 dark:text-red-400">{error}</p>
            ) : null}

            <div className="w-full min-w-0">
               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     setPageNumber(1);
                     setAppliedSearch(searchTerm);
                  }}
                  className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
               >
                  <InputText
                     label="Buscar cliente"
                     labelClassName="text-black! dark:text-white!"
                     placeholder="Nombre o identificación..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className={inputClassName}
                  />

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                     <Button
                        type="submit"
                        size="giant"
                        className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                        label="Aplicar filtros"
                     />
                     <Button
                        type="button"
                        size="giant"
                        className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
                        label="Limpiar filtros"
                        onClick={onClearFilters}
                     />
                  </div>
               </form>
            </div>

            <DataTable
               title={selectedCount > 0 ? `Clientes (${selectedCount} ${selectedCount === 1 ? "seleccionado" : "seleccionados"})` : "Clientes"}
               data={paginatedCustomers}
               columns={columnConfig}
               pagination={
                  <Pagination
                     currentPage={pageNumber}
                     pageSize={PAGE_SIZE}
                     totalRecords={totalRecords}
                     onPageChange={handlePageChange}
                  />
               }
            />

            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  className={`${secondaryButtonClassName} w-full! sm:w-auto!`}
                  onClick={handleClose}
               />
               <Button
                  type="button"
                  size="giant"
                  label="Seleccionar"
                  disabled={isConfirmDisabled}
                  className={`${primaryButtonClassName} w-full! sm:w-auto!`}
                  onClick={handleConfirm}
               />
            </div>
         </div>
      </Modal>
   );
}
