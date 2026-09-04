import type { EnumType } from "@app/shared/types/enum.type";

type PalletTypeEnumType = EnumType & {
  textValue: string;
};

/**
 * Catálogo de tipos de pallet para el proceso de descarga.
 *
 * Cada clave representa un tipo de pallet y su valor asociado contiene
 * el código numérico (`value`) equivalente al enum `PalletType` definido
 * en el backend (C#), junto con la etiqueta (`label`) legible para
 * mostrar en la interfaz de usuario.
 *
 * @remarks
 * Debe mantenerse sincronizado con el enum `PalletType` del backend:
 * ```csharp
 * public enum PalletType
 * {
 *     Standard = 1,
 *     Oversized = 2
 * }
 * ```
 *
 * @example
 * ```typescript
 * const tipo = PalletType.Standard;
 * console.log(tipo.value); // 1
 * console.log(tipo.label); // "Estándar"
 * ```
 */
export const PalletType = {
  /**
   * Pallet de medidas estándar.
   */
  Standard: { value: 1, label: "Estándar", textValue: "Standard" },

  /**
   * Pallet sobredimensionado.
   */
  Oversized: { value: 2, label: "Sobredimensionado", textValue: "Oversized" },
} as const satisfies Record<string, PalletTypeEnumType>;

export type PalletType = (typeof PalletType)[keyof typeof PalletType];

export const PalletTypeOptions = Object.values(PalletType);

export type PalletTypeValue =
  (typeof PalletType)[keyof typeof PalletType]["textValue"];
