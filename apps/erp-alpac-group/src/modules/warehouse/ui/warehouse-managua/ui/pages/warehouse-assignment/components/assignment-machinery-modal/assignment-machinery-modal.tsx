import { useCallback, useMemo, useState } from "react";
import {
  Button,
  DataTable,
  Dropdown,
  InputText,
  Modal,
  Pagination,
  type Option,
} from "@alpac/design-system";
import { Plus, Truck, X } from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import type { AssignmentMachineryDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-machinery";
import { getAssignmentMachineryColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-machinery-modal/assignment-machinery-columns";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface AssignmentMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationalOrderId: string | null;
  assignment: AssignmentOperationalDto | null;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

const PAGE_SIZE = 10;

export function AssignmentMachineryModal({
  isOpen,
  onClose,
  operationalOrderId,
  assignment,
  onSuccess,
}: AssignmentMachineryModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedMachineryId, setSelectedMachineryId] = useState("");
  const [concept, setConcept] = useState("");

  const resolvedOrderId =
    assignment?.operational_order_id || operationalOrderId;
  const resolvedAssignmentId = assignment?.assignment_id;

  const resetForm = () => {
    setSelectedMachineryId("");
    setConcept("");
    setPageNumber(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const payloadMachinery = useMemo(() => {
    if (!isOpen || !resolvedOrderId || !resolvedAssignmentId) return null;
    return {
      company_id: companyId,
      module_code: moduleCode,
      operational_order_id: resolvedOrderId,
      assignment_id: resolvedAssignmentId,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
    };
  }, [
    isOpen,
    resolvedOrderId,
    resolvedAssignmentId,
    companyId,
    moduleCode,
    pageNumber,
  ]);

  const payloadMachineryCatalog = useMemo(() => {
    if (!isOpen) return null;
    return {
      company_id: companyId,
      module_code: moduleCode,
      page_size: 20,
    };
  }, [isOpen, companyId, moduleCode]);

  const {
    GetAssignmentMachinery,
    GetMachineryCatalog,
    AssignMachinery,
    DeleteAssignmentMachinery,
  } = useWarehouseAssignment({
    payloadMachinery,
    payloadMachineryCatalog,
  });

  const {
    data: machineryData,
    isLoading,
    isFetching,
  } = GetAssignmentMachinery;

  const machineryCatalogOptions: Option[] = useMemo(() => {
    const rawList = GetMachineryCatalog.data?.data ?? [];
    return rawList.map((m) => {
      const code = (m.code || (m as unknown as { Code?: string }).Code || "").trim();
      const brand = (m.brand || (m as unknown as { Brand?: string }).Brand || "").trim();
      const model = (m.model || (m as unknown as { Model?: string }).Model || "").trim();

      const parts = [code, brand, model].filter(Boolean);
      const label =
        parts.length > 0 ? parts.join(" - ") : m.code || "Maquinaria";

      return {
        value: m.machinery_id,
        label,
      };
    });
  }, [GetMachineryCatalog.data]);

  const items = machineryData?.data ?? [];
  const totalRecords = machineryData?.total ?? 0;

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedOrderId || !resolvedAssignmentId || !selectedMachineryId) {
      return;
    }

    try {
      await AssignMachinery.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: resolvedOrderId,
        assignment_id: resolvedAssignmentId,
        machinery: [selectedMachineryId],
        concept: concept.trim() || undefined,
      });

      setSelectedMachineryId("");
      setConcept("");
      handleRequestSuccess("Maquinaria asignada correctamente");
      onSuccess?.("Maquinaria asignada correctamente");
    } catch{
      		const mappedError = getMappedError(
			AssignMachinery.error as ApiErrorResponse,
		);
		handleRequestError(mappedError.description);

    }
  };

  const handleDelete = useCallback(
    async (machineryItem: AssignmentMachineryDto) => {
      if (!resolvedOrderId || !resolvedAssignmentId) return;

      try {
        await DeleteAssignmentMachinery.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          operational_order_id: resolvedOrderId,
          assignment_id: resolvedAssignmentId,
          assignment_machinery_id: machineryItem.assignment_machinery_id,
        });

        handleRequestSuccess("Maquinaria desasignada correctamente");
        onSuccess?.("Maquinaria desasignada correctamente");
      } catch {
        		const mappedError = getMappedError(
			DeleteAssignmentMachinery.error as ApiErrorResponse,
		);
		handleRequestError(mappedError.description);
      }
    },
    [
      resolvedOrderId,
      resolvedAssignmentId,
      companyId,
      moduleCode,
      DeleteAssignmentMachinery,
      getMappedError,
      handleRequestSuccess,
      handleRequestError,
      onSuccess,
    ],
  );

  const columns = useMemo(
    () =>
      getAssignmentMachineryColumns({
        onDelete: handleDelete,
        isDeleting: DeleteAssignmentMachinery.isPending,
      }),
    [handleDelete, DeleteAssignmentMachinery.isPending],
  );

  return (
    <Modal
      isOpen={isOpen && Boolean(assignment)}
      onClose={handleClose}
      variant="default"
      size="6xl"
      title={`Maquinaria — ${assignment?.merchandise || "Asignación"}`}
      description="Gestiona y asigna los equipos operativos para las labores de descarga o traslado."
      panelClassName="flex max-h-[min(94dvh,54rem)] flex-col overflow-hidden !mx-2 !my-2 sm:!mx-4 sm:!my-6 rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        {AlertComponent}
        <form
          onSubmit={handleAssign}
          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 shrink-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5 flex flex-col min-w-0">
              {machineryCatalogOptions.length > 0 ? (
                <Dropdown
                  appearance="dark"
                  label="Maquinaria"
                  isRequired
                  labelClassName={labelClassName}
                  placeholder="Seleccionar maquinaria..."
                  options={machineryCatalogOptions}
                  value={selectedMachineryId || undefined}
                  onChange={(val) => setSelectedMachineryId(String(val || ""))}
                  className={dropdownClassName}
                />
              ) : (
                <InputText
                  label="Código de Maquinaria"
                  isRequired
                  labelClassName={labelClassName}
                  placeholder="Ingresar código de maquinaria"
                  value={selectedMachineryId}
                  onChange={(e) => setSelectedMachineryId(e.target.value)}
                  className={inputClassName}
                />
              )}
            </div>

            <div className="sm:col-span-4 flex flex-col min-w-0">
              <InputText
                label="Concepto Operativo (Opcional)"
                labelClassName={labelClassName}
                placeholder="Ej. Carga inicial / Descargue"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div className="sm:col-span-3 flex flex-col min-w-0">
              <Button
                type="submit"
                size="giant"
                label="Asignar Maquinaria"
                icon={<Plus size={18} />}
                disabled={!selectedMachineryId || AssignMachinery.isPending}
                isLoading={AssignMachinery.isPending}
                className="w-full text-[14px]! rounded-md! bg-alpac-primary-500 text-white! hover:bg-alpac-primary-600! disabled:opacity-50!"
              />
            </div>
          </div>
        </form>

        <div className="scrollbar-dashboard flex-1 min-h-0 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="px-3 py-16 text-center">
              <Loader title="Cargando maquinaria asignada..." />
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <Truck className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium">
                No hay maquinaria asignada a esta operación.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Utiliza el selector superior para asignar montacargas o equipos.
              </p>
            </div>
          ) : (
            <DataTable
              title={`Maquinaria Asignada (${totalRecords})`}
              data={items}
              columns={columns}
              pagination={
                <Pagination
                  currentPage={machineryData?.page_number ?? pageNumber}
                  pageSize={machineryData?.page_size ?? PAGE_SIZE}
                  totalRecords={totalRecords}
                  onPageChange={setPageNumber}
                  disabled={isFetching}
                />
              }
            />
          )}
        </div>

        {/* Separador de footer */}
        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mt-2 shrink-0" />

        {/* Footer */}
        <div className="flex justify-end pt-2 shrink-0">
          <Button
            type="button"
            size="giant"
            label="Cerrar"
            icon={<X size={18} />}
            className="w-full sm:w-auto text-[14px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
            onClick={handleClose}
          />
        </div>
      </div>
    </Modal>
  );
}
