import axios, { AxiosError, type AxiosInstance } from "axios";
import type { IHttpHandler } from "@app/core/ports";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { CookieStorageAdapter } from "@app/core/adapters/cookie-storage-adapter";
import type { CustomInternalAxiosRequestConfig } from "../interfaces/CustomInternalAxiosRequestConfig";
import type { IAuthenticationServices } from "@app/modules/auth/application/interfaces/IAuthenticationServices";
import type { LoginResponse } from "@app/modules/auth/domain/ApiContract/Responses/login.response";
import { AuthenticationServices } from "@app/modules/auth/infrastructure/services/AuthenticationServices";
import { useInactivityStore } from "@app/shared/stores/useInactivityStore";
import { useServerErrorStore } from "@app/shared/stores/useServerErrorStore";
import {
  clearControlVacationsSelectionStorage,
  clearPayrollSelectionStorage,
  clearSessionPersistedStores,
} from "@app/modules/auth/utils/save-state-storage";
import { getDeviceName } from "@app/shared/utils/device-name.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";

type ConfigType = {
  baseUrl?: string;
  apiKey?: string;
};

class AxiosHttpAdapter implements IHttpHandler {
  private instance: AxiosInstance;
  private authenticationService?: IAuthenticationServices;
  private static sharedAuthService?: IAuthenticationServices;
  private static sharedRefreshPromise: Promise<LoginResponse | null> | null =
    null;
  private static sharedRefreshIntervalId?: ReturnType<typeof setInterval>;

  public setAuthenticationService(
    authenticationService: IAuthenticationServices,
  ) {
    this.authenticationService = authenticationService;
    AxiosHttpAdapter.sharedAuthService = authenticationService;
  }

  constructor(config?: ConfigType) {
    const baseURL = config?.baseUrl ?? import.meta.env.VITE_API_URL;
    const apiKey = config?.apiKey ?? import.meta.env.VITE_API_KEY;
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-device-name": getDeviceName(),
      },
    });

    // Inicia un único intervalo compartido de refresh token cada 15 minutos
    AxiosHttpAdapter.ensureSharedRefreshInterval(15 * 60 * 1000, () =>
      this.refreshToken(),
    );

    // Interceptor to request
    this.instance.interceptors.request.use((config) => {
      const token = CookieStorageAdapter.getToken();

      // Verifico si la peticion es para iniciar sesion
      const isLoginRequest = config.url?.includes("/auth/login");

      // Verifico si la peticion es para renovar el token
      const isRefreshTokenRequest = config.url?.includes("/auth/refresh-token");

      if (token && !isLoginRequest && !isRefreshTokenRequest) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    });

    // Interceptor to response
    this.instance.interceptors.response.use(
      (response) => {
        useServerErrorStore.getState().clearServerError();
        return response;
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        const httpStatus = error.response?.status;

        const customError: ApiErrorResponse = {
          status: httpStatus ?? 500,
          error: {
            typeError:
              error.response?.data?.error?.typeError || "INTERNAL_CLIENT_ERROR",
            description:
              error.response?.data?.error?.description ||
              "Ocurrio un error inesperado en la comunicacion.",
          },
          createdAt:
            error.response?.data?.createdAt || new Date().toISOString(),
        };

        const originalRequest =
          error.config as CustomInternalAxiosRequestConfig;

        if (
          httpStatus === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("auth/login") &&
          !originalRequest.url?.includes("auth/refresh-token")
        ) {
          // Marcar que ya se esta intentando renovar el token
          originalRequest._retry = true;

          try {
            // Intento renovar el token (compartiendo la promesa en vuelo si hay varios 401 paralelos)
            const response = await this.refreshToken();

            if (response?.access_token) {
              // Actualizo el token en el header
              originalRequest.headers["Authorization"] =
                `Bearer ${response.access_token}`;

              // Reintento la peticion original con el nuevo token
              return this.instance(originalRequest);
            } else {
              throw new Error("No se pudo renovar el token");
            }
          } catch (refreshTokenError) {
            this.logout();

            // Rechazo la promesa para que el codigo que llama al servicio pueda manejar el error
            return Promise.reject(refreshTokenError);
          }
        }

        if (httpStatus === 503) {
          useServerErrorStore.getState().showServerError({
            status: httpStatus,
          });
        }

        return Promise.reject(customError);
      },
    );
  }

  private static ensureSharedRefreshInterval(
    miliseconds: number,
    refreshCallback: () => Promise<LoginResponse | null>,
  ) {
    if (AxiosHttpAdapter.sharedRefreshIntervalId) return;

    AxiosHttpAdapter.sharedRefreshIntervalId = setInterval(async () => {
      if (!CookieStorageAdapter.hasSession()) return;

      const { isInactive, lastActivity } = useInactivityStore.getState();
      const now = Date.now();
      const inactivityThreshold = 20 * 60 * 1000;

      if (isInactive || now - lastActivity > inactivityThreshold) {
        console.warn(
          "Sesion en pausa por inactividad. El token expirara naturalmente.",
        );
        return;
      }

      try {
        await refreshCallback();
      } catch (error) {
        console.warn("No fue posible refrescar el token en segundo plano:", error);
      }
    }, miliseconds);
  }

  private logout() {
    clearControlVacationsSelectionStorage();
    clearPayrollSelectionStorage();
    clearSessionPersistedStores();

    CookieStorageAdapter.clearAuth();
    if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
      window.location.href = "/auth";
    }
  }

  private async refreshToken(): Promise<LoginResponse | null> {
    if (AxiosHttpAdapter.sharedRefreshPromise) {
      return AxiosHttpAdapter.sharedRefreshPromise;
    }

    const authService =
      this.authenticationService ?? AxiosHttpAdapter.sharedAuthService;
    const refreshToken = CookieStorageAdapter.getRefreshToken();
    const companyId = useUserStore.getState().companyId;

    if (!refreshToken || !companyId || !authService) {
      return null;
    }

    AxiosHttpAdapter.sharedRefreshPromise = (async () => {
      try {
        const response = await authService.StartProcessToRefreshToken({
          company_id: companyId,
          refresh_token: refreshToken,
        });

        CookieStorageAdapter.setToken(response.access_token);
        CookieStorageAdapter.setRefreshToken(response.refresh_token);

        return response;
      } finally {
        AxiosHttpAdapter.sharedRefreshPromise = null;
      }
    })();

    return AxiosHttpAdapter.sharedRefreshPromise;
  }

  async get<T>(url: string, config?: object): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: object, config?: object): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: object, config?: object): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: object): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: object, config?: object): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }
}

// Exportamos las instancias singleton con el servicio de autenticacion configurado en ambas
export const httpHandler = new AxiosHttpAdapter();

export const warehouseHttpHandler = new AxiosHttpAdapter({
  baseUrl: import.meta.env.VITE_API_URL_WAREHOUSE ?? "/api-warehouse",
  apiKey: import.meta.env.VITE_API_KEY_WAREHOUSE,
});

const defaultAuthenticationService = new AuthenticationServices(httpHandler);
httpHandler.setAuthenticationService(defaultAuthenticationService);
warehouseHttpHandler.setAuthenticationService(defaultAuthenticationService);
