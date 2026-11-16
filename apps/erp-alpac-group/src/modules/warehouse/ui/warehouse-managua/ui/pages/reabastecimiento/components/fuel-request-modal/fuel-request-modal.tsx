import { Modal } from "@alpac/design-system";
import { FuelRequestForm } from "./../fuel-request-form/fuel-request-form";

interface FuelRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  onSubmit: (data: {
    machinery_id: string;
    product_stock_id: string;
    requested_quantity: number;
    mileage?: number;
    engine_hours?: number;
    justification: string;
  }) => void | Promise<void>;
}

export function FuelRequestModal({
  isOpen,
  onClose,
  isSubmitting = false,
  onSubmit,
}: FuelRequestModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="form"
      size="lg"
      title="Solicitud de combustible"
      description="Registra una solicitud de combustible para una maquinaria."
    >
      <FuelRequestForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </Modal>
  );
}

export default FuelRequestModal;