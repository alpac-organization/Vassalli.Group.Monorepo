export type KardexTypeEnum = "Operational" | "Administrative";

export interface KardexTypeEnumValues {
   value: number;
   label: string;
}

export const KardexType : Record<KardexTypeEnum, KardexTypeEnumValues> = {
   Operational: {
      value: 1,
      label: "Operativo",
   },
   Administrative: {
      value: 2,
      label: "Administrativo",
   }
} as const;
