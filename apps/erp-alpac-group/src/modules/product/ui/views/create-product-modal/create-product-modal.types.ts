import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";

export interface CreateProductModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit?: (data: CreateProductRequest) => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
}
