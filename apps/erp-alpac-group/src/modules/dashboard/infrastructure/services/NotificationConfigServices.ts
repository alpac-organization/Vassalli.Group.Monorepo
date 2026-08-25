import type { IHttpHandler } from "@app/core/ports";
import type { INotificationConfigServices } from "@app/modules/dashboard/application/interfaces/INotificationConfigServices";
import type { RegisterPushTokenRequest } from "@app/modules/dashboard/domain/ApiContract/Requests/register-push-token.request";
import type { UnlinkPushTokenRequest } from "@app/modules/dashboard/domain/ApiContract/Requests/unlink-push-token.request";

export class NotificationConfigServices implements INotificationConfigServices {

   private apiHandler: IHttpHandler;

   public constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   public async RegisterPushToken(payload: RegisterPushTokenRequest): Promise<void> {
      try {

         const { company_id, token, device_name } = payload;

         const body: { token: string, device_name?: string } = { token };

         if (device_name) body["device_name"] = device_name;

         await this.apiHandler.post(`/companies/${company_id}/notifications/register-device-token`, body);
      }
      catch (error) {
         throw error;
      }
   }

   public async UnlinkPushToken(payload: UnlinkPushTokenRequest): Promise<void> {
      try {
         const { company_id, token } = payload;         
         await this.apiHandler.post(`/companies/${company_id}/notifications/unlink-arn-token`, {
            token
         });
      }
      catch (error) {
         throw error;
      }
   }
}