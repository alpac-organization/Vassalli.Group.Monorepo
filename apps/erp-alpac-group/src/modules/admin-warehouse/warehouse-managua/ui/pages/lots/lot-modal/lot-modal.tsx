import { useEffect } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  InputText,
  Modal,
} from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import { useForm } from "react-hook-form";
import type { LotFormValues, LotModalProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/types/lot-modal.types";
import {
  RackStatusEnum,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import { getDecimalFieldConfig } from "@app/shared/utils/get-decimal.config";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/utils/style.lots";

export const LotModal = ({
  isOpen,
  warehouseId,
  sectionId,
  onClose,
  onSubmit,
}: LotModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LotFormValues>({
    defaultValues: {
      status: RackStatusEnum.Available.value,
    },
  });

  const { RegisterLot } = useWarehouseAdmin();

  const handleCreateLot = (data: LotFormValues) => {
    const payload: RegisterLotRequest = {
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
      code: data.code ?? "",
      width_metres: Number(data.width_metres ?? 0),
      length_metres: Number(data.length_metres ?? 0)
    };

    RegisterLot.mutate(payload, {
      onSuccess() {
        handleRequestSuccess("Tramos registrados exitosamente.");
        reset();
        onSubmit?.(payload);

        setTimeout(() => {
          onClose();
        }, 2000);
      },
      onError(error) {
        const mappedError = getMappedError(error);
        handleRequestError(mappedError.description);
      },
    });
  };

  const handleClose = () => {
    handleCloseAlert();
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registro de tramos"
      variant="form"
      size="md"
      description="Crear un tramo para la sección"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateLot)}
      >
        <AnimatedAlertWrapper open={alertState?.open ?? false}>
          {alertState && (
            <Alert
              type={alertState.type}
              title={alertState.title}
              message={alertState.message}
              onClose={handleCloseAlert}
            />
          )}
        </AnimatedAlertWrapper>

        <div className="flex flex-col gap-4 sm:gap-6">
          <AnimatePresence initial={false}>
            <m.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 8, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mx-1 overflow-hidden sm:mx-0"
            >
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InputText
                  label="Código"
                  placeholder="Ej. LOT-A1"
                  isRequired
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register(`code`, {
                    required: "El código es requerido",
                    validate: {
                      hasCode: (value) =>
                        (value ?? "").trim() !== "" || "Ingrese un código",
                    },
                  })}
                  error={errors.code?.message}
                />

                <InputText
                  label="Ancho (m)"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  isRequired
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register(
                    `width_metres`,
                    getDecimalFieldConfig("El ancho es requerido"),
                  )}
                  error={errors.width_metres?.message}
                />

                <InputText
                  label="Largo (m)"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  isRequired
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register(
                    `length_metres`,
                    getDecimalFieldConfig("El largo es requerido", true),
                  )}
                  error={errors.length_metres?.message}
                />
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

        <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleClose}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
          />
          <Button
            type="submit"
            size="giant"
            label="Guardar"
            isLoading={RegisterLot.isPending}
            disabled={RegisterLot.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
};