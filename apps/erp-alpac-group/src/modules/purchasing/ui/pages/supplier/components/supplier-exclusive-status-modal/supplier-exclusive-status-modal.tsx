import { useEffect, useState } from "react";
import { Button, Modal, Textarea } from "@alpac/design-system";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SupplierExclusiveStatusReview } from "@app/core/enums/supplier-exclusive-status.enum";
import { inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import type { SupplierExclusiveStatusModalProps } from "./supplier-exclusive-status-modal.types";

const COMMENTS_MAX_LENGTH = 500;

export const SupplierExclusiveStatusModal = ({
  isOpen,
  onClose,
  selectedSupplier,
  onRequestSuccess,
  onRequestError,
}: SupplierExclusiveStatusModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const [comments, setComments] = useState("");
  const { UpdateSupplierExclusiveStatus } = useSupplier();

  const supplierName =
    selectedSupplier?.supplier_legal_name ??
    selectedSupplier?.commercial_name ??
    "proveedor";

  const trimmedComments = comments.trim();
  const hasValidComments =
    trimmedComments.length > 0 && trimmedComments.length <= COMMENTS_MAX_LENGTH;

  useEffect(() => {
    if (!isOpen) {
      setComments("");
    }
  }, [isOpen]);

  const handleClose = () => {
    setComments("");
    onClose();
  };

  const handleExclusiveStatus = (status: SupplierExclusiveStatusReview) => {
    if (!selectedSupplier?.supplier_id || !hasValidComments) return;

    UpdateSupplierExclusiveStatus.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        supplier_id: selectedSupplier.supplier_id,
        exclusive_status: status,
        comments: trimmedComments,
      },
      {
        onSuccess: () => {
          onRequestSuccess?.(
            status === "Approved"
              ? "Exclusividad aprobada correctamente."
              : "Exclusividad rechazada correctamente.",
          );
          setComments("");
          onClose();
        },
        onError: (error) => {
          const mapped = getMappedError(error as ApiErrorResponse);
          onRequestError?.(
            mapped.description ||
              "No se pudo actualizar el estado de exclusividad.",
          );
        },
      },
    );
  };

  const isPending = UpdateSupplierExclusiveStatus.isPending;
  const actionsDisabled = isPending || !hasValidComments;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Gestionar exclusividad"
      variant="form"
      size="md"
      description={`Revisión de exclusividad de ${supplierName}`}
    >
      <div className="flex flex-col gap-4">
        <p className="m-0 text-sm text-slate-700 dark:text-slate-200">
          Este proveedor tiene una solicitud de exclusividad pendiente de
          revisión.
        </p>

        <Textarea
          label="Comentario de revisión"
          placeholder="Comentario obligatorio (máx. 500 caracteres)"
          className={inputClassName}
          labelClassName={labelClassName}
          rows={3}
          value={comments}
          disabled={isPending}
          maxLength={COMMENTS_MAX_LENGTH}
          isRequired
          onChange={(event) => setComments(event.target.value)}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="medium"
            label="Rechazar"
            disabled={actionsDisabled}
            className="w-full! sm:w-auto! text-[14px]! rounded-md! text-white! bg-red-600! dark:bg-red-900/90!"
            onClick={() => handleExclusiveStatus("Rejected")}
          />
          <Button
            type="button"
            size="medium"
            label="Aprobar"
            isLoading={isPending}
            disabled={actionsDisabled}
            className="w-full! sm:w-auto! text-[14px]! rounded-md! text-white! bg-emerald-600! dark:bg-emerald-700/90!"
            onClick={() => handleExclusiveStatus("Approved")}
          />
        </div>
      </div>
    </Modal>
  );
};
