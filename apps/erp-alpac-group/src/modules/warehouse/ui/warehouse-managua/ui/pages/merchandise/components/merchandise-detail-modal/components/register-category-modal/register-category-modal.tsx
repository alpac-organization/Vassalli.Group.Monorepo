import { useState } from "react";
import { Button, InputText, Dropdown, Modal } from "@alpac/design-system";
import { Plus, RotateCcw } from "lucide-react";
import { useProduct } from "@app/modules/product/ui/hooks/useProduct";
import type { RegisterCategoryModalProps } from "./types/register-category-modal.types";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

export function RegisterCategoryModal({
  isOpen,
  company_id,
  module_code,
  onClose,
  onCreated,
}: RegisterCategoryModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentId, setParentId] = useState("");

  const { getMappedError } = useMappedError();
  const { handleRequestError, handleRequestSuccess, AlertComponent } =
    useAlertState();

  const { CreateProductCategory, GetProductCategories } = useProduct({
    getProductCategoryPayload: { company_id, module_code },
  });

  const categoryOptions = Array.isArray(GetProductCategories.data)
    ? GetProductCategories.data
        .filter((cat: any) => cat.is_active !== false && cat.name !== "ROOT")
        .map((cat: any) => ({
          value: cat.id,
          label: cat.name,
        }))
    : [];

  const handleClose = () => {
    setName("");
    setCode("");
    setParentId("");
    onClose();
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      handleRequestError("El nombre de la categoría es requerido.");
      return;
    }
    if (!code.trim()) {
      handleRequestError("El código de la categoría es requerido.");
      return;
    }

    CreateProductCategory.mutateAsync({
      company_id,
      module_code,
      name,
      code,
      parent_id: parentId || null,
    })
      .then((res) => {
        handleRequestSuccess("Categoría registrada correctamente.");
        setTimeout(() => {
          handleClose();
          onCreated?.(res.category_product_id);
        }, 1500);
      })
      .catch((error) => {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al registrar la categoría.",
        );
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar nueva categoría"
      description="Ingrese los datos de la categoría que desea registrar."
    >
      <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
          <div>
          <Dropdown
            appearance="dark"
            label="Categoría padre (Opcional)"
            labelClassName={labelClassName}
            placeholder="Seleccione una categoría padre"
            options={categoryOptions}
            value={parentId}
            onChange={(val) => setParentId(String(val))}
            className="rounded-md!"
          />
        </div>
        <div className="pt-2">
          <InputText
            label="Nombre de la categoría"
            labelClassName={labelClassName}
            isRequired
            placeholder="Ej. Gaseosos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            errorVariant="text"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
        </div>
        <div>
          <InputText
            label="Código"
            labelClassName={labelClassName}
            isRequired
            placeholder="Ej. GAS"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            errorVariant="text"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
        </div>
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-neutral-600">
          <Button
            type="button"
            size="medium"
            label="Restablecer"
            icon={<RotateCcw size={16} />}
            ariaLabel="Restablecer formulario"
            onClick={() => {
              setName("");
              setCode("");
              setParentId("");
            }}
            className="text-[13px]! text-slate-500! hover:bg-slate-200! bg-slate-100! dark:bg-[#20242d]! dark:text-slate-300! dark:border-slate-700! dark:hover:bg-slate-800!"
          />
          <Button
            type="submit"
            size="medium"
            label="Registrar categoría"
            icon={<Plus size={16} />}
            ariaLabel="Registrar categoría"
            isLoading={CreateProductCategory.isPending}
            className="text-[13px]! text-white! bg-blue-600! hover:bg-blue-700!"
          />
        </div>
      </form>
      {AlertComponent}
    </Modal>
  );
}

