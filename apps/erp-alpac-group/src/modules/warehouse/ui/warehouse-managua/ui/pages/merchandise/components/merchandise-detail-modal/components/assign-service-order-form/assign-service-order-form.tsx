import { useState } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Button,
} from "@alpac/design-system";
import { Link2 } from "lucide-react";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import type { CreateServiceOrderResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/service-order-responses/create-service-order.response";
import type { AssignServiceOrderFormProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/assign-service-order-form/types/assign-service-order-form.types";
import { CreateServiceOrderModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/create-service-order-modal/create-service-order-modal";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

export function AssignServiceOrderForm({
  reception_id,
  company_id,
  module_code,
  customsDeclarationNumber,
}: AssignServiceOrderFormProps) {
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess } =
    useAlertState();
  const { AssignServiceOrderToCustomsDeclaration } = useMerchandise();
  const [openCreateServiceOrderModal, setOpenCreateServiceOrderModal] =
    useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <span className="text-[13px]! font-medium! text-slate-700! dark:text-slate-200!">
            Asignar orden de servicio a la declaración {customsDeclarationNumber}
          </span>
          <span className="text-[12px]! text-slate-500! dark:text-slate-400!">
            Cree y asigne una orden de servicio a la declaración para finalizar el
            llenado del registro
          </span>
        </div>
        <Button
          type="button"
          size="small"
          label="Crear y asignar orden de servicio"
          icon={<Link2 size={14} />}
          ariaLabel="Crear y asignar orden de servicio"
          onClick={() => setOpenCreateServiceOrderModal(true)}
          className="text-[13px]! text-white! bg-amber-500! hover:bg-amber-600!"
        />
      </div>

      <CreateServiceOrderModal
        isOpen={openCreateServiceOrderModal}
        company_id={company_id}
        module_code={module_code}
        onClose={() => setOpenCreateServiceOrderModal(false)}
        onCreated={(createdServiceOrder: CreateServiceOrderResponse) => {
          setOpenCreateServiceOrderModal(false);
          AssignServiceOrderToCustomsDeclaration.mutateAsync({
            company_id,
            module_code,
            reception_id,
            service_order_id: createdServiceOrder.service_order_id,
          })
            .then(() => {
              handleRequestSuccess(
                `Orden de servicio ${createdServiceOrder.code} asignada correctamente a la declaración.`,
              );
            })
            .catch((error) => {
              const mappedError = getMappedError(error as ApiErrorResponse);
              handleRequestError(
                mappedError?.description || "Error al asignar la orden de servicio",
              );
            });
        }}
      />

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </div>
  );
}