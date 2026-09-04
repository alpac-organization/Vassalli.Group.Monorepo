import type { EnumType } from "@app/shared/types/enum.type";

type UnloadingMerchandiseTypeEnumType = EnumType & {
  textValue: string;
};

/**
 * Catálogo de tipos de mercancía para el proceso de descarga.
 *
 * Cada clave representa un tipo de mercancía y su valor asociado contiene
 * el código numérico (`value`) equivalente al enum `UnloadingMerchandiseType`
 * definido en el backend (C#), junto con la etiqueta (`label`) legible
 * para mostrar en la interfaz de usuario.
 *
 * @remarks
 * Debe mantenerse sincronizado con el enum `UnloadingMerchandiseType` del backend:
 * ```csharp
 * public enum UnloadingMerchandiseType
 * {
 *     Bulk = 1,
 *     Armed = 2
 * }
 * ```
 *
 * @example
 * ```typescript
 * const tipo = UnloadingMerchandiseType.Bulk;
 * console.log(tipo.value); // 1
 * console.log(tipo.label); // "Granel"
 * ```
 */
export const UnloadingMerchandiseType = {
  /**
   * Mercancía a granel.
   */
  Bulk: { value: 1, label: "Granel", textValue: "Bulk" },

  /**
   * Mercancía armada.
   */
  Armed: { value: 2, label: "Armada", textValue: "Armed" },
} as const satisfies Record<string, UnloadingMerchandiseTypeEnumType>;

export type UnloadingMerchandiseType =
  (typeof UnloadingMerchandiseType)[keyof typeof UnloadingMerchandiseType];

export const UnloadingMerchandiseTypeOptions = Object.values(UnloadingMerchandiseType);

export type UnloadingMerchandiseTypeValue =
  (typeof UnloadingMerchandiseType)[keyof typeof UnloadingMerchandiseType]["textValue"];
