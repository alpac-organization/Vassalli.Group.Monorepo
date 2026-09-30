import { Modal } from "@alpac/design-system";
import type { RackModalProps } from "./types/rack-modal.types";
import { RackCreateForm } from "./components/rack-create-form";
import { RackEditForm } from "./components/rack-edit-form";

export const RackModal = ({
  isOpen,
  warehouseId,
  sectionId,
  sectionWidth,
  sectionLength ,
  rack = null,
  onClose,
  onSubmitSuccess,
}: RackModalProps) => {
  const isEdit = rack != null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit ? `Actualizar Rack — ${rack?.code}` : "Registrar Nuevos Racks"
      }
      description={
        isEdit
          ? "Modifique medidas, estado o coordenadas del rack en el plano"
          : "Complete el formulario paso a paso para la generación masiva de racks"
      }
      variant="form"
      size="5xl"
    >
      {isEdit && rack ? (
        <RackEditForm
          rack={rack}
          warehouseId={warehouseId}
          sectionId={sectionId}
          sectionWidth={sectionWidth}
          sectionLength={sectionLength}
          onClose={onClose}
          onSubmitSuccess={onSubmitSuccess}
        />
      ) : (
        <RackCreateForm
          warehouseId={warehouseId}
          sectionId={sectionId}
          sectionWidth={sectionWidth}
          sectionLength={sectionLength}
          onClose={onClose}
          onSubmitSuccess={onSubmitSuccess}
        />
      )}
    </Modal>
  );
};
