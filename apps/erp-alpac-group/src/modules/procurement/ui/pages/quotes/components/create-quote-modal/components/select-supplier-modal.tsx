import { useMemo, useState } from "react";
import { Button, Dropdown, Modal, Spinner } from "@alpac/design-system";
import type { GetSuppliersResponse } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers-response";
import {
  quoteFormDropdownClassName,
  quoteFormLabelClassName,
  quoteFormPrimaryButtonClassName,
  quoteFormSecondaryButtonClassName,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

type SelectSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  suppliers: GetSuppliersResponse[];
  isLoading?: boolean;
  onSelect: (supplier: GetSuppliersResponse) => void;
};

export function SelectSupplierModal({
  isOpen,
  onClose,
  suppliers,
  isLoading = false,
  onSelect,
}: SelectSupplierModalProps) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const options = useMemo(
    () =>
      suppliers.map((supplier) => ({
        label: `${supplier.supplier_legal_name} · ${supplier.contact_name}`,
        value: supplier.supplier_id,
      })),
    [suppliers],
  );

  const handleClose = () => {
    setSelectedId("");
    setError("");
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedId) {
      setError("Seleccione un proveedor registrado.");
      return;
    }

    const supplier = suppliers.find((item) => item.supplier_id === selectedId);
    if (!supplier) {
      setError("El proveedor seleccionado no es válido.");
      return;
    }

    onSelect(supplier);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="form"
      size="lg"
      title="Seleccionar proveedor"
      description="Elija un proveedor registrado para agregarlo a la cotización."
    >
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <Spinner size="small" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Cargando proveedores...
            </span>
          </div>
        ) : (
          <Dropdown
            label="Proveedor registrado"
            isRequired
            appearance="dark"
            placeholder="Seleccione un proveedor..."
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
        )}

        {!isLoading && options.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay proveedores registrados disponibles.
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
            disabled={isLoading || options.length === 0}
            className={quoteFormPrimaryButtonClassName}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </Modal>
  );
}
