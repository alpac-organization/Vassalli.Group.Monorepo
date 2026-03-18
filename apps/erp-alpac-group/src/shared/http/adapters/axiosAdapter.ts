import axios, { type AxiosInstance } from 'axios';
import type { IHttpHandler } from '@app/shared/http/ports';

export class AxiosHttpAdapter implements IHttpHandler {
   private instance: AxiosInstance;

   constructor() {
      this.instance = axios.create({
         baseURL: import.meta.env.VITE_API_URL || '/api',
         headers: {
            'Content-Type': 'application/json',
         },
      });
      
      this.instance.interceptors.request.use((config) => {
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