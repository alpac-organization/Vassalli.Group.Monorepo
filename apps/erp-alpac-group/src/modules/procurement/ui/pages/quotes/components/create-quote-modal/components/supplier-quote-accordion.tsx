import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  AccordionGroup,
  AccordionItem,
  Button,
  InputText,
} from "@alpac/design-system";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import {
  createEmptyProduct,
  type CatalogProductOption,
  type CreateQuoteFormValues,
  type ProductQuoteFormValues,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.types";
import { ProductQuoteFields } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/product-quote-fields/product-quote-fields";
import { SelectProductModal } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/components/select-product-modal";
import { MOCK_CATALOG_PRODUCTS } from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/data/catalog-products.mock";
import {
  quoteFormDangerButtonClassName,
  quoteFormInputClassName,
  quoteFormLabelClassName,
  quoteFormOutlineButtonClassName,
  quoteFormPrimaryButtonClassName,
} from "@app/modules/procurement/ui/pages/quotes/components/create-quote-modal/create-quote-form.styles";

type SupplierQuoteAccordionProps = {
  supplierIndex: number;
  accordionValue: string;
  canRemove: boolean;
  onRemove: () => void;
};

export function SupplierQuoteAccordion({
  supplierIndex,
  accordionValue,
  canRemove,
  onRemove,
}: SupplierQuoteAccordionProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateQuoteFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `suppliers.${supplierIndex}.products`,
  });
  const [openProducts, setOpenProducts] = useState<string[]>(() =>
    fields.map((field) => field.client_id),
  );
  const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    index: number;
    clientId: string;
    name: string;
  } | null>(null);

  const supplier = useWatch({
    control,
    name: `suppliers.${supplierIndex}`,
  });
  const supplierErrors = errors.suppliers?.[supplierIndex];
  const path = `suppliers.${supplierIndex}` as const;

  const productCount = supplier?.products?.length ?? fields.length;
  const supplierName = supplier?.supplier_legal_name?.trim();

  const appendProduct = (product: ProductQuoteFormValues) => {
    append(product);
    setOpenProducts((current) => [...current, product.client_id]);
  };

  const handleSelectCatalogProduct = (product: CatalogProductOption) => {
    appendProduct({
      ...createEmptyProduct(),
      product_id: product.product_id,
      product_name: product.product_name,
      product_cost: product.product_cost,
      unit_measure_id: product.unit_measure_id,
    });
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    remove(productToDelete.index);
    setOpenProducts((current) =>
      current.filter((value) => value !== productToDelete.clientId),
    );
    setProductToDelete(null);
  };

  return (
    <>
      <AccordionItem
        value={accordionValue}
        className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#272b34]!"
        triggerClassName="min-h-14 px-4! py-3!"
        contentClassName="px-4! pb-4!"
        title={
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-sm font-semibold text-white dark:bg-alpac-primary-700">
              {supplierIndex + 1}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                {supplierName || `Proveedor ${supplierIndex + 1}`}
              </span>
              <span className="block text-[12px] font-normal text-slate-500 dark:text-slate-400">
                {productCount} {productCount === 1 ? "producto" : "productos"}
                {supplier?.its_registered ? " · Registrado" : ""}
              </span>
            </span>
          </div>
        }
      >
        <div className="flex flex-col gap-6 border-t border-t-slate-300 pt-4 dark:border-t-neutral-600">
          {canRemove && (
            <div className="flex justify-end">
              <Button
                type="button"
                size="small"
                label="Eliminar proveedor"
                icon={<Trash2 size={16} />}
                onClick={onRemove}
                className={quoteFormDangerButtonClassName}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-3">
              <InputText
                label="Razón social del proveedor"
                placeholder="Ej: Repuestos El Rápido"
                isRequired
                error={supplierErrors?.supplier_legal_name?.message}
                className={quoteFormInputClassName}
                labelClassName={quoteFormLabelClassName}
                {...register(`${path}.supplier_legal_name`, {
                  required: "Ingrese la razón social del proveedor.",
                  validate: (value) =>
                    value.trim().length >= 2 ||
                    "La razón social debe tener al menos 2 caracteres.",
                })}
              />
            </div>

            <InputText
              label="Nombre del contacto"
              placeholder="Ej: Carlos Ruiz"
              isRequired
              error={supplierErrors?.contact_name?.message}
              className={quoteFormInputClassName}
              labelClassName={quoteFormLabelClassName}
              {...register(`${path}.contact_name`, {
                required: "Ingrese el nombre del contacto.",
              })}
            />
            <InputText
              type="tel"
              label="Teléfono del contacto"
              placeholder="+505 8888-8888"
              error={supplierErrors?.contact_phone_number?.message}
              className={quoteFormInputClassName}
              labelClassName={quoteFormLabelClassName}
              {...register(`${path}.contact_phone_number`)}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <h4 className="m-0! text-[14px]! font-bold text-slate-800 dark:text-white!">
              Productos cotizados
            </h4>
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              {productCount} {productCount === 1 ? "ítem" : "ítems"}
            </span>
          </div>

          <AccordionGroup
            type="multiple"
            value={openProducts}
            onValueChange={(value) =>
              setOpenProducts(
                Array.isArray(value) ? value : value ? [value] : [],
              )
            }
            className="gap-3"
          >
            {fields.map((field, productIndex) => (
              <AccordionItem
                key={field.id}
                value={field.client_id}
                className="rounded-md! border-slate-300! dark:border-slate-600! dark:bg-[#1f232b]!"
                triggerClassName="min-h-12 px-4! py-3!"
                contentClassName="px-4! pb-4!"
                title={
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-alpac-primary-500 px-1.5 text-[11px] font-semibold text-white dark:bg-alpac-primary-700">
                      {productIndex + 1}
                    </span>
                    <span className="text-[14px] font-semibold text-slate-800 dark:text-white">
                      {supplier?.products?.[
                        productIndex
                      ]?.product_name?.trim() || `Producto ${productIndex + 1}`}
                    </span>
                  </div>
                }
              >
                <ProductQuoteFields
                  supplierIndex={supplierIndex}
                  productIndex={productIndex}
                  canRemove={fields.length > 1}
                  onRemove={() => {
                    setProductToDelete({
                      index: productIndex,
                      clientId: field.client_id,
                      name:
                        supplier?.products?.[
                          productIndex
                        ]?.product_name?.trim() ||
                        `Producto ${productIndex + 1}`,
                    });
                  }}
                />
              </AccordionItem>
            ))}
          </AccordionGroup>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Button
              type="button"
              size="giant"
              label="Agregar otro producto"
              icon={<Plus size={20} />}
              className={`w-full! sm:w-auto! ${quoteFormPrimaryButtonClassName}`}
              onClick={() => appendProduct(createEmptyProduct())}
            />
            <Button
              type="button"
              size="giant"
              label="Seleccionar producto"
              icon={<ListChecks size={20} />}
              className={`w-full! sm:w-auto! ${quoteFormOutlineButtonClassName}`}
              onClick={() => setIsSelectProductOpen(true)}
            />
          </div>
        </div>
      </AccordionItem>

      <SelectProductModal
        key={
          isSelectProductOpen
            ? `select-product-${supplierIndex}-open`
            : `select-product-${supplierIndex}-closed`
        }
        isOpen={isSelectProductOpen}
        onClose={() => setIsSelectProductOpen(false)}
        products={MOCK_CATALOG_PRODUCTS}
        onSelect={handleSelectCatalogProduct}
      />

      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        type="CANCEL"
        title={`¿Está seguro de eliminar "${productToDelete?.name ?? "este producto"}" de la cotización?`}
        buttonActionLabel="Eliminar"
        buttonActionClass="rounded-md! bg-red-500! text-white! hover:bg-red-800! dark:bg-red-900!"
        onClose={() => setProductToDelete(null)}
        handleFinalAction={confirmDeleteProduct}
      />
    </>
  );
}
