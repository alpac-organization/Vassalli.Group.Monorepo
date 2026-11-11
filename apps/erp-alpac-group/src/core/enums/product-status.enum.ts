export type ProductStatusEnum = 'Active' |'Inactive'

export interface ProductStatusEnumValues {
   value:      number;
   label:      string;
   labelValue: string;
   BadgeColor: string;
}

export const ProductStatus: Record<ProductStatusEnum, ProductStatusEnumValues> = {
   Active: {
      value:      1,
      label:      "Activo",
      labelValue: "Active",
      BadgeColor: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
   },
   Inactive: {
      value:      2,
      label:      "Inactivo",
      labelValue: "Inactive",
      BadgeColor: "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800"
   }
} as const;
