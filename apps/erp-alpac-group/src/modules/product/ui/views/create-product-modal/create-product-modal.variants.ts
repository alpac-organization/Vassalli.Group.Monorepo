import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import { toOptionalNumber } from "@app/shared/utils/globals.utils";

export const GetTitleModalByProductUsageType: Record<ProductUsageType, string> = {
    Administrative: "Registrar producto administrativo",
    Operational:    "Registrar producto operativo",
};

export const GetTitleModalToEditByProductUsageType: Record<ProductUsageType, string> = {
    Administrative: "Editar producto administrativo",
    Operational:    "Editar producto operativo",
};

//Utils
export const buildStockConfiguration = (values: CreateProductRequest, usageType: ProductUsageType): CreateProductRequest["configuration_stock"] => {
    if (usageType !== "Operational") return null;

    const min = toOptionalNumber(values.configuration_stock?.minimum_stock);
    const max = toOptionalNumber(values.configuration_stock?.maximum_stock);

    if (min === undefined || max === undefined) return null;

    return { minimum_stock: min, maximum_stock: max };
};