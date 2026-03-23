/**
 * @interface ApiErrorResponse
 * @description Estructura estándar para las respuestas de error enviadas por el backend de ALPAC.
 * Se utiliza para capturar y procesar fallos en las peticiones HTTP de forma consistente
 * en todas las capas de la aplicación (Core, Domain e Infrastructure).
 * 
 * @example
 * {
 *    "status": 401,
 *    "error": {
 *        "typeError": "ERP:01",
 *        "description": "This a error"
 *    },
 *    "createdAt": "2026-03-21 10:42:36"
 * }
 */
export interface ApiErrorResponse {
   /**
    * @property {number} status
    * @description Código de estado HTTP de la respuesta (ej. 400, 401, 404, 500).
    */
   status: number;

   /**
    * @property {Object} error
    * @description Objeto que contiene el detalle técnico del error.
    */
   error: {
      /**
       * @property {string} typeError
       * @description Identificador único del error (Slug). 
       * Útil para lógica de negocio o traducciones (ej. 'ERP:InvalidSession').
       */
      typeError: string;

      /**
       * @property {string} description
       * @description Mensaje descriptivo del error destinado al usuario o desarrollador.
       */
      description: string;
   };

   /**
    * @property {string} createdAt
    * @description Fecha y hora en que se generó el error en el servidor.
    * Formato esperado: YYYY-MM-DD HH:mm:ss.
    */
   createdAt: string;
}