import type { EnumType } from "@app/shared/types/enum.type"

export type SupplierVariants = Omit<EnumType, "value"> & {
   badgeColor: string
}