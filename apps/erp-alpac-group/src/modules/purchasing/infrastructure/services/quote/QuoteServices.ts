import type { IHttpHandler } from "@app/core/ports";
import type { IQuotesServices } from "@app/modules/purchasing/application/interfaces/quote/IQuotesServices";

export class QuoteServices implements IQuotesServices {
   private readonly apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async RegisterQuote(payload: any): Promise<void> { 
      try {
         
         const { company_id, module_code, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/quotations`;

         await this.apiHandler.post<void>(url, rest);

      } catch (error) {
         throw error;
      }
   };

   async UpdateQuote(payload: any): Promise<void> { 
      try {
         
      } catch (error) {
         throw error;
      }
   };
}