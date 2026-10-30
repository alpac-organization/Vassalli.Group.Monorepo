import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export interface LeaveFormProps {
  application: GetApplicationsResponse;
  onFinishProcess?: () => void;
}
