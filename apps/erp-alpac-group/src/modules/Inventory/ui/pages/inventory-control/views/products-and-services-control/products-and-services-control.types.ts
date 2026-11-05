import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface GetProductColumnsToTableProps {
    item?: GetProductResponse;
    selectProductToEdit: (product: GetProductResponse) => void;
    openModalToEdit: () => void;
}