import { useNavigate } from "react-router-dom";
import { httpHandler } from "@app/core/adapters";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { AuthenticationServices } from "@app/modules/auth/infrastructure/services/AuthenticationServices";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { clearControlVacationsSelectionStorage } from "@app/modules/auth/utils/save-state-storage";

import type { LoginRequest } from "@app/modules/auth/domain/ApiContract/Requests/login.request";
import type { LogoutRequest } from "@app/modules/auth/domain/ApiContract/Requests/logout.request";

const authService = new AuthenticationServices(httpHandler);
httpHandler.setAuthenticationService(authService);

export const useAuth = function () {
  const queryClient = new QueryClient();
  const navigate = useNavigate();

  const startLoginProcess = useMutation({
    mutationKey: ["Login"],
    mutationFn: (payload: LoginRequest) =>
      authService.StartLoginProcess(payload),
    onSuccess: (response) => {
      const companyAlias = response.company_information.alias.toLowerCase();

      //Guardamos los token que recibimos de backend.
      CookieStorageAdapter.setToken(response.access_token);
      CookieStorageAdapter.setRefreshToken(response.refresh_token);
      CookieStorageAdapter.setCompanyAlias(companyAlias);

      useUserStore.setState({
        fullName: response.full_name,
        email: response.email,
        userName: response.user_name,
        companyId: response.company_information.company_id,
        companyName: response.company_information.company_name.toString(),
        companyAlias: response.company_information.alias,
        identificationNumber: response.identification_number,
        userType: response.user_type,
      });

      navigate(`/${companyAlias}/dashboard`, {
        replace: true,
      });

      queryClient.clear();
    },
  });

  const startProcessToCloseSession = useMutation({
    mutationKey: ["logout"],
    mutationFn: (payload: LogoutRequest) =>
      authService.StartProcessToCloseSession(payload),
    onSuccess: () => {
      clearControlVacationsSelectionStorage();
      CookieStorageAdapter.clearAuth();

      navigate("/auth", {
        replace: true,
      });
    },
    onError: () => {
      clearControlVacationsSelectionStorage();
      CookieStorageAdapter.clearAuth();

      navigate("/auth", {
        replace: true,
      });
    },
  });

  return {
    startLoginProcess,
    startProcessToCloseSession,
  };
};
