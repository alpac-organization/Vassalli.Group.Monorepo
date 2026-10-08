import { useCallback, useMemo, useState } from "react";
import {
  Button,
  DataTable,
  Dropdown,
  Modal,
  Pagination,
  type Option,
} from "@alpac/design-system";
import { Plus, X } from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import {
  AssignmentOperationalStatus,
  AssignmentOperationalStatusLabels,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import { getAssignmentsListColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignments-list-modal/assignments-list-columns";
import { AssignmentDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-detail-modal/assignment-detail-modal";
import { CreateAssignmentModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-form-modal/create-assignment-modal";
import { UpdateAssignmentModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-form-modal/update-assignment-modal";
import { DeleteAssignmentModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-form-modal/delete-assignment-modal";
import { AssignmentCollaboratorsModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-collaborators-modal/assignment-collaborators-modal";
import { AssignmentMachineryModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-machinery-modal/assignment-machinery-modal";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { dropdownClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface AssignmentsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OperationalOrderListItem | null;
  onAlertSuccess?: (message: string) => void;
  onAlertError?: (message: string) => void;
}

const PAGE_SIZE = 10;

const statusFilterOptions: Option[] = [
  { value: "", label: "Todos los estados" },
  {
    value: String(AssignmentOperationalStatus.None),
    label:AssignmentOperationalStatusLabels[AssignmentOperationalStatus.None
      ],
  },
  {
    value: String(AssignmentOperationalStatus.Pending),
    label:
      AssignmentOperationalStatusLabels[AssignmentOperationalStatus.Pending],
  },
  {
    value: String(AssignmentOperationalStatus.InProgress),
    label:
      AssignmentOperationalStatusLabels[
        AssignmentOperationalStatus.InProgress
      ],
  },
  {
    value: String(AssignmentOperationalStatus.OnHold),
    label:
      AssignmentOperationalStatusLabels[AssignmentOperationalStatus.OnHold],
  },
  {
    value: String(AssignmentOperationalStatus.Downloaded),
    label:
      AssignmentOperationalStatusLabels[
        AssignmentOperationalStatus.Downloaded
      ],
  },
];

export function AssignmentsListModal({
  isOpen,
  onClose,
  order,
  onAlertSuccess,
  onAlertError,
}: AssignmentsListModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentOperationalDto | null>(null);
  const [deletingAssignment, setDeletingAssignment] =
    useState<AssignmentOperationalDto | null>(null);
  const [collaboratorsAssignment, setCollaboratorsAssignment] =
    useState<AssignmentOperationalDto | null>(null);
  const [machineryAssignment, setMachineryAssignment] =
    useState<AssignmentOperationalDto | null>(null);

  const { getMappedError } = useMappedError();

  const operationalOrderId = order?.operation_order_id;

  const [prevOrderId, setPrevOrderId] = useState(operationalOrderId);
  if (operationalOrderId !== prevOrderId) {
    setPrevOrderId(operationalOrderId);
    setStatusFilter("");
    setPageNumber(1);
  }

  const handleClose = useCallback(() => {
    setStatusFilter("");
    setPageNumber(1);
    setIsCreateOpen(false);
    setSelectedDetailId(null);
    setEditingAssignment(null);
    setDeletingAssignment(null);
    setCollaboratorsAssignment(null);
    setMachineryAssignment(null);
    onClose();
  }, [onClose]);

  const payloadAssignments = useMemo(() => {
    if (!isOpen || !operationalOrderId) return null;
    return {
      company_id: companyId,
      module_code: moduleCode,
      operational_order_id: operationalOrderId,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      status: statusFilter !== "" ? Number(statusFilter) : undefined,
    };
  }, [
    isOpen,
    operationalOrderId,
    companyId,
    moduleCode,
    pageNumber,
    statusFilter,
  ]);

  const { GetAssignments, SendToUnloading } = useWarehouseAssignment({
    payloadAssignments,
  });

  const { data: assignmentsData, isLoading, isFetching } =
    GetAssignments;

  const items = useMemo(() => {
    return assignmentsData?.data ?? [];
  }, [assignmentsData]);

  const totalRecords = assignmentsData?.total ?? 0;

  const handleViewDetail = useCallback(
    (assignment: AssignmentOperationalDto) => {
      if (assignment.assignment_id) {
        setSelectedDetailId(assignment.assignment_id);
      }
    },
    [],
  );

  const handleEdit = useCallback(
    (assignment: AssignmentOperationalDto) => {
      if (assignment.assignment_id) {
        setEditingAssignment(assignment);
      }
    },
    [],
  );

  const handleDelete = useCallback(
    (assignment: AssignmentOperationalDto) => {
      if (assignment.assignment_id) {
        setDeletingAssignment(assignment);
      }
    },
    [],
  );

  const handleManageCollaborators = useCallback(
    (assignment: AssignmentOperationalDto) => {
      setCollaboratorsAssignment(assignment);
    },
    [],
  );

  const handleManageMachinery = useCallback(
    (assignment: AssignmentOperationalDto) => {
      setMachineryAssignment(assignment);
    },
    [],
  );

  const handleSendToUnloading = useCallback(
    async (assignment: AssignmentOperationalDto) => {
      if (!operationalOrderId || !assignment.assignment_id) return;
      try {
        await SendToUnloading.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          operational_order_id: operationalOrderId,
          assignment_id: assignment.assignment_id,
        });
        onAlertSuccess?.(
          "Asignación operativa enviada a bodega para descarga exitosamente",
        );
      } catch (err: unknown) {
        const mapped = getMappedError(err as ApiErrorResponse);
        const errorMsg =
          mapped?.description ||
          "Error al enviar la asignación a bodega";
        onAlertError?.(errorMsg);
      }
    },
    [
      operationalOrderId,
      companyId,
      moduleCode,
      SendToUnloading,
      getMappedError,
      onAlertSuccess,
      onAlertError,
    ],
  );

  const columns = useMemo(
    () =>
      getAssignmentsListColumns({
        onViewDetail: handleViewDetail,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onManageCollaborators: handleManageCollaborators,
        onManageMachinery: handleManageMachinery,
        onSendToUnloading: handleSendToUnloading,
      }),
    [
      handleViewDetail,
      handleEdit,
      handleDelete,
      handleManageCollaborators,
      handleManageMachinery,
      handleSendToUnloading,
    ],
  );

  return (
    <>
      <Modal
        isOpen={isOpen && Boolean(order)}
        onClose={handleClose}
        variant="default"
        size="6xl"
        title={
          order?.po_code
            ? `Asignaciones — Orden ${order.po_code}`
            : "Asignaciones de Orden Operacional"
        }
        description="Consulta y administra las asignaciones operativas vinculadas a esta orden."
        panelClassName="flex max-h-[min(94dvh,52rem)] flex-col overflow-hidden !mx-2 !my-2 sm:!mx-4 sm:!my-6 rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
        contentClassName="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="w-56 sm:w-64">
              <Dropdown
                appearance="dark"
                placeholder="Filtrar por estado"
                options={statusFilterOptions}
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val != null ? String(val) : "");
                  setPageNumber(1);
                }}
                className={dropdownClassName}
              />
            </div>

            <Button
              type="button"
              size="giant"
              label="Nueva Asignación"
              icon={<Plus size={18} />}
              className="w-full sm:w-auto shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! hover:bg-alpac-primary-600!"
              onClick={() => setIsCreateOpen(true)}
            />
          </div>

          {/* Tabla de asignaciones */}
          <div className="scrollbar-dashboard flex-1 min-h-0 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="px-3 py-16 text-center">
                <Loader title="Cargando asignaciones..." />
              </div>
            ) : (
              <DataTable
                title="Listado de Asignaciones"
                data={items}
                columns={columns}
                pagination={
                  <Pagination
                    currentPage={assignmentsData?.page_number ?? pageNumber}
                    pageSize={assignmentsData?.page_size ?? PAGE_SIZE}
                    totalRecords={totalRecords}
                    onPageChange={setPageNumber}
                    disabled={isFetching}
                  />
                }
              />
            )}
          </div>

          {/* Separador de footer */}
          <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6 mt-2" />

          {/* Footer de la modal */}
          <div className="flex justify-end pt-2">
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

      {/* Modal: Detalle de Asignación */}
      <AssignmentDetailModal
        isOpen={Boolean(selectedDetailId)}
        onClose={() => setSelectedDetailId(null)}
        operationalOrderId={order?.operation_order_id ?? null}
        assignmentId={selectedDetailId}
        onManageCollaborators={() => {
          const item = items.find((x) => x.assignment_id === selectedDetailId);
          if (item) {
            setSelectedDetailId(null);
            setCollaboratorsAssignment(item);
          }
        }}
        onManageMachinery={() => {
          const item = items.find((x) => x.assignment_id === selectedDetailId);
          if (item) {
            setSelectedDetailId(null);
            setMachineryAssignment(item);
          }
        }}
        onSendToUnloading={handleSendToUnloading}
        isSendingToUnloading={SendToUnloading.isPending}
      />

      {/* Modal: Crear Asignación */}
      <CreateAssignmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        operationalOrderId={order?.operation_order_id ?? null}
        poCode={order?.po_code}
        onSuccess={() => {
          onAlertSuccess?.("Asignación operativa creada exitosamente");
        }}
        onError={(err) => {
          onAlertError?.(err);
        }}
      />

      {/* Modal: Editar Asignación */}
      <UpdateAssignmentModal
        isOpen={Boolean(editingAssignment)}
        onClose={() => setEditingAssignment(null)}
        operationalOrderId={order?.operation_order_id ?? null}
        assignment={editingAssignment}
        onSuccess={() => {
          onAlertSuccess?.("Asignación operativa actualizada exitosamente");
        }}
        onError={(err) => {
          onAlertError?.(err);
        }}
      />

      {/* Modal: Eliminar Asignación */}
      <DeleteAssignmentModal
        isOpen={Boolean(deletingAssignment)}
        onClose={() => setDeletingAssignment(null)}
        operationalOrderId={order?.operation_order_id ?? null}
        assignment={deletingAssignment}
        onSuccess={() => {
          onAlertSuccess?.("Asignación operativa eliminada exitosamente");
        }}
        onError={(err) => {
          onAlertError?.(err);
        }}
      />

      {/* Modal: Gestión de Colaboradores */}
      <AssignmentCollaboratorsModal
        isOpen={Boolean(collaboratorsAssignment)}
        onClose={() => setCollaboratorsAssignment(null)}
        operationalOrderId={order?.operation_order_id ?? null}
        assignment={collaboratorsAssignment}
        onSuccess={(msg) => {
          onAlertSuccess?.(msg);
        }}
        onError={(err) => {
          onAlertError?.(err);
        }}
      />

      {/* Modal: Gestión de Maquinaria */}
      <AssignmentMachineryModal
        isOpen={Boolean(machineryAssignment)}
        onClose={() => setMachineryAssignment(null)}
        operationalOrderId={order?.operation_order_id ?? null}
        assignment={machineryAssignment}
        onSuccess={(msg) => {
          onAlertSuccess?.(msg);
        }}
        onError={(err) => {
          onAlertError?.(err);
        }}
      />
    </>
  );
}
