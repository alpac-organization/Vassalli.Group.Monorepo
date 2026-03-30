/**
 * @interface GetCollaboratorsResponse
 * @description Define la estructura de datos para la respuesta del listado de colaboradores.
 * Se utiliza principalmente en el panel de administración de colaboradores.
 */
export interface GetCollaboratorsResponse {
  /**
   * Nombre completo del colaborador
   * @example "Juan Perez"
   * @required
   */
  full_name: string;
}
