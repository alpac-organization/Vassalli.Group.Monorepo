import type { IHttpHandler } from "@app/core/ports";
import type { IAuthenticationServices } from "../../application/interfaces/IAuthenticationServices";
import type { LoginRequest } from "../../domain/ApiContract/Requests/login.request";
import type { LoginResponse } from "../../domain/ApiContract/Responses/login.response";
import type { LogoutRequest } from "../../domain/ApiContract/Requests/logout.request";
import type { RefreshTokenRequest } from "../../domain/ApiContract/Requests/refresh.token.request";
import type { ITokenRefresh } from "@app/core/ports/ITokenRefresh";

export class AuthenticationServices implements IAuthenticationServices, ITokenRefresh {

   private apiHandler: IHttpHandler;
   private isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

   public constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   public async StartLoginProcess(payload: LoginRequest): Promise<LoginResponse> {
      try {

         const key = this.isEmail(payload.username) ? "email" : "username";

         const filteredPayload =
         {
            password: payload.password,
            [key]: payload.username,
            company_id: payload.company_id
         }

         const response = await this.apiHandler.post<LoginResponse>(`/companies/${payload.company_id}/auth/login`, filteredPayload);
         return response
      }
      catch (error) {
         throw error;
      }
   }

   public async StartProcessToCloseSession(payload: LogoutRequest): Promise<void> {
      try {
         await this.apiHandler.post(`companies/${payload.company_id}/auth/logout`, payload);
      }
      catch (error) {
         throw error;
      }
   }

   public async StartProcessToRefreshToken(payload: RefreshTokenRequest): Promise<any> {
      try {
         const response = await this.apiHandler.post<any>(`/companies/${payload.company_id}/auth/refresh-token`, payload);
         return response;
      }
      catch (error) {
         throw error
      }
   }
}
