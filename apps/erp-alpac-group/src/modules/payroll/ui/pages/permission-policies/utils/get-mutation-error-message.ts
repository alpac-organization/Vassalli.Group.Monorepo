import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

export function getMutationErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "error" in err) {
    const apiError = err as ApiErrorResponse;
    return apiError.error?.description ?? "Ocurrió un error inesperado.";
  }
  return "Ocurrió un error inesperado.";
}
