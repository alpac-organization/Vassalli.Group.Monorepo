import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { DocumentType } from "@app/core/enums/document.enum";
import type { OperationalOrderStatusType } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";

export interface GetOperationalOrdersRequest extends BaseRequest {
  code?: string;
  customer_cif?: string;
  document_type?: DocumentType | number | string;
  status?: OperationalOrderStatusType | number | string;
  page_number?: number;
  page_size?: number;
}
