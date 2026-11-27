import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { httpHandler } from "@app/core/adapters";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { AuthenticationServices } from "@app/modules/auth/infrastructure/services/AuthenticationServices";
import {
   clearControlVacationsSelectionStorage,
   clearPayrollSelectionStorage,
   clearSessionPersistedStores,
} from "@app/modules/auth/utils/save-state-storage";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";
import { useUserStore } from "@app/shared/stores/useUserStore";

const inactivityAuthService = new AuthenticationServices(httpHandler);

export const useInactivityGuard = () => {
   const isInactive = useInactivityStore((state) => state.isInactive);
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const isClosingRef = useRef(false);

   useEffect(() => {
      if (!isInactive || isClosingRef.current) return;
      isClosingRef.current = true;

      const companyId = useUserStore.getState().companyId;
      const refreshToken = CookieStorageAdapter.getRefreshToken();

      if (companyId && refreshToken) {
         void inactivityAuthService
            .StartProcessToCloseSession({
               company_id: companyId,
               refresh_token: refreshToken,
            })
            .catch(() => undefined);
      }

      clearControlVacationsSelectionStorage();
      clearPayrollSelectionStorage();
      clearSessionPersistedStores();
      CookieStorageAdapter.clearAuth();
      queryClient.clear();
      useInactivityStore.getState().recordActivity();

      navigate("/auth", { replace: true });
   }, [isInactive, navigate, queryClient]);
};
