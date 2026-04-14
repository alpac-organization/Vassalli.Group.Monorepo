import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export type ApplicationsTableProps = {
   data: GetApplicationsResponse[];
   pagination?: React.ReactNode;
   onOpenApplicationDetailModal: (application: GetApplicationsResponse) => void;
}