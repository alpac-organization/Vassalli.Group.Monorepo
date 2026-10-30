import { PermitBeneficiaryScopeEnum } from "@app/modules/applications/domain/enums/permit-beneficiary-scope.enum";
import { PermitFamilyRelationshipEnum } from "@app/modules/applications/domain/enums/permit-family-relationship.enum";
import {
  extractLeaveImages,
  parsePermissionAdditionalData,
} from "@app/modules/payroll/ui/pages/permissions/utils/permission-additional-data.utils";
import { ImagePreviewGallery } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import {
  formatDateToSpanishWords,
  formatTime,
} from "@app/shared/utils/string.utils";
import type { LeavePanelProps } from "@app/modules/applications/ui/pages/applications-index/components/application-panels/leave-panel/leave-panel.types";

export const LeavePanel = ({ application }: LeavePanelProps) => {
  const { start_date, end_date, start_time, end_time, amount_days } =
    application;
  const leaveData = parsePermissionAdditionalData(
    application.additional_data,
  )?.LeaveData;
  const leaveImages = extractLeaveImages(application.additional_data);

  const beneficiaryScopeLabel = leaveData?.BeneficiaryScope
    ? (PermitBeneficiaryScopeEnum[leaveData.BeneficiaryScope]?.label ??
      leaveData.BeneficiaryScope)
    : null;
  const familyRelationshipLabel = leaveData?.FamilyRelationship
    ? (PermitFamilyRelationshipEnum[leaveData.FamilyRelationship]?.label ??
      leaveData.FamilyRelationship)
    : null;
  const relatedPerson = leaveData?.RelatedPerson?.trim() || null;

  return (
    <>
      {!!start_date && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Fecha de Inicio
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatDateToSpanishWords(start_date)}
            </span>
          </div>
        </div>
      )}

      {!!end_date && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Fecha de Fin
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatDateToSpanishWords(end_date)}
            </span>
          </div>
        </div>
      )}

      {!!start_time && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Hora de Inicio
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatTime(start_time)}
            </span>
          </div>
        </div>
      )}

      {!!end_time && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Hora Final
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {formatTime(end_time)}
            </span>
          </div>
        </div>
      )}

      {!!amount_days && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Cantidad de Días
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {amount_days}
            </span>
          </div>
        </div>
      )}

      {!!beneficiaryScopeLabel && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Alcance
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {beneficiaryScopeLabel}
            </span>
          </div>
        </div>
      )}

      {!!familyRelationshipLabel &&
        leaveData?.FamilyRelationship !== "None" && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Parentesco
            </span>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                {familyRelationshipLabel}
              </span>
            </div>
          </div>
        )}

      {!!relatedPerson && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px]! font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Persona Relacionada
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
              {relatedPerson}
            </span>
          </div>
        </div>
      )}

      {leaveImages.length > 0 && (
        <div className="col-span-full">
          <ImagePreviewGallery images={leaveImages} />
        </div>
      )}
    </>
  );
};
