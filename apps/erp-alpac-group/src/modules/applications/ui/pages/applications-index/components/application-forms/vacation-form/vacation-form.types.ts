import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export interface VacationFormProps {
   application: GetApplicationsResponse;
   onFinishProcess?: () => void;
}