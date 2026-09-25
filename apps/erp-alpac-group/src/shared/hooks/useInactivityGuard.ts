import { useNavigate } from "react-router-dom";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { clearSessionPersistedStores } from "@app/modules/auth/utils/save-state-storage";
import { useEffect } from "react";

export const useInactivityGuard = () => {
    const { isInactive } = useInactivityStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInactive) {
            clearSessionPersistedStores();
            CookieStorageAdapter.clearAuth();
            navigate("/auth", { replace: true });
        }
    }, [isInactive, navigate]);
}