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
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import {
  formatAmount,
  validateDecimalNumber,
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { parseDecimal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/utils/lots.utils";
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
  } = useForm<LotFormValues>();

  const { RegisterLot } = useWarehouseAdmin();

  const handleCreateLots = (data: LotFormValues) => {
    const payload: RegisterLotRequest = {
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
      quantity: Number(data.quantity ?? 0),
      nominal_rows: Number(data.nominal_rows ?? 0),
      nominal_columns: Number(data.nominal_columns ?? 0),
      width: Number(data.width ?? 0),
      length: Number(data.length ?? 0),
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
      description="Crea uno o varios tramos para la sección"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateLots)}
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
              <div className="flex flex-col gap-3 sm:gap-3">
                <InputText
                  label="Cantidad de tramos"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 1"
                  isRequired
                  className={inputClassName}
                  labelClassName={labelClassName}
                  {...register("quantity", {
                    required: "La cantidad de tramos es requerida",
                    max: {
                      value: 10,
                      message: "Se permite un máximo de 10 tramos por petición.",
                    },
                    validate: {
                      validateInteger: (value) =>
                        !value || validateIntegerNumber(value),
                      validatePositive: (value) =>
                        !value || validatePositiveNumber(value) === true ||
                        "La cantidad de tramos debe ser mayor a 0.",
                    },
                    setValueAs: parseDecimal,
                  })}
                  error={errors.quantity?.message}
                />

                <div className="border-t border-t-slate-300 dark:border-t-neutral-600" />

                <div className="flex flex-col gap-1 sm:gap-1">
                  <p className="text-[13px] font-medium text-slate-400 dark:text-slate-300">
                    Configure las dimensiones y la matriz de posiciones de cada
                    tramo.
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                    <InputText
                      label="Ancho (m)"
                      type="text"
                      inputMode="decimal"
                      placeholder="Ej: 4.10"
                      isRequired
                      className={inputClassName}
                      labelClassName={labelClassName}
                      {...register("width", {
                        required: "El ancho es requerido",
                        validate: {
                          validateDecimal: (value) =>
                            !value || validateDecimalNumber(value),
                          validatePositive: (value) =>
                            !value || validatePositiveNumber(value) === true ||
                            "El ancho (metros) debe ser mayor a 0.",
                        },
                        setValueAs: parseDecimal,
                        onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
                          evt.target.value = formatAmount(evt.target.value, 10, 2);
                        },
                      })}
                      error={errors.width?.message}
                    />

                    <InputText
                      label="Largo (m)"
                      type="text"
                      inputMode="decimal"
                      placeholder="Ej: 4.10"
                      isRequired
                      className={inputClassName}
                      labelClassName={labelClassName}
                      {...register("length", {
                        required: "El largo es requerido",
                        validate: {
                          validateDecimal: (value) =>
                            !value || validateDecimalNumber(value),
                          validatePositive: (value) =>
                            !value || validatePositiveNumber(value) === true ||
                            "El largo (metros) debe ser mayor a 0.",
                        },
                        setValueAs: parseDecimal,
                        onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
                          evt.target.value = formatAmount(evt.target.value, 10, 2);
                        },
                      })}
                      error={errors.length?.message}
                    />

                    <InputText
                      label="Cantidad de Filas"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ej: 4"
                      isRequired
                      className={inputClassName}
                      labelClassName={labelClassName}
                      {...register("nominal_rows", {
                        required: "Las filas son obligatorias",
                        validate: {
                          validateInteger: (value) =>
                            !value || validateIntegerNumber(value),
                          validatePositive: (value) =>
                            !value || validatePositiveNumber(value),
                        },
                        setValueAs: parseDecimal,
                      })}
                      error={errors.nominal_rows?.message}
                    />

                    <InputText
                      label="Cantidad de Columnas"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ej: 5"
                      isRequired
                      className={inputClassName}
                      labelClassName={labelClassName}
                      {...register("nominal_columns", {
                        required: "Las columnas son obligatorias",
                        validate: {
                          validateInteger: (value) =>
                            !value || validateIntegerNumber(value),
                          validatePositive: (value) =>
                            !value || validatePositiveNumber(value),
                        },
                        setValueAs: parseDecimal,
                      })}
                      error={errors.nominal_columns?.message}
                    />
                  </div>
                </div>
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