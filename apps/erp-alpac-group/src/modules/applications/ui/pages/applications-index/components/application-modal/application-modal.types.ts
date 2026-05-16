import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export type ApplicationModalProps = {
   application: GetApplicationsResponse;
   isOpen: boolean;
   onClose?: () => void;
   onSubmit?: (data: any) => void;
}