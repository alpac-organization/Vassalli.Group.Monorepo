import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export interface VacationPayFormProps {
   application: GetApplicationsResponse;
   onFinishProcess?: () => void;
}