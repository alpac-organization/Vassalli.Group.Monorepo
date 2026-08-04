import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";

export interface CreatedProductDto {
   data: CreateProductResponse,
   product_name: string;
   category_name: string;
}

export interface CreateProductModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit?: (data: CreatedProductDto) => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
}
