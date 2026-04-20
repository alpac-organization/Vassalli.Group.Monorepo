import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export type MedicalAppointmentFormProps = {
   application: GetApplicationsResponse;
   onFinishProcess?: () => void;
}