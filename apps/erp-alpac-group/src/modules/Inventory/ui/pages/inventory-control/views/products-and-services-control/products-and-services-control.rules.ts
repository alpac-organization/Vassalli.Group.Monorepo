import type { ProductStatus } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

const NON_DELETABLE_STATUSES: ProductStatus[] = ["Inactive", "LowProcess"];

export const canDeleteProduct = (status: ProductStatus | null | undefined): boolean =>
   !NON_DELETABLE_STATUSES.includes(status ?? "Active");