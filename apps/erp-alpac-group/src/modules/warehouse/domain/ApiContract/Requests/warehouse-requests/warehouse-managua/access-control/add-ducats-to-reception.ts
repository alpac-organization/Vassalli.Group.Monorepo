import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AddDucatsToReceptionRequest  extends BaseRequest{
  reception_id?: string;
  reception_entrance_id?: string;
  ducat_numbers: string[];
}