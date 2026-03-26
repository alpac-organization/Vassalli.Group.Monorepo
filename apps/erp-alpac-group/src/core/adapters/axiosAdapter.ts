import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { IHttpHandler } from '@app/core/ports';
import type { ApiErrorResponse } from '@app/core/interfaces/ErrorResponse';
import { CookieStorageAdapter } from '@app/core/adapters/cookie-storage-adapter';
import { getBrowserName } from '@app/core/enums/user-agent.enum';
import type { CustomInternalAxiosRequestConfig } from '../interfaces/CustomInternalAxiosRequestConfig';
import type { ITokenRefresh } from '@app/core/ports/ITokenRefresh';
import { useInactivityStore } from '@app/shared/stores/useInactivityStore';

export class AxiosHttpAdapter implements IHttpHandler {

   private instance: AxiosInstance;
   private apiKey = import.meta.env.VITE_API_KEY;
   private refreshIntervalId?: NodeJS.Timeout;
   private refresher?: ITokenRefresh;

   public setRefreshTokenService(refresher: ITokenRefresh) {
      this.refresher = refresher;
   }

   constructor() {

      this.instance = axios.create({
         baseURL: import.meta.env.VITE_API_URL || '/api',
         headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "x-device-name": getBrowserName(navigator.userAgent)
         },
      });

      // Inicia el refresh token cada 20 minutos
      this.startRefreshToken(20 * 60 * 1000);

      // Interceptor to request
      this.instance.interceptors.request.use((config) => {
         const token = CookieStorageAdapter.getToken();

         if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
         }

         return config;
      });

      // Interceptor to response
      this.instance.interceptors.response.use(
         (response) => response,
         async (error: AxiosError<ApiErrorResponse>) => {

            // Map the error to a custom error
            const customError: ApiErrorResponse = {
               status: error.response?.status || 500,
               error: {
                  typeError: error.response?.data?.error?.typeError || 'INTERNAL_CLIENT_ERROR',
                  description: error.response?.data?.error?.description || 'Ocurrió un error inesperado en la comunicación.'
               },
               createdAt: error.response?.data?.createdAt || new Date().toISOString()
            };

            // Obtengo la configuración de la petición original
            // Adicionno el tipo CustomInternalAxiosRequestConfig para poder acceder a la propiedad _retry
            const originalRequest = error.config as CustomInternalAxiosRequestConfig

            // Reviso el estado de la petición
            if (
               customError.status === 401 &&
               originalRequest &&
               !originalRequest._retry &&
               !originalRequest.url?.includes('auth/refresh-token')
            ) {

               // Marcar que ya se está intentando renovar el token
               originalRequest._retry = true

               try {

                  // Intento renovar el token
                  const response = await this.refreshToken()

                  if (response) {

                     // Actualizo el token en el header
                     originalRequest.headers['Authorization'] = `Bearer ${response.access_token}`

                     // Reintento la petición original con el nuevo token
                     return this.instance(originalRequest)

                  } else {
                     throw new Error("No se pudo renovar el token")
                  }

               } catch (refreshTokenError) {

                  this.logout()

                  // Rechazo la promesa para que el código que llamó al servicio pueda manejar el error
                  return Promise.reject(refreshTokenError)
               }
            }

            return Promise.reject(customError);
         }
      );
   }

   private startRefreshToken(miliseconds: number) {
      if (this.refreshIntervalId) clearInterval(this.refreshIntervalId)

      this.refreshIntervalId = setInterval(async () => {
         const { isInactive } = useInactivityStore.getState()
         if (isInactive) return
         await this.refreshToken()
      }, miliseconds)
   }

   private async refreshToken(): Promise<any> {
      try {

         // Obtengo el refreshToken actual
         const refreshToken = CookieStorageAdapter.getRefreshToken()

         // Obtengo el alias de la empresa
         const companyAlias = CookieStorageAdapter.getCompanyAlias()

         // Verifico que el refreshToken y el companyAlias y el refresher no sean nulos
         if (refreshToken && companyAlias && this.refresher) {

            // Obtengo el nuevo token
            const response = await this.refresher.StartProcessToRefreshToken({
               company_id: Number(companyAlias),
               refresh_token: refreshToken
            })

            // Actualizo los tokens en las cookies
            CookieStorageAdapter.setToken(response.access_token);
            CookieStorageAdapter.setRefreshToken(response.refresh_token);

            return response
         }

      } catch (refreshTokenError) {

         this.logout()
         throw refreshTokenError
      }
   }

   private logout() {
      // Borro las cookies de autenticación
      CookieStorageAdapter.clearAuth();

      // Redirijo al inicio de sesión
      window.location.href = "/auth";
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

// Exportamos una instancia única (Singleton)
export const httpHandler = new AxiosHttpAdapter();