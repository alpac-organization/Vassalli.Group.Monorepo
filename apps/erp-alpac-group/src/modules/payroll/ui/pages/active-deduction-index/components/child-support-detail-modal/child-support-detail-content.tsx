import { Alert, Badges, Button, Spinner } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import {
  getDeductionStatusBadgeColor,
  getDeductionStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-status.enum";
import { getDeductionTypeLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import {
  getActiveChildSupportConceptLabels,
  isDeductionInProgress,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/child-support-garnishment/child-support-form.utils";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import {
  formatDateToSpanishWords,
  formatIdentificationNumber,
} from "@app/shared/utils/string.utils";
import { AnimatePresence, m } from "framer-motion";
import {
  BanIcon,
  CalendarIcon,
  CheckIcon,
  ExternalLink,
  FileTextIcon,
  LayersIcon,
  PencilIcon,
  PercentIcon,
  ReceiptIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import {
  deductionApproveButtonClassName,
  deductionModalFooterClassName,
  deductionModalPrimaryButtonClassName,
  deductionModalSecondaryButtonClassName,
  deductionRejectButtonClassName,
  sectionTitleClassName,
} from "../../utils/active-deduction.constants";
import { ActiveDeductionDetailAmountRow } from "../active-deduction-detail-modal/active-deduction-detail-amount-row";
import { ActiveDeductionPayments } from "../active-deduction-detail-modal/active-deduction-payments";
import type {
  ChildSupportDetailBodyProps,
  ChildSupportDetailContentProps,
  ChildSupportDetailView,
} from "./child-support-detail-modal.types";
import { EditChildSupportForm } from "./edit-child-support-form";
import { RegisterOfficialLetterForm } from "./register-official-letter-form";

const EMPTY_STATE_CONTAINER_CLASS =
  "flex flex-col items-center justify-center px-4 py-10 text-center";

const LOADING_STATE_TEXT_CLASS =
  "mt-3 max-w-[17rem] text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:max-w-xs";

const fadeSlideTransition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1] as const,
};

const fadeSlideVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function SummaryHeader({ summary }: { summary: DeductionDto }) {
  const identification =
    summary.identification_number?.length === 14
      ? formatIdentificationNumber(summary.identification_number)
      : (summary.identification_number ?? "—");

  return (
    <div className="flex min-w-0 shrink-0 items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-neutral-700">
      <div className="min-w-0">
        <p className="wrap-break-word text-xl font-bold leading-snug text-slate-900 dark:text-white">
          {summary.collaborato_fullname?.trim() || "—"}
        </p>
        <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
          Identificación: {identification}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-md bg-slate-100 px-2.5 py-0.5 text-[12px] font-medium text-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
            {getDeductionTypeLabel(summary.type)}
          </span>
        </div>
      </div>
      <Badges
        label={getDeductionStatusLabel(summary.status)}
        color="transparent"
        className={`shrink-0 ${getDeductionStatusBadgeColor(summary.status)}`}
      />
    </div>
  );
}

function DetailBody({
  summary,
  detail,
  onViewPayments,
  onOpenRegisterOfficialLetter,
  onOpenEditChildSupport,
  onRequestCease,
}: ChildSupportDetailBodyProps) {
  const { role } = useUserStore();

  const cs = detail.child_support_detail ?? null;
  const heldCount =
    detail.held_payments_count ?? summary.held_payments_count ?? 0;
  const isAdministrator = role === RoleEnum.ADMINISTRATOR;
  const isProgress = isDeductionInProgress(detail.status ?? summary.status);
  const activeConcepts = cs ? getActiveChildSupportConceptLabels(cs) : [];

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
        <div className="flex flex-col gap-5 pb-4">
          {detail.description && (
            <section className="flex flex-col gap-2">
              <h4 className={sectionTitleClassName}>Descripción</h4>
              <p className="m-0 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-neutral-700 dark:bg-[#1e2229] dark:text-slate-200">
                {detail.description}
              </p>
            </section>
          )}

          {cs && (
            <section className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-neutral-600">
                <h4 className="m-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-200">
                  Información de Embargo Alimenticio
                </h4>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badges
                    label={
                      cs.has_official_letter
                        ? "Con Oficio"
                        : "Sin Oficio — Cheque Retenido"
                    }
                    color="transparent"
                    className={
                      cs.has_official_letter
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                    }
                  />
                  {heldCount > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                      {heldCount} cheque{heldCount === 1 ? "" : "s"} retenido
                      {heldCount === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2">
                <DetailField
                  label="Acta de Embargo"
                  icon={<FileTextIcon size={18} />}
                  value={
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {cs.seizure_act_number || "—"}
                      </span>
                      {cs.seizure_act_url && (
                        <a
                          href={cs.seizure_act_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Ver Acta (PDF)
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  }
                />

                <DetailField
                  label="Fecha de Inicio (Acta)"
                  icon={<CalendarIcon size={18} />}
                  value={formatDateToSpanishWords(cs.start_date) || "—"}
                />

                <DetailField
                  label="Oficio Judicial"
                  icon={<FileTextIcon size={18} />}
                  value={
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                        {cs.has_official_letter
                          ? `${cs.official_letter_number ?? "—"}${cs.official_letter_date ? ` (${formatDateToSpanishWords(cs.official_letter_date)})` : ""}`
                          : "Pendiente de registro"}
                      </span>
                      {cs.official_letter_url && (
                        <a
                          href={cs.official_letter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Ver Oficio (PDF)
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  }
                />

                <DetailField
                  label="Modalidad"
                  icon={<PercentIcon size={18} />}
                  value={
                    cs.is_percentage
                      ? `Porcentaje: ${cs.percentage ?? 0}%`
                      : "Monto Fijo"
                  }
                />

                <DetailField
                  label="Beneficiario"
                  icon={<UserIcon size={18} />}
                  value={cs.beneficiary_name?.trim() || "—"}
                  containerClass="sm:col-span-2"
                />

                <DetailField
                  label="Conceptos de Aplicación"
                  icon={<LayersIcon size={18} />}
                  containerClass="sm:col-span-2"
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {activeConcepts.map((concept) => (
                        <span
                          key={concept}
                          className="rounded-md bg-slate-200/80 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-neutral-700 dark:text-slate-200"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  }
                />
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h4 className={sectionTitleClassName}>Resumen Financiero</h4>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
              <div className="hidden border-b border-slate-200 bg-slate-100 sm:grid sm:grid-cols-3 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Concepto
                </div>
                <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <strong>C$</strong> NIO
                </div>
                <div className="flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <strong>$</strong> USD
                </div>
              </div>

              <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                {cs && !cs.is_percentage && detail.fortnightly_amount != null && (
                  <ActiveDeductionDetailAmountRow
                    label="Cuota quincenal fija"
                    nio={detail.fortnightly_amount}
                    usd={detail.fortnightly_amount_in_dollars}
                  />
                )}
                <ActiveDeductionDetailAmountRow
                  label="Total retenido acumulado"
                  nio={detail.amount_paid ?? 0}
                  usd={detail.amount_paid_in_dollars ?? 0}
                  bold
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer fijo fuera del scroll */}
      <div className={deductionModalFooterClassName}>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            onClick={onViewPayments}
            icon={<ReceiptIcon size={16} />}
            label="Ver pagos"
            className={`${deductionModalPrimaryButtonClassName} w-full min-w-0 sm:w-auto`}
          />

          {cs && isAdministrator && isProgress && (
            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
              <Button
                type="button"
                onClick={onRequestCease}
                icon={<BanIcon size={16} />}
                label="Cesar embargo"
                className={`${deductionRejectButtonClassName} w-full min-w-0 sm:w-auto`}
              />
              <Button
                type="button"
                onClick={onOpenEditChildSupport}
                icon={<PencilIcon size={16} />}
                label="Editar"
                className={`${deductionModalSecondaryButtonClassName} w-full min-w-0 sm:w-auto`}
              />
              {!cs.has_official_letter && (
                <Button
                  type="button"
                  onClick={onOpenRegisterOfficialLetter}
                  icon={<CheckIcon size={16} />}
                  label="Registrar oficio"
                  className={`${deductionApproveButtonClassName} w-full min-w-0 sm:w-auto`}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChildSupportDetailContent({
  summary,
  detail,
  isLoading,
  isError,
  onRequestCease,
  onActionSuccess,
  onActionError,
}: ChildSupportDetailContentProps) {
  const { companyId, moduleCode } = useUserStore();

  const [view, setView] = useState<ChildSupportDetailView>("detail");
  const [slideDirection, setSlideDirection] = useState<"back" | "forward">(
    "back",
  );

  const goToDetails = () => {
    setView("detail");
    setSlideDirection("back");
  };

  const goToPayments = () => {
    setView("payments");
    setSlideDirection("forward");
  };

  const goToRegisterOfficialLetter = () => {
    setView("register_official_letter");
    setSlideDirection("forward");
  };

  const goToEditChildSupport = () => {
    setView("edit_child_support");
    setSlideDirection("forward");
  };

  const { useGetDeductionPayments } = useDeduction();

  const {
    data: payments,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useGetDeductionPayments(
    {
      company_id: companyId,
      module_code: moduleCode,
      deduction_id: summary?.deduction_id ?? "",
      page_number: 1,
      page_size: 10,
    },
    {
      enabled:
        view === "payments" &&
        !!summary?.deduction_id &&
        !!companyId &&
        !!moduleCode,
    },
  );

  const heldCount =
    detail?.held_payments_count ?? summary?.held_payments_count ?? 0;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      {summary && (
        <m.div
          key={`summary-${summary.deduction_id}`}
          variants={fadeSlideVariants}
          initial="initial"
          animate="animate"
          transition={fadeSlideTransition}
        >
          <SummaryHeader summary={summary} />
        </m.div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          {isLoading && (
            <m.div
              key="loading"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideTransition}
              className={EMPTY_STATE_CONTAINER_CLASS}
            >
              <Spinner
                size="medium"
                className="text-blue-600 dark:text-blue-400"
              />
              <p className={LOADING_STATE_TEXT_CLASS}>Cargando detalle...</p>
            </m.div>
          )}

          {!isLoading && isError && (
            <m.div
              key="error"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={fadeSlideTransition}
            >
              <Alert
                type="error"
                title="Error"
                message="No se pudo obtener el detalle del embargo alimenticio."
              />
            </m.div>
          )}

          {!isLoading && !isError && summary && detail && (
            <m.div
              key="content"
              variants={fadeSlideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ ...fadeSlideTransition, delay: 0.05 }}
              className="flex min-h-0 min-w-0 flex-1 flex-col"
            >
              <AnimatePresence initial={false} mode="wait">
                <m.div
                  key={view}
                  initial={{
                    opacity: 0,
                    x: slideDirection === "forward" ? 20 : -20,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: slideDirection === "forward" ? -20 : 20,
                  }}
                  transition={fadeSlideTransition}
                  className="flex min-h-0 min-w-0 flex-1 flex-col"
                >
                  {view === "detail" && (
                    <DetailBody
                      summary={summary}
                      detail={detail}
                      onViewPayments={goToPayments}
                      onOpenRegisterOfficialLetter={goToRegisterOfficialLetter}
                      onOpenEditChildSupport={goToEditChildSupport}
                      onRequestCease={onRequestCease}
                    />
                  )}
                  {view === "payments" && (
                    <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 pb-2">
                      <ActiveDeductionPayments
                        payments={payments}
                        isLoading={isPaymentLoading}
                        isError={isPaymentError}
                        onBack={goToDetails}
                      />
                    </div>
                  )}
                  {view === "register_official_letter" && (
                    <RegisterOfficialLetterForm
                      deductionId={detail.deduction_id}
                      heldPaymentsCount={heldCount}
                      initialBeneficiaryName={
                        detail.child_support_detail?.beneficiary_name
                      }
                      onBack={goToDetails}
                      onSuccess={(message) => {
                        onActionSuccess?.(message, false);
                        goToDetails();
                      }}
                      onError={(message) => onActionError?.(message)}
                    />
                  )}
                  {view === "edit_child_support" && (
                    <EditChildSupportForm
                      detail={detail}
                      onBack={goToDetails}
                      onSuccess={(message) => {
                        onActionSuccess?.(message, false);
                        goToDetails();
                      }}
                      onError={(message) => onActionError?.(message)}
                    />
                  )}
                </m.div>
              </AnimatePresence>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
