
export interface PaginateBaseResponse<T> {
   data: T;
   page_number: number;
   page_size: number;
   total: number;
}

