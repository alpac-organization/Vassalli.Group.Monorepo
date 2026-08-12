import type { IHttpHandler } from "@app/core/ports";
import type { IQuotesServices } from "@app/modules/purchasing/application/interfaces/quote/IQuotesServices";
import type { RegisterQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { UpdateQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/update-quote-request";
import { cleanParams } from "@app/shared/utils/object.utils";

export class QuoteServices implements IQuotesServices {

   private readonly apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async RegisterQuote(payload: RegisterQuoteRequest): Promise<void> {
      try {
         const { company_id, module_code, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/quotations`;

         await this.apiHandler.post<void>(url, rest);

      } catch (error) {

         throw error;
      }
   };

   async UpdateQuote(payload: UpdateQuoteRequest): Promise<void> {
      try {
         const { company_id, module_code, quotation_id, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/quotations/${quotation_id}`;

         await this.apiHandler.patch<void>(url, rest);

      } catch (error) {

         throw error;
      }
   };

   async GetQuoteDetails(payload: any): Promise<any> {
      try {
         const { company_id, module_code, quotation_id, ...rest } = payload;

         const url = `/companies/${company_id}/modules/${module_code}/quotations/${quotation_id}/details`;

         const response = await this.apiHandler.get<any>(url, { params: cleanParams(rest) });

         return response;

      } catch (error) {

         throw error;
      }
   };
}