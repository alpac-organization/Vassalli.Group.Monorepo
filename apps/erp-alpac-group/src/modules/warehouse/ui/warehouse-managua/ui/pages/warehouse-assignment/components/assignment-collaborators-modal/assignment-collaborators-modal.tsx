import { useCallback, useMemo, useState } from "react";
import {
  Button,
  DataTable,
  Dropdown,
  Modal,
  Pagination,
  type Option,
} from "@alpac/design-system";
import { Plus, Users, X } from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import type { AssignmentCollaboratorDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import {
  AssignmentCollaboratorRole,
  AssignmentCollaboratorRoleOptions,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import { getAssignmentCollaboratorsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-collaborators-modal/assignment-collaborators-columns";
import { dropdownClassName, labelClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface AssignmentCollaboratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationalOrderId: string | null;
  assignment: AssignmentOperationalDto | null;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
}

const PAGE_SIZE = 10;

export function AssignmentCollaboratorsModal({
  isOpen,
  onClose,
  operationalOrderId,
  assignment,
  onSuccess,
}: AssignmentCollaboratorsModalProps) {
  const { companyId, moduleCode, branchId } = useUserStore();
  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState("");
  const [selectedRole, setSelectedRole] =
    useState<AssignmentCollaboratorRole>("WarehouseAssistant");

  const resolvedOrderId =
    assignment?.operational_order_id || operationalOrderId;
  const resolvedAssignmentId = assignment?.assignment_id;

  const resetForm = () => {
    setSelectedCollaboratorId("");
    setSelectedRole("WarehouseAssistant");
    setPageNumber(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Consulta de colaboradores asignados
  const payloadCollaborators = useMemo(() => {
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

  const {
    GetAssignmentCollaborators,
    AssignCollaborators,
    DeleteAssignmentCollaborator,
  } = useWarehouseAssignment({
    payloadCollaborators,
  });

  const {
    data: collaboratorsData,
    isLoading,
    isFetching,
  } = GetAssignmentCollaborators;

  // Cargar catálogo de colaboradores de la empresa para el selector filtrado por branch_id de useUserStore
  const { GetCollaboratorsQuery } = useCollaborators({
    Collaboratorsfilters: {
      company_id: companyId,
      module_code: moduleCode,
      branch_id: branchId,
      page_number: 1,
      page_size: 50,
    },
  });

  const availableCollaboratorOptions: Option[] = useMemo(() => {
    const rawList = GetCollaboratorsQuery.data?.data ?? [];
    return rawList.map((c) => {
      const label = c.full_name 
      return {
        value: c.collaborator_id,
        label,
      };
    });
  }, [GetCollaboratorsQuery.data]);

  const items = collaboratorsData?.data ?? [];
  const totalRecords = collaboratorsData?.total ?? 0;

  // Asignar colaborador
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedOrderId || !resolvedAssignmentId || !selectedCollaboratorId) {
      return;
    }

    try {
      await AssignCollaborators.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: resolvedOrderId,
        assignment_id: resolvedAssignmentId,
        collaborators: [selectedCollaboratorId],
        role: selectedRole,
      });

      setSelectedCollaboratorId("");
      handleRequestSuccess("Colaborador asignado correctamente");
      onSuccess?.("Colaborador asignado correctamente");
    } catch {
      		const mappedError = getMappedError(
			AssignCollaborators.error as ApiErrorResponse,
		);
		handleRequestError(mappedError.description);
    }
  };

  // Desasignar colaborador
  const handleDelete = useCallback(
    async (collaborator: AssignmentCollaboratorDto) => {
      if (!resolvedOrderId || !resolvedAssignmentId) return;

      try {
        await DeleteAssignmentCollaborator.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          operational_order_id: resolvedOrderId,
          assignment_id: resolvedAssignmentId,
          assignment_collaborator_id: collaborator.assignment_collaborator_id,
        });

        handleRequestSuccess("Colaborador desasignado correctamente");
        onSuccess?.("Colaborador desasignado correctamente");
      } catch {
        		const mappedError = getMappedError(
			DeleteAssignmentCollaborator.error as ApiErrorResponse,
		);
		handleRequestError(mappedError.description);
      }
    },
    [
      resolvedOrderId,
      resolvedAssignmentId,
      companyId,
      moduleCode,
      DeleteAssignmentCollaborator,
      getMappedError,
      handleRequestSuccess,
      handleRequestError,
      onSuccess,
    ],
  );

  const columns = useMemo(
    () =>
      getAssignmentCollaboratorsColumns({
        onDelete: handleDelete,
        isDeleting: DeleteAssignmentCollaborator.isPending,
      }),
    [handleDelete, DeleteAssignmentCollaborator.isPending],
  );

  return (
    <Modal
      isOpen={isOpen && Boolean(assignment)}
      onClose={handleClose}
      variant="default"
      size="6xl"
      title={`Colaboradores — ${assignment?.merchandise || "Asignación"}`}
      description="Gestiona y asigna los colaboradores operativos encargados del descargue o traslado."
      panelClassName="flex max-h-[min(94dvh,54rem)] flex-col overflow-hidden !mx-2 !my-2 sm:!mx-4 sm:!my-6 rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        {AlertComponent}

        {/* Formulario compacto de Asignación Rápida */}
        <form
          onSubmit={handleAssign}
          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 shrink-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5 flex flex-col min-w-0">
              <Dropdown
                appearance="dark"
                label="Colaborador"
                isRequired
                labelClassName={labelClassName}
                placeholder="Seleccionar colaborador..."
                options={availableCollaboratorOptions}
                value={selectedCollaboratorId || undefined}
                onChange={(val) => setSelectedCollaboratorId(String(val || ""))}
                className={dropdownClassName}
              />
            </div>

            <div className="sm:col-span-4 flex flex-col min-w-0">
              <Dropdown
                appearance="dark"
                label="Rol Operativo"
                isRequired
                labelClassName={labelClassName}
                placeholder="Seleccionar rol..."
                options={AssignmentCollaboratorRoleOptions}
                value={selectedRole}
                onChange={(val) =>
                  setSelectedRole(
                    (val as AssignmentCollaboratorRole) ||
                      AssignmentCollaboratorRole.WarehouseAssistant,
                  )
                }
                className={dropdownClassName}
              />
            </div>

            <div className="sm:col-span-3 flex flex-col min-w-0">
              <Button
                type="submit"
                size="giant"
                label="Asignar Colaborador"
                icon={<Plus size={18} />}
                disabled={!selectedCollaboratorId || AssignCollaborators.isPending}
                isLoading={AssignCollaborators.isPending}
                className="w-full text-[14px]! rounded-md! bg-alpac-primary-500 text-white! hover:bg-alpac-primary-600! disabled:opacity-50!"
              />
            </div>
          </div>
        </form>

        {/* Sección: Tabla de Colaboradores Asignados con altura completa */}
        <div className="scrollbar-dashboard flex-1 min-h-0 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="px-3 py-16 text-center">
              <Loader title="Cargando colaboradores asignados..." />
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <Users className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-medium">
                No hay colaboradores asignados a esta operación.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Utiliza el selector superior para asignar auxiliares o montacarguistas.
              </p>
            </div>
          ) : (
            <DataTable
              title={`Colaboradores Asignados (${totalRecords})`}
              data={items}
              columns={columns}
              pagination={
                <Pagination
                  currentPage={collaboratorsData?.page_number ?? pageNumber}
                  pageSize={collaboratorsData?.page_size ?? PAGE_SIZE}
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
