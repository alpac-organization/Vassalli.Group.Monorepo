import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Alert, AnimatedAlertWrapper, Button, Dropdown, Modal, Textarea, type Option } from "@alpac/design-system";
import { FilePlus2, X } from "lucide-react";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import { ServiceOrderServices } from "@app/modules/service-order/infrastructure/services/service-order-services/ServiceOrderServices";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type {
  CreateServiceOrderFormValues,
  CreateServiceOrderModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/create-service-order-modal/types/create-service-order-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

const serviceOrderServices = new ServiceOrderServices(warehouseHttpHandler);

export function CreateServiceOrderModal({
  isOpen,
  company_id,
  module_code,
  onClose,
  onCreated,
}: CreateServiceOrderModalProps) {
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const { GetBranchesQuery } = useCompanies({ company_id });

  const branches = GetBranchesQuery.data ?? [];

  const branchOptions = useMemo<Option[]>(
    () =>
      branches.map((branch) => ({
        value: branch.branch_id,
        label: `${branch.company_alias ?? ""} - ${branch.branch_name}`.trim(),
      })),
    [branches],
  );

  const { GetCustomer } = useCustomer();
  const { data: customersData } = GetCustomer({ company_id });

  const customerOptions = useMemo<Option[]>(
    () =>
      (customersData ?? []).map((customer: { customer_id: string; legal_name?: string | null; identification_number?: string | null }) => ({
        value: customer.customer_id,
        label:
          customer.legal_name ||
          customer.identification_number ||
          customer.customer_id,
      })),
    [customersData],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateServiceOrderFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      branch_id: "",
      customer_id: "",
      observations: "",
    },
  });

  const createServiceOrderMutation = useMutation({
    mutationFn: (values: CreateServiceOrderFormValues) =>
      serviceOrderServices.CreateServiceOrder({
        company_id,
        module_code,
        branch_id: values.branch_id,
        customer_id: values.customer_id,
        observations: values.observations || undefined,
      }),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-[min(600px,calc(100vw-2rem))] flex-col gap-5 rounded-2xl bg-white dark:bg-neutral-900 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePlus2 size={20} className="text-amber-500 dark:text-amber-400" />
            <h2 className="text-lg! font-semibold! text-slate-800! dark:text-slate-100!">
              Crear orden de servicio
            </h2>
          </div>
          <Button
            type="button"
            size="small"
            icon={<X size={16} />}
            ariaLabel="Cerrar modal de orden de servicio"
            onClick={onClose}
            className="text-slate-500! dark:text-slate-400! bg-transparent! hover:bg-slate-100! dark:hover:bg-slate-800!"
          />
        </div>

        <form
          onSubmit={handleSubmit((values) =>
            createServiceOrderMutation
              .mutateAsync(values)
              .then((response) => {
                reset();
                onCreated?.(response);
              })
              .catch((error) => {
                const mappedError = getMappedError(error as ApiErrorResponse);
                handleRequestError(
                  mappedError?.description || "Error al crear la orden de servicio",
                );
              }),
          )}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="branch_id"
              control={control}
              rules={{ required: "La sucursal es requerida" }}
              render={({ field }) => (
                <Dropdown
                  label="Sucursal"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Seleccione la sucursal"
                  options={branchOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.branch_id?.message}
                  errorVariant="text"
                />
              )}
            />
            <Controller
              name="customer_id"
              control={control}
              rules={{ required: "El cliente es requerido" }}
              render={({ field }) => (
                <Dropdown
                  label="Cliente"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Seleccione el cliente"
                  options={customerOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.customer_id?.message}
                  errorVariant="text"
                />
              )}
            />
            <Controller
              name="observations"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Observaciones"
                  labelClassName={labelClassName}
                  placeholder="Observaciones de la orden de servicio"
                  value={field.value}
                  onChange={field.onChange}
                  maxLength={500}
                  rows={3}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600">
            <Button
              type="button"
              size="medium"
              label="Cancelar"
              ariaLabel="Cancelar creación de orden de servicio"
              onClick={onClose}
              disabled={createServiceOrderMutation.isPending}
              className="w-full sm:w-auto text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600!"
            />
            <Button
              type="submit"
              size="medium"
              label="Crear orden de servicio"
              icon={<FilePlus2 size={16} />}
              ariaLabel="Crear nueva orden de servicio"
              isLoading={createServiceOrderMutation.isPending}
              className="w-full sm:w-auto text-[13px]! text-white! bg-amber-500! hover:bg-amber-600!"
            />
          </div>
        </form>

        <AnimatedAlertWrapper open={alertState?.open ?? false}>
          <Alert
            type={alertState?.type!}
            title={alertState?.title}
            message={alertState?.message!}
            onClose={handleCloseAlert}
          />
        </AnimatedAlertWrapper>
      </div>
    </Modal>
  );
}