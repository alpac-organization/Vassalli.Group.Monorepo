import type { MedicalAppointmentPanelProps } from "./medical-appointment-panel.types";
import {
  formatDateToSpanishWords,
  formatTime,
} from "@app/shared/utils/string.utils";
import { toDataUrl } from "@app/shared/utils/toDataUrl";

export const MedicalAppointmentPanel = ({
  application,
}: MedicalAppointmentPanelProps) => {
  const isMedicalAppointment = application.type === "MedicalAppointment";
  //   const hasImages = (application.?.length ?? 0) > 0;
  const isFullDay =
    application.amount_days ||
    (!application.start_time && !application.end_time);

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
      {/* 
      {isMedicalAppointment && hasImages && (
        <div className="flex flex-col gap-2">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Comprobantes médicos
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {application.images?.map((image, index) => {
              const src = toDataUrl(image.image_base64, image.content_type);
              if (!src) return null;

              return (
                <a
                  key={`medical-image-${index}`}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-600"
                >
                  <img
                    src={src}
                    alt={`Comprobante médico ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                </a>
              );
            })}
          </div>
        </div>
      )} */}
    </>
  );
};
