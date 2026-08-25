import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterPushTokenRequest extends Omit<BaseRequest, "module_code"> {
   /**
    * Token FCM del dispositivo
    */
   token: string;

   /**
    * Nombre del dispositivo
    */
   device_name?: string;
}