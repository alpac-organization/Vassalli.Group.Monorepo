import { Modal } from "@alpac/design-system";
import type { ApplicationModalProps } from "@app/modules/applications/ui/pages/applications-index/components/application-modal/application-modal.types";
import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import { MedicalAppointmentForm } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/medical-appointment-form/medical-appointment-form";
import { VacationForm } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/vacation-form/vacation-form";
import { VacationPayForm } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/vacation-pay-form/vacation-pay-form";
import { LeaveApplicationForm } from "@app/modules/applications/ui/pages/applications-index/components/application-forms/leave-form/leave-form";

const LEAVE_APPLICATION_TYPES = new Set([
  PermitApplicationTypeEnum.JudicialAppointment,
  PermitApplicationTypeEnum.MarriageLeave,
  PermitApplicationTypeEnum.BirthLeave,
  PermitApplicationTypeEnum.BereavementLeave,
]);

export const ApplicationModal = (
  props: ApplicationModalProps,
): React.ReactNode => {
  const application = props.application;
  const applicationType = PermitApplicationTypeEnum[application.type] ?? null;
  const isLeaveApplication =
    applicationType !== null && LEAVE_APPLICATION_TYPES.has(applicationType);

  return (
    <Modal
      variant="form"
      size="5xl"
      isOpen={props.isOpen}
      onClose={() => props.onClose?.()}
      title="Detalle de Solicitud"
      description="Información detallada sobre la solicitud seleccionada"
    >
      <div className="flex flex-col gap-6">
        {applicationType === PermitApplicationTypeEnum.Vacation ? (
          <VacationForm
            application={application}
            onFinishProcess={() => props.onClose?.()}
          />
        ) : null}

        {applicationType === PermitApplicationTypeEnum.MedicalAppointment ? (
          <MedicalAppointmentForm
            application={application}
            onFinishProcess={() => props.onClose?.()}
          />
        ) : null}

        {applicationType === PermitApplicationTypeEnum.VacationPay ? (
          <VacationPayForm
            application={application}
            onFinishProcess={() => props.onClose?.()}
          />
        ) : null}

        {/* Formulario de solicitudes de permisos especiales */}
        {isLeaveApplication ? (
          <LeaveApplicationForm
            application={application}
            onFinishProcess={() => props.onClose?.()}
          />
        ) : null}
      </div>
    </Modal>
  );
};
