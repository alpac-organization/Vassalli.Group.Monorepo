import { useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Button, Dropdown, Modal, Textarea, type Option } from "@alpac/design-system";
import { FilePlus2, Plus, XIcon } from "lucide-react";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useCustomer } from "@app/modules/warehouse/ui/hooks/useCustomer";
import { ServiceOrderServices } from "@app/modules/service-order/infrastructure/services/service-order-services/ServiceOrderServices";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { GetCustomerResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/customer-responses/get-customer.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type {
  CreateServiceOrderFormValues,
  CreateServiceOrderModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/create-service-order-modal/types/create-service-order-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { RegisterCustomerModal } from "../register-customer-modal/register-customer-modal";

import type { GetBranchesResponse } from "@app/modules/auth/domain/ApiContract/Responses/get-branches.response";

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
  const { handleRequestError, AlertComponent } = useAlertState();
  const { GetBranchesQuery: { data: branchesData } } = useCompanies({ company_id });

  const [openRegisterCustomer, setOpenRegisterCustomer] = useState(false);
  const [newlyCreatedCustomerId, setNewlyCreatedCustomerId] = useState<string | null>(null);

  const branchOptions = useMemo<Option[]>(() => {
    if (!Array.isArray(branchesData)) return [];
    
    return branchesData.map((branch: GetBranchesResponse  ) => ({
      value: branch.branch_id,
      label: `${branch.company_alias ?? ""} - ${branch.branch_name}`.trim(),
    }));
  }, [branchesData]);

  const { GetCustomer } = useCustomer();
  const { data: customersData, refetch: refetchCustomers } = GetCustomer({ company_id, module_code});

  const customerOptions = useMemo<Option[]>(() => {
    if (!Array.isArray(customersData)) return [];
    
    return customersData.map((customer: GetCustomerResponse) => ({
      value: customer.customer_id,
      label: customer.legal_name || customer.identification_number || customer.customer_id,
    }));
  }, [customersData]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
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

  const preselectedBranchId = branchesData?.[0]?.branch_id;
  useEffect(() => {
    if (preselectedBranchId && !control._formValues.branch_id) {
      setValue("branch_id", preselectedBranchId, { shouldValidate: true });
    }
  }, [preselectedBranchId, setValue, control]);

  useEffect(() => {
    if (newlyCreatedCustomerId) {
      refetchCustomers().then(() => {
        setValue("customer_id", newlyCreatedCustomerId, { shouldValidate: true });
      });
    }
  }, [newlyCreatedCustomerId, refetchCustomers, setValue]);

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
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}
          title="Crear orden de servicio"
          size="lg"
        >
          <div className="flex flex-col gap-4 min-w-0">
            <form
              onSubmit={handleSubmit((values) =>
                createServiceOrderMutation
                  .mutateAsync(values)
                  .then((createdServiceOrder) => {
                    reset();
                    onCreated?.(createdServiceOrder);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="branch_id"
                  control={control}
                  rules={{ required: "La sucursal es requerida" }}
                  render={({ field }) => (
                    <Dropdown
                      appearance="dark"
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
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Dropdown
                          appearance="dark"
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
                      </div>
                      <div className="flex shrink-0 mt-[24px] sm:mt-[26px]">
                        <Button
                          type="button"
                          tooltip="Registrar nuevo cliente"
                          onClick={() => setOpenRegisterCustomer(true)}
                          icon={<Plus size={16} />}
                          className="h-[42px]! sm:h-[46px]! w-[42px]! sm:w-[46px]! bg-slate-100! hover:bg-slate-200! dark:bg-[#20242d]! dark:hover:bg-slate-800/80! text-slate-600! dark:text-slate-400! border border-slate-200! dark:border-slate-700! rounded-lg!"
                        />
                      </div>
                    </div>
                  )}
                />
                <div className="md:col-span-2">
                  <Controller
                    name="observations"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Observaciones (Opcional)"
                        labelClassName={labelClassName}
                        placeholder="Ingrese las observaciones de la orden de servicio"
                        value={field.value}
                        onChange={field.onChange}
                        maxLength={500}
                        rows={3}
                        error={errors.observations?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600">
                <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  icon={<XIcon size={20} />}
                  isHiddenLabelOnMobile
                  onClick={onClose}
                  disabled={createServiceOrderMutation.isPending}
                  className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
                />
                <Button
                  type="submit"
                  size="giant"
                  label="Crear orden"
                  icon={<FilePlus2 size={16} />}
                  isHiddenLabelOnMobile
                  isLoading={createServiceOrderMutation.isPending}
                  className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                />
              </div>
            </form>

            {AlertComponent}
          </div>
        </Modal>
      )}

      {openRegisterCustomer && (
        <RegisterCustomerModal
          isOpen={true}
          company_id={company_id}
          module_code={module_code}
          onClose={() => setOpenRegisterCustomer(false)}
          onCreated={(customerId) => {
            setNewlyCreatedCustomerId(customerId);
          }}
        />
      )}
    </>
  );
}