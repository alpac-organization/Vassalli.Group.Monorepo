import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export interface MainPanelProps {
   application: GetApplicationsResponse;
   children: React.ReactNode;
   className?: string;
}

export interface MainPanelFieldProps {
   label: string;
   children?: React.ReactNode;
   value?: string;
   className?: string;
}