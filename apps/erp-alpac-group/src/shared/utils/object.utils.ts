/**
 * Utilidades para la manipulación y limpieza de objetos.
 */

/**
 * Limpia un objeto eliminando las propiedades que contienen valores vacíos, nulos, indefinidos o ceros.
 * Útil para limpiar parámetros de búsqueda antes de enviarlos a una petición GET.
 *
 * @param params - El objeto original a limpiar.
 * @returns Un nuevo objeto que contiene solo las propiedades con valores válidos.
 *
 * @example
 * cleanParams({ name: "Juan", age: 0, city: "" }) // retorna { name: "Juan" }
 */
export const cleanParams = <T extends object>(params: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      return (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== 0 &&
        !(Array.isArray(value) && value.length === 0)
      );
    }),
  ) as Partial<T>;
};
