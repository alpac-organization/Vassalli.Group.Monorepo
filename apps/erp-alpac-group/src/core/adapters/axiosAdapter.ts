import axios, { type AxiosInstance } from 'axios';
import type { IHttpHandler } from '../ports';

export class AxiosHttpAdapter implements IHttpHandler {
   private instance: AxiosInstance;
   private apiKey = import.meta.env.VITE_API_KEY;

   constructor() {
      this.instance = axios.create({
         baseURL: import.meta.env.VITE_API_URL || '/api',
         headers: {
            'Content-Type': 'application/json',
            "x-api-key": this.apiKey,
            "x-device-name": "Google Chrome"
         },
      });

      // Interceptor to request
      this.instance.interceptors.request.use((config) => {
         const token = localStorage.getItem('accessToken');
         const apiKey = import.meta.env.VITE_API_KEY;

         if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
         }

         if (apiKey) {
            config.headers['x-api-key'] = apiKey;
         }

         return config;
      });
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