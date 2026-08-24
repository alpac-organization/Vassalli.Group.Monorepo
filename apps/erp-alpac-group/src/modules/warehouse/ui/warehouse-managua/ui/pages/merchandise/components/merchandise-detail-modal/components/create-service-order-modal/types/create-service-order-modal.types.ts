import type { CreateServiceOrderResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/service-order-responses/create-service-order.response";

export type CreateServiceOrderFormValues = {
  branch_id: string;
  customer_id: string;
  observations: string;
};

export type CreateServiceOrderModalProps = {
  isOpen: boolean;
  company_id: string;
  module_code: string;
  onClose: () => void;
  onCreated: (serviceOrder: CreateServiceOrderResponse) => void;
  onRequestRegisterCustomer?: () => void;
  newlyCreatedCustomerId?: string | null;
};