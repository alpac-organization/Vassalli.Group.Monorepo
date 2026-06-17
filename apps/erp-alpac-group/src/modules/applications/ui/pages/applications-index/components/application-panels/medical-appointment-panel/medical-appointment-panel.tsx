import type { MedicalAppointmentPanelProps } from "./medical-appointment-panel.types";
import {
  formatDateToSpanishWords,
  formatTime,
} from "@app/shared/utils/string.utils";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import { extractMedicalAppointmentImages } from "@app/modules/payroll/ui/pages/permissions/utils/permission-additional-data.utils";

export const MedicalAppointmentPanel = ({
  application,
}: MedicalAppointmentPanelProps) => {
  const isMedicalAppointment = application.type === "MedicalAppointment";
  const isFullDay =
    (application.amount_days ?? 0) > 1 ||
    (!application.start_time && !application.end_time);
  const medicalAppointmentImages = isMedicalAppointment
    ? extractMedicalAppointmentImages(application.additional_data)
    : [];

  return (
    <>
      {isMedicalAppointment && !!application.start_date && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Fecha de la Cita Médica
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatDateToSpanishWords(application.start_date)}
            </span>
          </div>
        </div>
      )}

      {isMedicalAppointment && isFullDay && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Jornada
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              Día completo
            </span>
          </div>
        </div>
      )}

      {isMedicalAppointment && !!application.start_time && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Hora de Inicio
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatTime(application.start_time)}
            </span>
          </div>
        </div>
      )}

      {isMedicalAppointment && !!application.end_time && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Hora Final
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatTime(application.end_time)}
            </span>
          </div>
        </div>
      )}

      {isMedicalAppointment && !!application.amount_days && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Cantidad a Recibir
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {application.amount_days}
            </span>
          </div>
        </div>
      )}

      {medicalAppointmentImages.length > 0 && (
        <div className="col-span-full">
          <ImagePreviewGallery images={medicalAppointmentImages} />
        </div>
      )}
    </>
  );
};
