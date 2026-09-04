import type { EnumType } from "@app/shared/types/enum.type";

type UnloadingStatusEnumType = EnumType & {
  textValue: string;
};

/**
 * Catálogo de estados posibles para el proceso de descarga de mercancía.
 *
 * Cada clave representa un estado del proceso de descarga y su valor
 * asociado contiene el código numérico (`value`) equivalente al enum
 * `UnloadingStatus` definido en el backend (C#), junto con la etiqueta
 * (`label`) legible para mostrar en la interfaz de usuario.
 *
 * @remarks
 * Debe mantenerse sincronizado con el enum `UnloadingStatus` del backend:
 * ```csharp
 * public enum UnloadingStatus
 * {
 *     Pending = 1,
 *     InProgress = 2,
 *     Paused = 3,
 *     Completed = 4,
 *     Cancelled = 5
 * }
 * ```
 *
 * @example
 * ```typescript
 * const estado = UnloadingStatus.InProgress;
 * console.log(estado.value); // 2
 * console.log(estado.label); // "En Progreso"
 * ```
 */
export const UnloadingStatus = {
  /**
   * La descarga aún no ha sido iniciada.
   */
  Pending: { value: 1, label: "Pendiente", textValue: "Pending" },

  /**
   * La descarga se encuentra actualmente en curso.
   */
  InProgress: { value: 2, label: "En Progreso", textValue: "InProgress" },

  /**
   * La descarga fue iniciada pero se encuentra temporalmente detenida.
   */
  Paused: { value: 3, label: "Pausado", textValue: "Paused" },

  /**
   * La descarga finalizó exitosamente.
   */
  Completed: { value: 4, label: "Completado", textValue: "Completed" },

  /**
   * La descarga fue cancelada y no será completada.
   */
  Cancelled: { value: 5, label: "Cancelado", textValue: "Cancelled" },
} as const satisfies Record<string, UnloadingStatusEnumType>;

export type UnloadingStatus =
  (typeof UnloadingStatus)[keyof typeof UnloadingStatus];

export const UnloadingStatusOptions = Object.values(UnloadingStatus);

export type UnloadingStatusType =
  (typeof UnloadingStatus)[keyof typeof UnloadingStatus]["textValue"];
