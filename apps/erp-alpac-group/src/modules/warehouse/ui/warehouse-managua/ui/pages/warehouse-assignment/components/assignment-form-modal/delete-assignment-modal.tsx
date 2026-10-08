import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";

interface DeleteAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationalOrderId: string | null;
  assignment: AssignmentOperationalDto | null;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function DeleteAssignmentModal({
  isOpen,
  onClose,
  operationalOrderId,
  assignment,
  onSuccess,
  onError,
}: DeleteAssignmentModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { DeleteAssignment } = useWarehouseAssignment();

  const handleDelete = async () => {
    if (!operationalOrderId || !assignment?.assignment_id) return;

    try {
      await DeleteAssignment.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        operational_order_id: operationalOrderId,
        assignment_id: assignment.assignment_id,
      });

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message ||
        "Error al eliminar la asignación operativa";
      onError?.(errorMsg);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen && Boolean(assignment)}
      type="DELETE"
      variant="warning"
      title={`¿Está seguro que desea eliminar la asignación de la mercancía "${assignment?.merchandise || "seleccionada"}"?`}
      buttonActionLabel="Eliminar"
      buttonActionClass="rounded-md! h-11 px-6! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
      buttonCancelClass="rounded-md! h-11 px-6! hover:bg-slate-200 bg-slate-500 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
      isLoading={DeleteAssignment.isPending}
      disabled={DeleteAssignment.isPending}
      onClose={onClose}
      handleFinalAction={(actionType) => {
        if (actionType === "DELETE") {
          handleDelete();
        }
      }}
    >
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Esta acción no se puede deshacer y liberará los recursos asociados.
      </p>
    </ConfirmModal>
  );
}
