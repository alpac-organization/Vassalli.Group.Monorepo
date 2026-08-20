import { useCallback } from "react";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

export const useMappedError = () => {
  const getMappedError = useCallback((error: ApiErrorResponse) => {
    return {
      status: error?.status ?? 500,
      typeError: error?.error?.typeError || "INTERNAL_CLIENT_ERROR",
      description:
        error?.error?.description ||
        "Ocurrio un error inesperado en la comunicacion.",
      createdAt: error?.createdAt || new Date().toISOString(),
    };
  }, []);

  return {
    getMappedError,
  };
};
