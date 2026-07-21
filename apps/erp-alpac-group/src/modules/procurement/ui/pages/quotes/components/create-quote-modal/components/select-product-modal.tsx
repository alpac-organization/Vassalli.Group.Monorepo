import { useMemo, useState } from "react";
import { Button, Dropdown, Modal } from "@alpac/design-system";
import type { CatalogProductOption } from "../create-quote-form.types";
import {
  quoteFormDropdownClassName,
  quoteFormLabelClassName,
  quoteFormPrimaryButtonClassName,
  quoteFormSecondaryButtonClassName,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

type SelectProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: CatalogProductOption[];
  onSelect: (product: CatalogProductOption) => void;
};

export function SelectProductModal({
  isOpen,
  onClose,
  products,
  onSelect,
}: SelectProductModalProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const options = useMemo(
    () =>
      products.map((product) => ({
        label: `${product.product_name} · ${product.product_id}`,
        value: product.product_id,
      })),
    [products],
  );

  const handleClose = () => {
    setSelectedId("");
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedId) {
      setError("Seleccione un producto.");
      return;
    }

    const product = products.find((item) => item.product_id === selectedId);
    if (!product) {
      setError("El producto seleccionado no es válido.");
      return;
    }

    onSelect(product);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="form"
      size="lg"
      title="Seleccionar producto"
      description="Elija un producto para agregarlo al proveedor actual."
    >
      <div className="flex flex-col gap-6">
        <Dropdown
          label="Producto"
          isRequired
          appearance="dark"
          placeholder="Seleccione un producto..."
          options={options}
          value={selectedId}
          onChange={(value) => {
            setSelectedId(String(value));
            setError("");
          }}
          error={error}
          labelClassName={quoteFormLabelClassName}
          className={quoteFormDropdownClassName}
        />

        {options.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay productos disponibles para seleccionar.
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            className={quoteFormSecondaryButtonClassName}
            onClick={handleClose}
          />
          <Button
            type="button"
            size="giant"
            label="Agregar a la lista"
            disabled={options.length === 0}
            className={quoteFormPrimaryButtonClassName}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </Modal>
  );
}
