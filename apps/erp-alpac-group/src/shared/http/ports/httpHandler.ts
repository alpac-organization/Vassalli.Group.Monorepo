export interface IHttpHandler {
   get<TResponse>(url: string, config?: object): Promise<TResponse>;
   post<TResponse>(url: string, body?: object, config?: object ): Promise<TResponse>;
   put<TResponse>(url: string, body?: object, config?: object): Promise<TResponse>;
   delete<TResponse>(url: string, config?: object): Promise<TResponse>;
   patch<TResponse>(url: string, body?: object, config?: object): Promise<TResponse>;
}