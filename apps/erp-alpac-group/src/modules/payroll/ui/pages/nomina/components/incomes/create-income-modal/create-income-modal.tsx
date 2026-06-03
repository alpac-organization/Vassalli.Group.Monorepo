import { useCallback } from "react";
import { Modal } from "@alpac/design-system";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import type { CreateIncomeModalProps } from "@app/modules/payroll/ui/pages/nomina/components/incomes/create-income-modal/create-income-modal.types";
import { CreateIncomeForm } from "@app/modules/payroll/ui/pages/nomina/components/incomes/create-income-form/create-income-form";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export const CreateIncomeModal = ({
  isOpen,
  onClose,
  onRequestSuccess,
  onRequestError,
  payrollId,
  branchId,
}: CreateIncomeModalProps) => {
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Registro de Ingresos"
      variant="form"
      size="4xl"
    >
      <LazyMotion features={loadFeatures} strict>
        <div className="flex flex-col gap-5">
          <AnimatePresence>
            {true && (
              <m.div
                key="subsidy-form"
                initial={{ opacity: 0, y: 16, height: 0, overflow: "hidden" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  overflow: "visible",
                }}
                exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                transition={{
                  height: { duration: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                  y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                }}
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="relative min-w-0 flex flex-col gap-4 w-full">
                  <CreateIncomeForm
                    key={String(isOpen)}
                    payrollId={payrollId}
                    branchId={branchId}
                    onCancel={() => {
                      handleCancel();
                    }}
                    onRequestError={(error) => {
                      onRequestError?.(error);
                    }}
                    onRequestSuccess={(successMessage) => {
                      handleCancel();
                      onRequestSuccess?.(successMessage);
                    }}
                  />
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </Modal>
  );
};
