import { useNavigate } from "react-router-dom";
import { httpHandler } from "@app/core/adapters";
import { QueryClient, useMutation } from "@tanstack/react-query"
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { AuthenticationServices } from "@app/modules/auth/infrastructure/services/AuthenticationServices";
import { useUserStore } from "@app/shared/stores/useUserStore";

import type { LoginRequest } from "@app/modules/auth/domain/ApiContract/Requests/login.request"
import type { LogoutRequest } from "@app/modules/auth/domain/ApiContract/Requests/logout.request";

const authService = new AuthenticationServices(httpHandler);

httpHandler.setRefreshTokenService(authService);

export const useAuth = function () {
   const queryClient = new QueryClient();
   const navigate = useNavigate();

   const startLoginProcess = useMutation({
      mutationKey: ["Login"],
      mutationFn: (payload: LoginRequest) => authService.StartLoginProcess(payload),
      onSuccess: (response) => {

         //Guardamos los token que recibimos de backend.
         CookieStorageAdapter.setToken(response.access_token);
         CookieStorageAdapter.setRefreshToken(response.refresh_token);
         CookieStorageAdapter.setCompanyAlias(response.company_information.company_id.toString());

         useUserStore.setState({
            fullName: response.full_name,
            email: response.email,
            userName: response.user_name,
            companyName: response.company_information.company_name.toString(),
            companyAlias: response.company_information.alias
         })

         navigate(`/${response.company_information.company_id}/dashboard`, {
            replace: true
         });

         queryClient.clear();
      }
   });

   const startProcessToCloseSession = useMutation({
      mutationKey: ["logout"],
      mutationFn: (payload: LogoutRequest) => authService.StartProcessToCloseSession(payload),
      onSuccess: () => {
         CookieStorageAdapter.clearAuth()

         navigate("/auth", {
            replace: true
         });
      },
      onError: () => {
         CookieStorageAdapter.clearAuth()

         navigate("/auth", {
            replace: true
         });
      }
   });

   return {
      startLoginProcess,
      startProcessToCloseSession
   }
}