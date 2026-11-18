import { Modal } from "@alpac/design-system";
import { SupplyRequestForm } from "./supply-request-form";
import type { SupplyRequestFormProps } from "./supply-request-form";

interface SupplyRequestModalProps extends SupplyRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
}

export function SupplyRequestModal({
  isOpen,
  onClose,
  onSkip,
  ...formProps
}: SupplyRequestModalProps) {
  const handleSkip = () => {
    if (formProps.isSubmitting) return;
    if (onSkip) {
      onSkip();
      return;
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      variant="form"
      size="lg"
      title="Solicitud de insumos"
      description={
        <>
          Solicita los insumos requeridos. <br /> Este paso es opcional.
        </>
      }
    >
      <SupplyRequestForm {...formProps} />
    </Modal>
  );
}

export default SupplyRequestModal;