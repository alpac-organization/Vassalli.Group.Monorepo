import type { IHttpHandler } from "@app/core/ports";
import type { IAuthenticationServices } from "../../application/interfaces/IAuthenticationServices";
import type { LoginRequest } from "../../domain/ApiContract/Requests/login.request";
import type { LoginResponse } from "../../domain/ApiContract/Responses/login.response";
import type { LogoutRequest } from "../../domain/ApiContract/Requests/logout.request";

export class AuthenticationServices implements IAuthenticationServices {

   private apiHandler: IHttpHandler;
   
   public constructor(httpHandler: IHttpHandler){
      this.apiHandler = httpHandler;
   }

   public async StartLoginProcess(payload: LoginRequest): Promise<LoginResponse> {
      try {
         const response = await this.apiHandler.post<LoginResponse>(`/companies/${payload.company_id}/auth/login`, payload);
         return response
      }
      catch(error){
         throw error;
      }
   }

   public async StartProcessToCloseSession(payload: LogoutRequest): Promise<void> {
      try {
         await this.apiHandler.post("/auth/logout", payload);
      }
      catch(error){
         throw error;
      }
   }
}
