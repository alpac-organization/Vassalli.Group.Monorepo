import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

export const useMappedError = () => {

   const getMappedError = (error: ApiErrorResponse) => {

      return {
         status: error.status,
         typeError: error.error.typeError,
         description: error.error.description,
         createdAt: error.createdAt,
      }
   }

   return {
      getMappedError
   }
}