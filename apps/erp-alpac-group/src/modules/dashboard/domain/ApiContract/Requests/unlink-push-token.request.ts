import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UnlinkPushTokenRequest extends Omit<BaseRequest, "module_code"> {
   token: string;
}