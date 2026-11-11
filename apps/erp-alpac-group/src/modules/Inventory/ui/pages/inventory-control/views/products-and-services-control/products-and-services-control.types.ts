import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface GetProductColumnsToTableProps {
    item?: GetProductResponse;
    selectProduct:       (product: GetProductResponse) => void;   
    openModalToEdit:     () => void;
    openModalToDelete:   () => void;
}