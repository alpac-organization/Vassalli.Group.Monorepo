import { useMemo } from "react";
import { CatalogLinkEditor } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor";
import type { CatalogLinkItemForm } from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { useUnitOfMeasurement } from "@app/modules/unit-of-measurement/hooks/useUnitOfMeasurement";

type SupplierProductsTabProps = {
  companyId: string;
  moduleCode: string;
  items: CatalogLinkItemForm[];
  onChange: (items: CatalogLinkItemForm[]) => void;
  onAddClick: () => void;
  disabled: boolean;
};

export const SupplierProductsTab = ({
  companyId,
  moduleCode,
  items,
  onChange,
  onAddClick,
  disabled,
}: SupplierProductsTabProps) => {
  const { GetUnitMeasurements } = useUnitOfMeasurement({
    payloadUnitOfMeasurement: {
      companie_id: companyId,
      module_code: moduleCode,
    },
    enabled: true,
  });

  const unitMeasureOptions = useMemo(() => {
    const data = GetUnitMeasurements.data;
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => ({
      value: item.unit_measure_id,
      label: `${item.name}${item.symbol ? ` (${item.symbol})` : ""}`,
    }));
  }, [GetUnitMeasurements.data]);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <CatalogLinkEditor
        title="Productos vinculados (opcional)"
        emptyLabel="No ha vinculado productos. Puede hacerlo ahora o más adelante. Use Agregar producto para seleccionarlos de la lista."
        addButtonLabel="Agregar producto"
        entityLabel="Producto"
        entityPlaceholder="Producto"
        options={[]}
        unitMeasureOptions={unitMeasureOptions}
        isLoadingUnitMeasures={
          GetUnitMeasurements.isPending || GetUnitMeasurements.isFetching
        }
        items={items}
        onChange={onChange}
        lockEntity
        onAddClick={onAddClick}
        disabled={disabled}
      />
    </div>
  );
};
