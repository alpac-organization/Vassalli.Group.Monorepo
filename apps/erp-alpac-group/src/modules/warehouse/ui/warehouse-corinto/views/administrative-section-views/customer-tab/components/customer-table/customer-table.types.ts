import type { GetCustomerResponse } from "@app/modules/customer/domain/ApiContract/Responses/customer-responses/get-customer.response";

export type CustomerTableProps = {
  data: GetCustomerResponse[] | undefined;
  pagination?: React.ReactNode;
  onSelect?: (client: any) => void;
};
