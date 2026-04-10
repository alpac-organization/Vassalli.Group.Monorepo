/**
 * @interface GetCollaboratorsResponse
 * @description Define la estructura de datos para la respuesta del listado de colaboradores.
 * Se utiliza principalmente en el panel de administración de colaboradores.
 */
export interface GetCollaboratorsResponse {
   /**
    * Id del colaborador
    * @example "123e4567-e89b-12d3-a456-426614174000"
    * @required
    */
   collaborator_id: string;

   /**
    * Nombre completo del colaborador
    * @example "Juan Perez"
    * @required
    */
   full_name: string;

   /**
    * Primer nombre del colaborador
    * @example "Juan"
    * @required
    */
   first_name: string;

   /**
    * Primer apellido del colaborador
    * @example "Perez"
    * @required
    */
   first_lastname: string;

   /**
    * Estado del colaborador
    * @example "Activo"
    * @required
    */
   status: string;

   /**
    * Numero de identificación del colaborador
    * @example "001-120395-0000X"
    * @required
    */
   identification_number: string;

   /**
    * Codigo del colaborador
    * @example "COLL-001"
    * @required
    */
   collaborator_code: string;

   /**
    * Area de trabajo del colaborador
    * @example "Tecnología"
    * @required
    */
   work_area: string;

   /**
    * Posición de trabajo del colaborador
    * @example "Contador"
    * @required
    */
   work_position: string;

   /**
    * Nombre de la sucursal
    * @example "Sucursal 1"
    * @required
    */
   branch_name: string;

   /**
    * Días de vacaciones del colaborador
    * @example 15
    * @required
    */
   vacations: number;
}

/**
 * @interface GetCollaboratorsListResponse
 * @description Envuelve la respuesta paginada del listado de colaboradores
 */
export interface GetCollaboratorsListResponse {
   data: GetCollaboratorsResponse[];
   total_records: number;
   page_size: number;
   page_number: number;
   total_active: number;
   total_on_vacation: number;
   total_on_subsidy: number;
   total_collaborators: number;
}
