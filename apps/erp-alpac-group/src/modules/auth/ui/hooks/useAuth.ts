import { useNavigate } from "react-router-dom";
import { httpHandler, warehouseHttpHandler } from "@app/core/adapters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { AuthenticationServices } from "@app/modules/auth/infrastructure/services/AuthenticationServices";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";
import {
  clearControlVacationsSelectionStorage,
  clearPayrollSelectionStorage,
  clearSessionPersistedStores,
} from "@app/modules/auth/utils/save-state-storage";

import type { LoginRequest } from "@app/modules/auth/domain/ApiContract/Requests/login.request";
import type { LogoutRequest } from "@app/modules/auth/domain/ApiContract/Requests/logout.request";

const authService = new AuthenticationServices(httpHandler);
httpHandler.setAuthenticationService(authService);
warehouseHttpHandler.setAuthenticationService(authService);

export const useAuth = function () {
  const queryClient = useQueryClient();
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
      useInactivityStore.getState().recordActivity();

      useUserStore.setState({
        fullName: response.full_name,
        email: response.email,
        userName: response.user_name,
        companyId: response.company_information.company_id,
        companyName: response.company_information.company_name,
        companyAlias: response.company_information.alias,
        identificationNumber: response.identification_number,
        userType: response.user_type,
        areaId: response.area_id,
        branchId: response.branch_id,
        branchCode: response.branch_code ?? "",
        costCenterId: response.cost_center_information?.cost_center_id,
        costCenterName: response.cost_center_information?.cost_center_name,
        costCenterCode: response.cost_center_information?.cost_center_code.toString(),
      });

      const sessionLogo = response.company_information.image_url;
      const sessionNeutralLogo = response.company_information.neutral_image_url;
      if (sessionLogo || sessionNeutralLogo) {
        useCompanyStore.setState((prev) => ({
          urlImage: sessionLogo ?? prev.urlImage,
          neutralUrlImage:
            sessionNeutralLogo ?? sessionLogo ?? prev.neutralUrlImage,
        }));
      }

      // Limpiamos queries previas de sesión sin invalidar el catálogo público ["companies"]
      // mientras LoginPage termina de desmontarse durante la navegación.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "companies",
      });

      navigate(`/${companyAlias}/dashboard`, {
        replace: true,
      });
    },
  });

  const startProcessToCloseSession = useMutation({
    mutationKey: ["logout"],
    mutationFn: (payload: LogoutRequest) =>
      authService.StartProcessToCloseSession(payload),
    onSuccess: async () => {
      clearControlVacationsSelectionStorage();
      clearPayrollSelectionStorage();
      clearSessionPersistedStores();
      CookieStorageAdapter.clearAuth();
      queryClient.clear();

      navigate("/auth", {
        replace: true,
      });
    },
    onError: async () => {
      clearControlVacationsSelectionStorage();
      clearPayrollSelectionStorage();
      clearSessionPersistedStores();
      CookieStorageAdapter.clearAuth();
      queryClient.clear();

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
