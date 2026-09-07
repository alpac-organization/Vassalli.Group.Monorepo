// TODO: pendiente heredar interfaz de base request
export interface PurchaseOrderDocumentRequest
{
    company_id:  string;
    module_code: string;
    purchase_order_id: string;
    payment_method: number;
}