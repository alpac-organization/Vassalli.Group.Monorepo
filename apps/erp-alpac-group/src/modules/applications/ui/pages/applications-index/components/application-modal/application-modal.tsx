import { Modal, Textarea } from "@alpac/design-system"
import type { ApplicationModalProps } from "./application-modal.types"
import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum"
import { DonatedVacationForm } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/donated-vacation-form/donated-vacation-form";
import { useEffect, useState } from "react";
import { MedicalAppointmentForm } from "../application-forms/medical-appointment-form/medical-appointment-form";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export const ApplicationModal = (props: ApplicationModalProps): React.ReactNode => {

   const [applicationData, setApplicationData] = useState<GetApplicationsResponse>(props.application);
   const applicationType = PermitApplicationTypeEnum[applicationData.type] ?? null;

   useEffect(() => {
      setApplicationData(props.application);
   }, [props.application]);

   return (
      <Modal
         variant="form"
         size="5xl"
         isOpen={props.isOpen}
         onClose={() => props.onClose?.()}
         title="Detalle de Solicitud"
         description="Información detallada sobre la solicitud seleccionada">
         <form className="flex flex-col gap-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

               <div className="flex flex-col gap-1 md:col-span-1">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Tipo de Solicitud
                  </span>
                  <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                     {applicationType?.label || 'Sin tipo'}
                  </span>
               </div>

               <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                     Motivo o Descripción
                  </span>
                  <span className="text-[15px] text-slate-800 dark:text-slate-100">
                     <Textarea
                        value={applicationData.description ?? ""}
                        onChange={(e) => {
                           setApplicationData({ ...applicationData, description: e.target.value });
                        }}
                        className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                        labelClassName="text-black! dark:text-white!"
                     />
                  </span>
               </div>
            </div>

            {
               applicationType === PermitApplicationTypeEnum.MedicalAppointment && (
                  <MedicalAppointmentForm application={applicationData} />
               )
            }

            {
               applicationType === PermitApplicationTypeEnum.DonatedVacations && (
                  <DonatedVacationForm application={applicationData} />
               )
            }

         </form>
      </Modal>
   )
}