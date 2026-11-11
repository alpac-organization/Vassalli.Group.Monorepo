import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";

export const GetTitleModalByProductUsageType: Record<ProductUsageTypeEnum, string> = {
    Administrative: "Registrar producto administrativo",
    Operational:    "Registrar producto operativo",
};

export const GetTitleModalToEditByProductUsageType: Record<ProductUsageTypeEnum, string> = {
    Administrative: "Editar producto administrativo",
    Operational:    "Editar producto operativo",
};