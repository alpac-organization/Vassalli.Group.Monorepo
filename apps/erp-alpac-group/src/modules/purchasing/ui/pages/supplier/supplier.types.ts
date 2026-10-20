import type { SupplierExclusiveStatus } from "@app/core/enums/supplier-exclusive-status.enum"
import type { EnumType } from "@app/shared/types/enum.type"

export type SupplierVariants = Omit<EnumType, "value"> & {
   badgeColor: string
}

export type SupplierFilterValues = {
   identification_number?: string
   constitution_type?: string
   commercial_name?: string
   exclusive_status?: SupplierExclusiveStatus
}

export type SupplierListFilters = SupplierFilterValues & {
   page_number: number
}