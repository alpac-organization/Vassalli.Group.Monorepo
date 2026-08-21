import type { IHttpHandler } from "@app/core/ports";
import type { INotificationConfigServices } from "../../application/interfaces/INotificationConfigServices";

export class NotificationConfigServices implements INotificationConfigServices {

   private apiHandler: IHttpHandler;

   public constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   public async RegisterPushToken(company_id: string, token: string): Promise<void> {
      try{
         await this.apiHandler.post(`/companies/${company_id}/push-tokens`, {
            token,
         });
      }
      catch(error){
         throw error;
      }
   }

   public async UnlinkPushToken(company_id: string, token: string): Promise<void> {
      try{
         await this.apiHandler.post(`/companies/${company_id}/push-tokens/unlink`, { 
            token 
         });
      }
      catch(error){
         throw error;
      }
   }
}