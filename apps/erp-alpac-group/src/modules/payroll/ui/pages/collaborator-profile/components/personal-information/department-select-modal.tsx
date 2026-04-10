import { useState } from "react";
import { Modal, Button, Dropdown } from "@alpac/design-system";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";

export interface DepartmentSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  currentDepartmentSubId: number | null;
  isSaving: boolean;
  onConfirm: (subId: number, departmentName: string) => Promise<void>;
}

export function DepartmentSelectModal({
  isOpen,
  onClose,
  companyId,
  currentDepartmentSubId,
  isSaving,
  onConfirm,
}: DepartmentSelectModalProps) {
  const { GetCatalogListQuery } = useCatalog({
    company_id: companyId,
    catalog_type_id: CatalogEnum.DEPARTMENTS,
  });

  const [selected, setSelected] = useState<number>(currentDepartmentSubId ?? 0);

  const rawList = GetCatalogListQuery.data ?? [];
  const options = mapCatalogToOptions(rawList);

  const handleConfirm = async () => {
    if (!selected || selected === 0) return;

    const fromCatalog = rawList.find((r) => r.sub_catalog_id === selected);
    const label =
      fromCatalog?.catalog_name?.trim() ??
      options.find((o) => o.value === selected)?.label ??
      "";

    await onConfirm(selected, label);
    onClose();
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
            size="medium"
            label="Cancelar"
            onClick={onClose}
            className="..."
          />
          <Button
            type="button"
            size="medium"
            label={isSaving ? "Guardando…" : "Confirmar"}
            onClick={handleConfirm}
            disabled={isSaving || !selected || selected === 0}
            className="..."
          />
        </div>
      </div>
    </Modal>
  );
}
