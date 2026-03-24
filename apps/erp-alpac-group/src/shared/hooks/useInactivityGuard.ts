import { useNavigate } from "react-router-dom";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import { useEffect } from "react";

export const useInactivityGuard = () => {
    const { isInactive } = useInactivityStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isInactive) {
            CookieStorageAdapter.clearAuth();
            navigate("/auth", { replace: true });
        }
    }, [isInactive, navigate]);
}