import type { EnumType } from "@app/shared/types/enum.type";

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
export const UnloadingStatus: Record<string, EnumType> = {

    /**
     * La descarga aún no ha sido iniciada.
     */
    Pending: { 
        value: 1, 
        label: "Pendiente" 
    },

    /**
     * La descarga se encuentra actualmente en curso.
     */
    InProgress: { 
        value: 2, 
        label: "En Progreso" 
    },

    /**
     * La descarga fue iniciada pero se encuentra temporalmente detenida.
     */
    Paused: { 
        value: 3, 
        label: "Pausado" 
    },

    /**
     * La descarga finalizó exitosamente.
     */
    Completed: { 
        value: 4, 
        label: "Completado" 
    },

    /**
     * La descarga fue cancelada y no será completada.
     */
    Cancelled: { 
        value: 5, 
        label: "Cancelado" 
    },
};