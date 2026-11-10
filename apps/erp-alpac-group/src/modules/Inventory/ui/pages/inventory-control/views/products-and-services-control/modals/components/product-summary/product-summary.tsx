import { ProductStatus } from "@app/core/enums/product-status.enum";
import { ProductUsageType } from "@app/core/enums/product-usage-type.enum";

import type { ProductSummaryProps } from "./product-summary.types";
import type { ProductStatusEnum } from "@app/core/enums/product-status.enum";
import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";

const DetailItem = ({ label, children }: { label: string; children?: React.ReactNode }) => (
   <div className="space-y-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
         {label}
      </dt>

      <dd className="text-sm text-gray-900 dark:text-gray-100">{children ?? "—"}</dd>
   </div>
);

export const ProductSummary = ({ product }: ProductSummaryProps) => {
   const status = product?.product_status
      ? ProductStatus[product.product_status as ProductStatusEnum]
      : undefined;

   const usageType = product?.usage_type
      ? ProductUsageType[product.usage_type as ProductUsageTypeEnum]
      : undefined;

   return (
      <section className="rounded-lg border border-gray-200 dark:border-gray-700">
         <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="min-w-0">
               <p className="text-xs text-gray-500 dark:text-gray-400">Producto a dar de baja</p>
               <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                  {product?.product_name}
               </h3>
            </div>

            {
               status && (
                  <span
                     className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.BadgeColor}`}
                  >
                     {status.label}
                  </span>
               )
            }
         </header>

         <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-2">
            <DetailItem label="Código">
               {product?.code && <span className="font-mono">{product.code}</span>}
            </DetailItem>

            <DetailItem label="Categoría">
               {
                  product?.category && (
                     <span className="flex flex-wrap items-center gap-2">
                        {product.category.name}
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                           ({product.category.code})
                        </span>
                        {
                           !product.category.is_active && (
                              <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                                 Inactiva
                              </span>
                           )
                        }
                     </span>
                  )
               }
            </DetailItem>

            <DetailItem label="Tipo de uso">{usageType?.label}</DetailItem>
            <DetailItem label="Proveedores asociados">{product?.suppliers_count ?? 0}</DetailItem>

            <div className="sm:col-span-2">
               <DetailItem label="Descripción">{product?.description}</DetailItem>
            </div>
         </dl>
      </section>
   );
};