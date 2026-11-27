import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterChildSupportOfficialLetterRequest extends BaseRequest {
  deduction_id: string;
  official_letter_number: string;
  official_letter_date: string;
  official_letter_file_base64?: string | null;
  official_letter_file_name?: string | null;
  beneficiary_name?: string | null;
}
