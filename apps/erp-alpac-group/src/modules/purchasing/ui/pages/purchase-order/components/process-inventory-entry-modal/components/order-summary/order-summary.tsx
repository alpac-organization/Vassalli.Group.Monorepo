import { BuildingIcon, CalendarIcon, FileText } from "lucide-react";

import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

import { ModalSection } from "../modal-section/modal-section";
import { SenderInfo } from "../sender-info/sender-info";

import type { OrderSummaryProps } from "./order-summary.types";

export const OrderSummary = function ({ summary }: OrderSummaryProps) {
  return (
    <ModalSection
      title="Resumen de la orden"
      icon={<FileText size={16} aria-hidden />}
      contentClassName="p-3"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField
          label="Enviado a revisión"
          value={formatDateToSpanishWords(summary.sentToReviewAt ?? "")}
          icon={<CalendarIcon size={18} aria-hidden />}
        />
        <DetailField
          label="Área del remitente"
          value={summary.senderWorkArea ?? "—"}
          icon={<BuildingIcon size={18} aria-hidden />}
        />
        <DetailField
          label="Comentarios"
          value={summary.comments ?? "—"}
          containerClass={
            (summary.comments?.length ?? 0) > 40 ? "sm:col-span-2" : ""
          }
        />
      </div>

      {summary.sentBy && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-neutral-700 dark:bg-[#272b34]/50">
          <SenderInfo
            fullname={summary.sentBy.fullname ?? "—"}
            pictureUrl={summary.sentBy.picture_url}
            workArea={summary.senderWorkArea}
          />
        </div>
      )}
    </ModalSection>
  );
};
