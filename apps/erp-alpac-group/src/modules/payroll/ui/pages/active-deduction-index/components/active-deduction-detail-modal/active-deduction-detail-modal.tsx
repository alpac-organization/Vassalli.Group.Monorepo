import { Modal } from "@alpac/design-system";
import { ActiveDeductionDetailContent } from "./active-deduction-detail-content";
import type { ActiveDeductionDetailModalProps } from "./active-deduction-detail-modal.types";

export function ActiveDeductionDetailModal({
  isOpen,
  onClose,
  summary,
  detail,
  isLoading,
  isError,
}: ActiveDeductionDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalles de la Deducción"
      panelClassName={[
        "!max-w-2xl w-[min(calc(100vw-1rem),42rem)] min-w-0",
        "max-h-[min(94dvh,46rem)] overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-dashboard",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
    >
      <ActiveDeductionDetailContent
        summary={summary}
        detail={detail}
        isLoading={isLoading}
        isError={isError}
      />
    </Modal>
  );
}
