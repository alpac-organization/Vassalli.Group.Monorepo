import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * @interface DeactivateCollaboratorRequest
 * @description Define la estructura para la desactivacion de un colaborador
 */
export interface DeactivateCollaboratorRequest extends BaseRequest {
    
   /**
    * Puede ser cedula nicaraguense, cedula de residencia o pasaporte
    * @example "0011203950000X"
    * @required
    */
   identification_number: string;
}
