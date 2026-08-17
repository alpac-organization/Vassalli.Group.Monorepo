import { useEffect } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Button,
  Dropdown,
  InputText,
  Modal,
} from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { WarehouseModalProps } from "./types/warehouse-modal.types";
import { WarehouseTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";
import {
  formatAmount,
  validateDecimalNumber,
  validateIntegerNumber,
  validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/utils/styles";

const parseDecimal = (value: unknown) => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
};

type FormValues = {
  branch_id: string;
  code: string;
  warehouse_name: string;
  warehouse_type: number;
  warehouse_details: {
    width_metres?: number;
    length_metres?: number;
    ramps_count?: number;
    parking_spaces_count?: number;
  };
};

export function WarehouseModal({
  isOpen,
  onClose,
  onSubmit,
}: WarehouseModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { GetBranchesQuery } = useCompanies({ company_id: companyId });
  const branchOptions =
    GetBranchesQuery.data?.map((branch) => ({
      value: branch.branch_id,
      label: branch.branch_name,
    })) || [];
  const { getMappedError } = useMappedError();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      warehouse_details: {
        ramps_count: 0,
        parking_spaces_count: 0,
      },
    },
  });

  const { CreateWarehouse } = useWarehouse();

  const handleCreateWarehouse = (data: FormValues) => {
    const warehouseTypeOption = WarehouseTypeOptions.find(
      (opt) => opt.value === Number(data.warehouse_type),
    );

    const payload: CreateWarehouseRequest = {
      company_id: companyId,
      module_code: moduleCode,
      branch_id: data.branch_id,
      code: data.code,
      is_owner: true,
      warehouse_name: data.warehouse_name,
      warehouse_type: warehouseTypeOption
        ? warehouseTypeOption.label
        : "General",
      parent_warehouse_id: null,
      warehouse_details: {
        width_metres: data.warehouse_details.width_metres,
        length_metres: data.warehouse_details.length_metres,
        ramps_count: data.warehouse_details.ramps_count,
        parking_spaces_count: data.warehouse_details.parking_spaces_count,
      },
    };

    CreateWarehouse.mutate(payload, {
      onSuccess() {
        handleRequestSuccess("Bodega registrada exitosamente.");
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
      title="Registro de nueva bodega"
      variant="form"
      size="6xl"
      description="Complete el registro de bodega"
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleCreateWarehouse)}
      >
        <AnimatedAlertWrapper open={alertState?.open ?? false}>
          <Alert
            type={alertState?.type!}
            title={alertState?.title}
            message={alertState?.message!}
            onClose={handleCloseAlert}
          />
        </AnimatedAlertWrapper>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Controller
            control={control}
            name="branch_id"
            rules={{ required: "La sucursal es requerida" }}
            render={({ field }) => (
              <Dropdown
                label="Sucursal"
                placeholder="Seleccione..."
                isRequired
                options={branchOptions}
                value={field.value}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                onChange={(val) => field.onChange(val)}
                error={errors.branch_id?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="code"
            rules={{ required: "El código es requerido" }}
            render={({ field }) => (
              <InputText
                label="Código"
                placeholder="Ej. B2F"
                isRequired
                className={inputClassName}
                labelClassName={labelClassName}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.code?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="warehouse_name"
            rules={{ required: "El nombre de la bodega es requerido" }}
            render={({ field }) => (
              <InputText
                label="Nombre de la bodega"
                placeholder="Ej. Bodega 2 Fiscal"
                isRequired
                className={inputClassName}
                labelClassName={labelClassName}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.warehouse_name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="warehouse_type"
            rules={{ required: "El tipo de bodega es requerido" }}
            render={({ field }) => (
              <Dropdown
                label="Tipo de bodega"
                placeholder="Seleccione..."
                isRequired
                options={WarehouseTypeOptions}
                value={field.value}
                appearance="dark"
                className={dropdownClassName}
                labelClassName={labelClassName}
                onChange={(val) => field.onChange(val)}
                error={errors.warehouse_type?.message}
              />
            )}
          />

          <InputText
            label="Ancho (m)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("warehouse_details.width_metres", {
              required: "El ancho es requerido",
              validate: {
                validateDecimal: (value) =>
                  !value || validateDecimalNumber(value),
                validatePositive: (value) =>
                  !value || validatePositiveNumber(value),
              },
              setValueAs: parseDecimal,
              onChange: (evt) => {
                evt.target.value = formatAmount(evt.target.value, 10, 2);
              },
            })}
            error={errors.warehouse_details?.width_metres?.message}
          />

          <InputText
            label="Largo (m)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            isRequired
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("warehouse_details.length_metres", {
              required: "El largo es requerido",
              validate: {
                validateDecimal: (value) =>
                  !value || validateDecimalNumber(value),
                validatePositive: (value) =>
                  !value || validatePositiveNumber(value, true),
              },
              setValueAs: parseDecimal,
              onChange: (evt) => {
                evt.target.value = formatAmount(evt.target.value, 10, 2);
              },
            })}
            error={errors.warehouse_details?.length_metres?.message}
          />

          <InputText
            label="Cantidad de rampas"
            type="text"
            inputMode="decimal"
            placeholder="0"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("warehouse_details.ramps_count", {
              validate: {
                validateDecimal: (value) =>
                  value === undefined ||
                  value === null ||
                  validateIntegerNumber(value),
                validatePositive: (value) =>
                  value === undefined ||
                  value === null ||
                  validatePositiveNumber(value, true),
              },
              setValueAs: parseDecimal,
              onChange: (evt) => {
                evt.target.value = formatAmount(evt.target.value, 3, 0);
              },
            })}
            error={errors.warehouse_details?.ramps_count?.message}
          />

          <InputText
            label="Espacios de parqueo"
            type="text"
            inputMode="decimal"
            placeholder="0"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("warehouse_details.parking_spaces_count", {
              validate: {
                validateDecimal: (value) =>
                  value === undefined ||
                  value === null ||
                  validateIntegerNumber(value),
                validatePositive: (value) =>
                  value === undefined ||
                  value === null ||
                  validatePositiveNumber(value, true),
              },
              setValueAs: parseDecimal,
              onChange: (evt) => {
                evt.target.value = formatAmount(evt.target.value, 3, 0);
              },
            })}
            error={errors.warehouse_details?.parking_spaces_count?.message}
          />
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
            isLoading={CreateWarehouse.isPending}
            disabled={CreateWarehouse.isPending}
            className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </form>
    </Modal>
  );
}
