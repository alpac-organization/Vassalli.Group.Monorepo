import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * @interface CollaboratorProfileDetailsRequest
 * @description Define la estructura para las solicitud de detalles de colaboradores
 * este contrato asegura que los datos enviados al backend cumplan con los requisitos del servidor
 */
export interface CollaboratorProfileDetailsRequest extends BaseRequest {
   /**
    * Puede ser cedula nicaraguense, cedula de residencia o pasaporte
    * @example "0011203950000X"
    * @required
    */
   identification_number: string;   

   /**
    * Indica si la consulta debe ser ejecutada o no
    * @optional
    */
   QueryEnabled?: boolean;
}
