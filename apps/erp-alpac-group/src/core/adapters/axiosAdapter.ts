import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { IHttpHandler } from '../ports';
import type { ApiErrorResponse } from '../interfaces/ErrorResponse';
import { CookieStorageAdapter } from './cookie-storage-adapter';
import { getBrowserName } from '../enums/user-agent.enum';

export class AxiosHttpAdapter implements IHttpHandler {

   private instance: AxiosInstance;
   private apiKey = import.meta.env.VITE_API_KEY;
   private isRefreshing = false;

   constructor() {

      this.instance = axios.create({
         baseURL: import.meta.env.VITE_API_URL || '/api',
         headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "x-device-name": getBrowserName(navigator.userAgent)
         },
      });

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


            const originalRequest = error.config

            if (customError.status === 401 && originalRequest) {

               if (this.isRefreshing) {
                  return new Promise(() => {
                     console.log("Entrando al refresh")
                  })
                     .then((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return this.instance(originalRequest);
                     })
                     .catch((error) => {
                        return Promise.reject(error);
                     })
               }

               console.warn("Sesión expirada o inválida detectada por el interceptor.");
            }

            this.isRefreshing = true
            const refreshToken = CookieStorageAdapter.getRefreshToken();
            const companyId = CookieStorageAdapter.getCompanyAlias();

            if (refreshToken) {
               try {
                  const { AuthenticationServices } = await import("@app/modules/auth/infrastructure/services/AuthenticationServices")
                  const authService = new AuthenticationServices(this);
                  const response = await authService.StartProcessToRefreshToken({
                     company_id: Number(companyId), refresh_token: refreshToken
                  });

                  CookieStorageAdapter.setToken(response.access_token);

                  console.log(response)

               } catch (refreshError) {
                  this.isRefreshing = false;
                  CookieStorageAdapter.clearAuth();
                  return Promise.reject(refreshError);
               }
            }

            return Promise.reject(customError);
         }
      );
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