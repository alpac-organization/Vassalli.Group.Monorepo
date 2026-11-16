import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface DeleteProductOrServiceModalProps {
    isOpen:  boolean;
    onClose: () => void;
    product: GetProductResponse | null;
}