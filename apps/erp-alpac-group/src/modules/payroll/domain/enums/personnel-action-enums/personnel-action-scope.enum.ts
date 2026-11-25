import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry } from "./personnel-action-enum.utils";

export const PersonnelActionScopeEnum = {
  Individual: { value: 1, label: "Individual" },
  Group: { value: 2, label: "Masivo" },
  ByArea: { value: 3, label: "Por Área" },
} as const satisfies Record<string, EnumType>;

export type PersonnelActionScopeEnum =
  (typeof PersonnelActionScopeEnum)[keyof typeof PersonnelActionScopeEnum];

export const PersonnelActionScopeOptions: EnumType[] = Object.values(
  PersonnelActionScopeEnum,
);

export function getPersonnelActionScopeLabel(scope: string | number): string {
  return resolveEnumEntry(PersonnelActionScopeEnum, scope)?.label ?? "Desconocido";
}
