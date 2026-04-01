import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

/**
 * Mensaje legible a partir de la respuesta de error de la API al cargar el perfil.
 */
export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "error" in err) {
    const e = err as ApiErrorResponse;
    return e.error?.description ?? "Ocurrió un error al cargar el perfil.";
  }
  return "Ocurrió un error al cargar el perfil.";
}
