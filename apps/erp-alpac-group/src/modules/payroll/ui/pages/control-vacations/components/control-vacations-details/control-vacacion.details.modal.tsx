import { useMemo } from "react";
import { Modal } from "@alpac/design-system";
import { deriveVacationDetails } from "@app/modules/payroll/ui/pages/control-vacations/utils/vacations-details-view-state";
import type { ControlVacationDetailsModalProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacations-details/type/control-vacation-details";
import { ControlModalVacationDetailsContent } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacations-details/vacationDetailsContent";
export function ControlModalVacationDetails({
  isOpen,
  onClose,
  item,
  collaboratorFullName,
}: ControlVacationDetailsModalProps) {
  const details = useMemo(() => {
    if (!item) return null;
    return deriveVacationDetails(item, collaboratorFullName);
  }, [item, collaboratorFullName]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      title="Detalles de la vacación"
      panelClassName={[
        "!max-w-2xl w-full min-w-0",
        "max-h-[min(92dvh,44rem)] overflow-y-auto overflow-x-hidden overscroll-contain",
        "!mx-3 !my-4 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
        "[scrollbar-gutter:stable]",
      ].join(" ")}
    >
      {details && <ControlModalVacationDetailsContent details={details} />}
    </Modal>
  );
}
