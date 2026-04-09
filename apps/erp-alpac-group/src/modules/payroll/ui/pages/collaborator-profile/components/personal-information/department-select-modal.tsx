import { useEffect, useState } from "react";
import { Modal, Button, Dropdown } from "@alpac/design-system";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";
import type { DepartmentSelectModalProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/types/DepartmentSelectModalProps";

export function DepartmentSelectModal({
  isOpen,
  onClose,
  companyId,
  currentDepartmentSubId,
  identificationNumber,
  moduleCode,
  updateMutation,
  onDepartmentSaved,
  onSuccessMessage,
  onErrorMessage,
}: DepartmentSelectModalProps) {
  const { GetCatalogListQuery } = useCatalog({
    company_id: companyId,
    catalog_type_id: CatalogEnum.DEPARTMENTS,
  });

  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setSelected(currentDepartmentSubId ?? 0);
    }
  }, [isOpen, currentDepartmentSubId]);

  const rawList = GetCatalogListQuery.data ?? [];
  const options = mapCatalogToOptions(rawList);

  const handleConfirm = () => {
    if (!selected || selected === 0) {
      onErrorMessage("Seleccione un departamento.");
      return;
    }

    updateMutation.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        identification_number: identificationNumber,
        personal_information: {
          departament_id: selected,
        },
      },
      {
        onSuccess: () => {
          const fromCatalog = rawList.find(
            (r) => r.sub_catalog_id === selected,
          );
          const label =
            fromCatalog?.catalog_name?.trim() ??
            options.find((o) => o.value === selected)?.label ??
            "";
          onDepartmentSaved(selected, label);
          onSuccessMessage();
          onClose();
        },
        onError: () => {
          onErrorMessage("No se pudo actualizar el departamento.");
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Seleccionar departamento"
      panelClassName="!max-w-md w-full dark:border dark:border-neutral-700"
    >
      <span className="text-slate-700 dark:text-slate-300">
        Elige el departamento asignado al colaborador.
      </span>
      <div className="flex flex-col gap-5 pt-8 items-center justify-between">
        <Dropdown
          appearance="dark"
          labelClassName="text-white"
          label="Departamento"
          placeholder={
            GetCatalogListQuery.isPending ? "Cargando…" : "Seleccione…"
          }
          options={options}
          value={selected}
          onChange={(v) => setSelected(Number(v))}
          className="w-full"
          error={
            GetCatalogListQuery.isError
              ? "No se pudo cargar el catálogo."
              : undefined
          }
        />
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={onClose}
            className="min-w-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-white! dark:text-slate-300! border! border-slate-300! dark:border-slate-600!"
          />
          <Button
            type="button"
            size="giant"
            label={updateMutation.isPending ? "Guardando…" : "Confirmar"}
            onClick={handleConfirm}
            disabled={updateMutation.isPending || !selected || selected === 0}
            className="min-w-0 text-[15px]! rounded-md! bg-alpac-primary-500! text-white! disabled:opacity-50!"
          />
        </div>
      </div>
    </Modal>
  );
}
