import type { EnumType } from "@app/shared/types/enum.type";
export const BankEnum = {
  BANPRO: { value: 1, label: "BANPRO" },
  BAC: { value: 2, label: "BAC" },
  LAFISE: { value: 3, label: "LAFISE" },
  BDF: { value: 4, label: "BDF" },
  AVANZ: { value: 5, label: "AVANZ" },
  FICOHSA: { value: 6, label: "FICOHSA" },
};
export type BankEnum = (typeof BankEnum)[keyof typeof BankEnum];
export const BankOptions: EnumType[] = Object.values(BankEnum) as EnumType[];
