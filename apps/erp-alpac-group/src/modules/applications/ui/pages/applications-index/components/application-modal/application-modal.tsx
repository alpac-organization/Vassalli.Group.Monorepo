import { Modal } from "@alpac/design-system"
import type { ApplicationModalProps } from "./application-modal.types"
import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum"
import { DonatedVacationForm } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/donated-vacation-form/donated-vacation-form";
import { useEffect, useState } from "react";
import { MedicalAppointmentForm } from "../application-forms/medical-appointment-form/medical-appointment-form";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import { VacationForm } from "../application-forms/vacation-form/vacation-form";

export const ApplicationModal = (props: ApplicationModalProps): React.ReactNode => {

   const [applicationData, setApplicationData] = useState<GetApplicationsResponse>(props.application);
   const applicationType = PermitApplicationTypeEnum[applicationData.type] ?? null;

   useEffect(() => {
      if (props.application && props.application?.permit_apllication_id) {
         setApplicationData(props.application);
      }
   }, [props.application]);

   return (
      <Modal
         variant="form"
         size="5xl"
         isOpen={props.isOpen}
         onClose={() => props.onClose?.()}
         title="Detalle de Solicitud"
         description="Información detallada sobre la solicitud seleccionada">
         <div className="flex flex-col gap-6">

            {
               applicationType === PermitApplicationTypeEnum.Vacation && (
                  <VacationForm application={applicationData} onFinishProcess={() => props.onClose?.()} />
               )
            }

            {
               applicationType === PermitApplicationTypeEnum.MedicalAppointment && (
                  <MedicalAppointmentForm application={applicationData} onFinishProcess={() => props.onClose?.()} />
               )
            }

            {
               applicationType === PermitApplicationTypeEnum.DonatedVacations && (
                  <DonatedVacationForm application={applicationData} onFinishProcess={() => props.onClose?.()} />
               )
            }

         </div>
      </Modal>
   )
}