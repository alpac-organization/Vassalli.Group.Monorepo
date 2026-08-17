export interface CreateServiceOrderResponse {
  service_order_id: string;
  code: string;
  customer_id: string;
  observations: string | null;
}