import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export interface MainPanelProps {
   application: GetApplicationsResponse;
   children: React.ReactNode;
   className?: string;
}