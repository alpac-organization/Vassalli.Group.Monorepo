import { useNavigate } from "react-router-dom";
import { httpHandler } from "@app/core/adapters";
import { QueryClient, useMutation } from "@tanstack/react-query"
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { AuthenticationServices } from "../../infrastructure/services/AuthenticationServices";

import type { LoginRequest } from "../../domain/ApiContract/Requests/login.request"

const authService = new AuthenticationServices(httpHandler);

export const useAuth = function(){
   const queryClient = new QueryClient();
   const navigate = useNavigate();

   const startLoginProcess = useMutation({
      mutationKey: ["Login"],
      mutationFn:  (payload: LoginRequest) => authService.StartLoginProcess(payload),
      onSuccess:   (response) => {
         
         //Guardamos los token que recibimos de backend.
         CookieStorageAdapter.setToken(response.access_token);
         CookieStorageAdapter.setRefreshToken(response.refresh_token);
         CookieStorageAdapter.setCompanyAlias(response.company_information.company_id.toString());

         navigate(`/${response.company_information.company_id}/dashboard`, {
            replace: true
         });

         queryClient.clear();
      }
   });

   return {
      startLoginProcess
   }
}