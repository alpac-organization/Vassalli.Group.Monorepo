import { Alert, Badges, Button, Spinner } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import {
   getDeductionStatusBadgeColor,
   getDeductionStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-status.enum";
import { getDeductionTypeLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { ActiveDeductionDetailAmountRow } from "./active-deduction-detail-amount-row";
import { useEffect, useState } from "react";
import type { ActiveDeductionDetailBodyProps, ActiveDeductionDetailContentProps, ActiveDeductionView } from "./active-deduction-detail-modal.types";
import { ActiveDeductionPayments } from "./active-deduction-payments";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import { useUserStore } from "@app/shared/stores/useUserStore";

const EMPTY_STATE_CONTAINER_CLASS =
   "flex flex-col items-center justify-center px-4 py-10 text-center";

const LOADING_STATE_TEXT_CLASS =
   "mt-3 max-w-[17rem] text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:max-w-xs";

const PAYMENT_DETAILS_BUTTON_CLASS =
   "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-white bg-alpac-primary-500 dark:bg-alpac-primary-700 transition-opacity hover:opacity-90";

const fadeSlideTransition = {
   duration: 0.38,
   ease: [0.16, 1, 0.3, 1] as const,
};

const fadeSlideVariants = {
   initial: { opacity: 0, y: 14 },
   animate: { opacity: 1, y: 0 },
   exit: { opacity: 0, y: -10 },
};

function SummaryHeader({ summary }: { summary: DeductionDto }) {
   const identification =
      summary.identification_number?.length === 14
         ? formatIdentificationNumber(summary.identification_number)
         : (summary.identification_number ?? "—");

   return (
      <div className="flex min-w-0 items-start justify-between gap-3">
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

function DetailBody({ detail, onViewPayments }: ActiveDeductionDetailBodyProps) {
   const paidCount = detail.number_fortnights_paid ?? 0;
   const totalCount = detail.number_fortnights ?? 0;

   return (
      <div className="flex min-w-0 flex-col gap-5">
         {detail.description && (
            <m.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ ...fadeSlideTransition, delay: 0.05 }}
               className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#1e2229]"
            >
               <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Descripción
               </p>
               <p className="text-sm text-slate-700 dark:text-slate-200">
                  {detail.description}
               </p>
            </m.div>
         )}

         {totalCount > 0 && (
            <m.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ ...fadeSlideTransition, delay: 0.1 }}
               className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-[#1e2229]"
            >
               <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quincenas
               </p>
               <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {paidCount} / {totalCount} pagadas
               </span>
            </m.div>
         )}

         <m.div className="flex sm:justify-start">
            <Button
               type="button"
               onClick={onViewPayments}
               label="Ver detalles de pagos "
               className={`${PAYMENT_DETAILS_BUTTON_CLASS} w-full shrink-0 justify-center whitespace-nowrap sm:w-auto sm:px-3 sm:py-1.5`}
            />
         </m.div>

         <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fadeSlideTransition, delay: 0.14 }}
            className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700"
         >
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
               {detail.fortnightly_amount != null && (
                  <ActiveDeductionDetailAmountRow
                     label="Cuota quincenal"
                     nio={detail.fortnightly_amount}
                     usd={detail.fortnightly_amount_in_dollars}
                  />
               )}
               {detail.amount_paid != null && (
                  <ActiveDeductionDetailAmountRow
                     label="Monto pagado"
                     nio={detail.amount_paid}
                     usd={detail.amount_paid_in_dollars}
                  />
               )}
               {detail.total_balance != null && (
                  <ActiveDeductionDetailAmountRow
                     label="Saldo pendiente"
                     nio={detail.total_balance}
                     usd={detail.total_balance_in_dollars}
                     highlight
                  />
               )}
               <ActiveDeductionDetailAmountRow
                  label="Total original"
                  nio={detail.total_amount}
                  usd={detail.total_amount_in_dollars}
                  bold
               />
            </div>
         </m.div>
      </div>
   );
}

export function ActiveDeductionDetailContent({
   summary,
   detail,
   isLoading,
   isError,
}: ActiveDeductionDetailContentProps) {

   const {companyId, moduleCode, } = useUserStore();

   const [view, setView] = useState<ActiveDeductionView>("detail");
   const [slideDirection, setSlideDirection] = useState<"back" | "forward">("back");

   const goToDetails = () => {
      setView("detail")
      setSlideDirection("back")
   }

   const goToPayments = () => {
      setView("payments")
      setSlideDirection("forward")
   }

   useEffect(() => goToDetails(), [summary?.deduction_id]);

   const { useGetDeductionPayments } = useDeduction();

   const { data: payments, isLoading: isPaymentLoading, isError: isPaymentError } = useGetDeductionPayments(

      {
         companie_id: companyId,
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

   return (
      <div className="flex min-w-0 flex-col gap-5">

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

         <div className="relative min-h-[12rem]">
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
                     <Spinner size="medium" className="text-blue-600 dark:text-blue-400" />
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
                        message="No se pudo obtener el detalle de la deducción."
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
                     transition={{ ...fadeSlideTransition, delay: 0.06 }}
                     className="overflow-hidden"
                  >
                     <AnimatePresence initial={false} mode="wait">
                        <m.div
                           key={view}
                           initial={{ opacity: 0, x: slideDirection === "forward" ? 24 : -24 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: slideDirection === "forward" ? -24 : 24 }}
                           transition={fadeSlideTransition}
                        >
                           {view === "detail" ? (
                              <DetailBody detail={detail} onViewPayments={goToPayments} />
                           ) : (
                              <ActiveDeductionPayments
                                 payments={payments}
                                 isLoading={isPaymentLoading}
                                 isError={isPaymentError}
                                 onBack={goToDetails}
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
