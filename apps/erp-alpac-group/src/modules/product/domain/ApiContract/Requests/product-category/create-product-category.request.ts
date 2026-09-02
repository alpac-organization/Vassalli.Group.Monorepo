import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateProductCategoryRequest extends BaseRequest {
  name: string;
  code: string;
  parent_id?: string | null;
}
