import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dropdown,
  InputText,
  Modal,
  Textarea,
  type Option,
} from "@alpac/design-system";
import { PackagePlus } from "lucide-react";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import type { RegisterMerchandiseModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-detail-modal/components/register-merchandise-modal/types/register-merchandise-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { baseInputClasses } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

type CategoryNode = {
  id: string;
  name: string;
  is_active?: boolean;
  sub_category?: CategoryNode[];
};

function flattenCategories(
  categories: CategoryNode[],
  result: { id: string; name: string }[] = [],
): { id: string; name: string }[] {
  for (const category of categories) {
    if (category.is_active === false) continue;
    if (category.name !== "ROOT") {
      result.push({ id: category.id, name: category.name });
    }
    if (category.sub_category?.length) {
      flattenCategories(category.sub_category, result);
    }
  }
  return result;
}

export function RegisterMerchandiseModal({
  isOpen,
  company_id,
  module_code,
  onClose,
  onCreated,
}: RegisterMerchandiseModalProps) {
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();
  const { GetProductCategories } = useProduct({
    getProductCategoryPayload: { company_id, module_code },
  });
  const { RegisterMerchandise } = useMerchandise();

  const categoryOptions = useMemo<Option[]>(() => {
    const raw = GetProductCategories.data as unknown as CategoryNode[];
    return flattenCategories(Array.isArray(raw) ? raw : []).map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [GetProductCategories.data]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      merchandise_name: "",
      category_id: "",
      description: "",
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar nueva mercancía"
      size="lg"
    >
      <div className="flex flex-col gap-4 min-w-0">
        <form
          onSubmit={handleSubmit((values) =>
            RegisterMerchandise.mutateAsync({
              company_id,
              module_code,
              merchandise_name: values.merchandise_name,
              category_id: values.category_id,
              description: values.description,
            })
              .then((createdMerchandiseId) => {
                handleRequestSuccess("Mercancía registrada correctamente.");
                reset();
                onCreated?.(createdMerchandiseId, values.merchandise_name);
              })
              .catch((error) => {
                const mappedError = getMappedError(error as ApiErrorResponse);
                handleRequestError(
                  mappedError?.description || "Error al registrar la mercancía",
                );
              }),
          )}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="merchandise_name"
              control={control}
              rules={{ required: "El nombre es requerido" }}
              render={({ field }) => (
                <InputText
                  label="Nombre de la mercancía"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Ej. Malla para construcción"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.merchandise_name?.message}
                  errorVariant="text"
                  className={`${baseInputClasses} h-[42px]! sm:h-[46px]! px-3!`}
                />
              )}
            />
            <Controller
              name="category_id"
              control={control}
              rules={{ required: "La categoría es requerida" }}
              render={({ field }) => (
                <Dropdown
                  label="Categoría"
                  labelClassName={labelClassName}
                  isRequired
                  placeholder="Seleccione la categoría"
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.category_id?.message}
                  errorVariant="text"
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Descripción"
                  labelClassName={labelClassName}
                  placeholder="Descripción de la mercancía"
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
              ariaLabel="Cancelar registro de mercancía"
              onClick={onClose}
              disabled={RegisterMerchandise.isPending}
              className="w-full sm:w-auto text-[13px]! text-slate-600! dark:text-slate-300! bg-slate-100! dark:bg-slate-700! hover:bg-slate-200! dark:hover:bg-slate-600!"
            />
            <Button
              type="submit"
              size="medium"
              label="Registrar mercancía"
              icon={<PackagePlus size={16} />}
              ariaLabel="Registrar nueva mercancía"
              isLoading={RegisterMerchandise.isPending}
              className="w-full sm:w-auto text-[13px]! text-white! bg-blue-600! hover:bg-blue-700!"
            />
          </div>
        </form>

        {AlertComponent}
      </div>
    </Modal>
  );
}