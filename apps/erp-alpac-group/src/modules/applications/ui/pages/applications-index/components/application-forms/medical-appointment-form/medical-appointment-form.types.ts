import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export interface MedicalAppointmentFormProps {
   application: GetApplicationsResponse;
   onFinishProcess?: () => void;
}