import { useCallback, useMemo, useState } from "react";
import { m } from "framer-motion";
import {
  Alert,
  AnimatedAlertWrapper,
  Breadcrumb,
  Badges,
  Accordion,
  Button,
  Modal,
} from "@alpac/design-system";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { Loader } from "@app/shared/components/loaders/loader";
import { useQuoteAnalysis } from "@app/modules/finance/ui/hooks/quotes-analysis/useQuoteAnalysis";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { getStatusBadge } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/utils/quote-analysis.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { QuoteProductComparison } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison";
import { SendReviewModal } from "@app/modules/finance/ui/pages/quote-analisys/components/send-review-modal/send-review-modal";
import type { SendReviewModalConfirmPayload } from "@app/modules/finance/ui/pages/quote-analisys/components/send-review-modal/send-review-modal.types";
import type {
  PurchaseRequestProductInformation,
  PurchaseRequestProductQuotation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import {
  Building2,
  Calendar,
  FileText,
  User,
  Info,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PurchaseRequestStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import {
  purchaseRequestPriorityBadgeVariants,
  purchaseRequestStatusBadgeVariants,
  purchaseRequestTypeBadgeVariants,
} from "@app/modules/purchasing/ui/pages/purchase-requests/purchase-request.variants";

export function QuoteAnalysisDetail() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { getMappedError } = useMappedError();
  const { companyId, moduleCode } = useUserStore();

  const [selectedQuotes, setSelectedQuotes] = useState<Record<string, string>>({});
  const [pendingAccept, setPendingAccept] = useState<{
    itemId: string;
    quotation: PurchaseRequestProductQuotation;
  } | null>(null);
  const [isSendReviewOpen, setIsSendReviewOpen] = useState(false);
  const { alertState, handleCloseAlert, handleRequestSuccess, handleRequestError } =
    useAlertState();

  const payloadGetQuoteAnalysisDetails = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      requisition_accounting_review_id: reviewId || "",
    }),
    [companyId, moduleCode, reviewId],
  );

  const {
    GetQuoteAnalysisDetails,
    AcceptQuotationToPurchase,
    SendReviewToManagement,
  } = useQuoteAnalysis({
    payloadGetQuoteAnalysisDetails,
  });

  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = GetQuoteAnalysisDetails;

  const payloadGetPurchaseRequestProducts = useMemo(
    () =>
      detailData?.purchase_request?.purchase_request_id
        ? {
          company_id: companyId,
          module_code: moduleCode,
          purchase_request_id:
            detailData.purchase_request.purchase_request_id,
        }
        : undefined,
    [companyId, moduleCode, detailData?.purchase_request?.purchase_request_id],
  );

  const { GetPurchaseRequestProducts } = usePurchase({
    getPurchaseRequestProductsPayload: payloadGetPurchaseRequestProducts,
  });

  const { data: productsData, isLoading: isLoadingProducts } =
    GetPurchaseRequestProducts;

  const handleRequestAccept = useCallback(
    (itemId: string, quotation: PurchaseRequestProductQuotation) => {
      setPendingAccept({ itemId, quotation });
    },
    [],
  );

  const handleCloseAcceptModal = useCallback(() => {
    if (AcceptQuotationToPurchase.isPending) return;
    setPendingAccept(null);
  }, [AcceptQuotationToPurchase.isPending]);

  const handleConfirmAccept = useCallback(() => {
    if (!pendingAccept || !companyId || !moduleCode) return;

    AcceptQuotationToPurchase.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        quotation_id: pendingAccept.quotation.quotation_id,
        purchase_request_item_id: pendingAccept.itemId,
      },
      {
        onSuccess: () => {
          setSelectedQuotes((prev) => ({
            ...prev,
            [pendingAccept.itemId]: pendingAccept.quotation.quotation_id,
          }));
          setPendingAccept(null);
        },
      },
    );
  }, [AcceptQuotationToPurchase, companyId, moduleCode, pendingAccept]);

  const handleCloseSendModal = useCallback(() => {
    if (SendReviewToManagement.isPending) return;
    setIsSendReviewOpen(false);
  }, [SendReviewToManagement.isPending]);

  const handleConfirmSendToReview = useCallback(
    (payload: SendReviewModalConfirmPayload) => {
      if (!reviewId || !companyId || !moduleCode) return;

      SendReviewToManagement.mutate(
        {
          company_id: companyId,
          module_code: moduleCode,
          requisition_accounting_review_id: reviewId,
          comments: payload.comments,
          is_approved: payload.isApproved,
        },
        {
          onSuccess: () => {
            setIsSendReviewOpen(false);
            handleRequestSuccess("La solicitud se envió a revisión gerencial.");
          },
          onError: (error) => {
            const errorMessage = getMappedError(error);
            handleRequestError(errorMessage.description ?? "Error al enviar la solicitud a revisión gerencial.");
          },
        },
      );
    },
    [
      SendReviewToManagement,
      companyId,
      handleRequestSuccess,
      moduleCode,
      reviewId,
    ],
  );

  const productsToDisplay: PurchaseRequestProductInformation[] =
    productsData?.data ?? [];

  const pendingSupplierName =
    pendingAccept?.quotation.supplier_information?.suppliers_legal_name?.trim() ||
    "este proveedor";

  if (
    isLoadingDetail ||
    (payloadGetPurchaseRequestProducts && isLoadingProducts)
  ) {
    return <Loader title="Cargando detalle del análisis..." />;
  }

  if (isErrorDetail || !detailData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <p>No se pudo cargar el detalle del análisis.</p>
        <Button
          className="mt-4"
          onClick={() => navigate(`${baseUrl}/finance/analisys`)}
          label="Volver al listado"
        />
      </div>
    );
  }

  const {
    purchase_request,
    sent_by_user_information,
    status,
    comments,
    sent_to_review_at,
  } = detailData;
  const badge = getStatusBadge(status);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full pb-12"
    >
      <div className="flex justify-start">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Análisis comparativo",
              url: `${baseUrl}/finance/analisys`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Detalle",
              url: `${baseUrl}/finance/analisys/${reviewId}`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:gap-6 sm:p-5 md:p-6 dark:border-slate-700/50 dark:bg-[#272b34]">
        <div className="sticky -top-10 z-20 -mx-3 -mt-3 flex flex-col gap-3 border-b border-slate-200 bg-white px-3 pt-3 pb-4 sm:-mx-5 sm:-mt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5 sm:pt-5 sm:pb-6 md:-mx-6 md:-mt-6 md:px-6 md:pt-6 dark:border-slate-700/50 dark:bg-[#272b34]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="m-0 break-all text-base font-semibold text-slate-900 dark:text-white sm:text-lg md:text-xl">
                {purchase_request.code || "Sin código"}
              </h3>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">
                {purchase_request.branch_information?.branch_name ||
                  "Sin sucursal"}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="min-w-0 break-words">
                {purchase_request.branch_information?.company_alias ||
                  "Sin empresa"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Badges label={badge.label} color={badge.color} />
            <Button
              type="button"
              size="giant"
              label="Enviar a revisión"
              onClick={() => setIsSendReviewOpen(true)}
              disabled={SendReviewToManagement.isPending}
              className="rounded-md! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700!"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 p-3 sm:p-5 dark:border-slate-700/50 dark:bg-[#1e2229]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Solicitud de compra
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <FileText className="h-3.5 w-3.5 shrink-0" /> Tipo
                </span>
                <Badges
                  label={
                    PurchaseRequestEnum[
                      purchase_request.request_type as keyof typeof PurchaseRequestEnum
                    ]?.label ?? purchase_request.request_type
                  }
                  color={
                    purchaseRequestTypeBadgeVariants[
                      purchase_request.request_type as keyof typeof purchaseRequestTypeBadgeVariants
                    ]?.badgeColor ??
                    purchaseRequestTypeBadgeVariants.default.badgeColor
                  }
                  className="w-fit"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <FileText className="h-3.5 w-3.5 shrink-0" /> Prioridad
                </span>
                <Badges
                  label={
                    PriorityLevelEnum[
                      purchase_request.priority_level as keyof typeof PriorityLevelEnum
                    ]?.label ?? purchase_request.priority_level
                  }
                  color={
                    purchaseRequestPriorityBadgeVariants[
                      purchase_request.priority_level as keyof typeof purchaseRequestPriorityBadgeVariants
                    ]?.badgeColor ??
                    purchaseRequestPriorityBadgeVariants.default.badgeColor
                  }
                  className="w-fit"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 shrink-0" /> Fecha solicitud
                </span>
                <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                  {formatDateToSpanishWords(purchase_request.request_date)}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 shrink-0" /> Fecha revisión
                </span>
                <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                  {formatDateToSpanishWords(
                    purchase_request.revision_date || "",
                  )}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Estado
                </span>
                <Badges
                  label={
                    PurchaseRequestStatusEnum[
                      purchase_request.request_status as keyof typeof PurchaseRequestStatusEnum
                    ]?.label ?? purchase_request.request_status
                  }
                  color={
                    purchaseRequestStatusBadgeVariants[
                      purchase_request.request_status as keyof typeof purchaseRequestStatusBadgeVariants
                    ]?.badgeColor ??
                    purchaseRequestStatusBadgeVariants.default.badgeColor
                  }
                  className="w-fit"
                />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-md bg-slate-50 p-3 dark:bg-[#272b34]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {purchase_request.creator_user_information?.fullname?.charAt(
                    0,
                  ) || "U"}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
                    Solicitante
                  </span>
                  <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                    {purchase_request.creator_user_information?.fullname || "—"}
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-3 rounded-md bg-slate-50 p-3 dark:bg-[#272b34]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {purchase_request.reviewer_user_information?.fullname?.charAt(
                    0,
                  ) || "U"}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400">
                    Revisor
                  </span>
                  <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                    {purchase_request.reviewer_user_information?.fullname ||
                      "—"}
                  </span>
                </div>
              </div>
            </div>

            {purchase_request.observations && (
              <div className="mt-2 break-words rounded-md bg-slate-50 p-3 text-sm text-slate-700 dark:bg-[#272b34] dark:text-slate-300">
                <span className="font-semibold">Observaciones: </span>
                {purchase_request.observations}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 p-3 sm:p-5 dark:border-slate-700/50 dark:bg-[#1e2229]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Revisión contable
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <User className="h-3.5 w-3.5 shrink-0" /> Enviado por
                </span>
                <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                  {sent_by_user_information?.fullname || "—"}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Info className="h-3.5 w-3.5 shrink-0" /> Correo
                </span>
                <span className="break-all text-sm font-medium text-slate-900 dark:text-slate-200">
                  {sent_by_user_information?.email || "—"}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 shrink-0" /> Enviado a
                  revisión
                </span>
                <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                  {formatDateToSpanishWords(sent_to_review_at)}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Building2 className="h-3.5 w-3.5 shrink-0" /> Área
                </span>
                <span className="break-words text-sm font-medium text-slate-900 dark:text-slate-200">
                  {sent_by_user_information?.work_area_information
                    ?.work_area_name || "—"}
                </span>
              </div>
            </div>

            {comments && (
              <div className="mt-auto break-words rounded-md bg-slate-50 p-3 text-sm text-slate-700 dark:bg-[#272b34] dark:text-slate-300">
                <span className="font-semibold">Comentarios: </span>
                {comments}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 flex min-w-0 flex-col gap-4 sm:mt-4 sm:gap-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700/50">
            <h5 className="m-0 min-w-0 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs dark:text-slate-400">
              Ítems y comparativo de cotizaciones
            </h5>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
              {productsToDisplay.length}
            </span>
          </div>

          {productsToDisplay.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-[#1e2229] dark:text-slate-400">
              No hay productos asociados a esta solicitud.
            </div>
          ) : (
            <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
              {productsToDisplay.map((product) => {
                const productKey = product.purchase_request_item_id;
                const productName =
                  product.product_details?.product_name ||
                  "Producto sin nombre";
                const productDescription = product.description?.trim();
                const categoryName =
                  product.product_details?.category_information?.name ||
                  "Sin categoría";
                const unitSymbol =
                  product.unit_measure_information?.symbol ||
                  product.unit_measure_information?.name ||
                  "und";
                const quotations = product.quotations ?? [];
                const quotesCount = quotations.length;

                return (
                  <Accordion
                    key={productKey}
                    title={
                      <div className="flex min-w-0 items-start gap-2 py-1 pr-1 sm:gap-3 sm:pr-2">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 sm:h-10 sm:w-10 dark:border-slate-600 dark:bg-[#272b34] dark:text-slate-300">
                          <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="min-w-0">
                            <p className="m-0 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white sm:text-[15px]">
                              {productName}
                              {productDescription ? (
                                <span className="font-normal text-slate-500 dark:text-slate-400">
                                  {" "}
                                  — {productDescription}
                                </span>
                              ) : null}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 sm:text-[11px] dark:bg-blue-500/15 dark:text-blue-300">
                              {categoryName}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 sm:text-[11px] dark:bg-slate-700/70 dark:text-slate-300">
                              {product.quantity} {unitSymbol}
                            </span>
                            {product.quantity_unit != null && (
                              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 sm:text-[11px] dark:bg-slate-700/70 dark:text-slate-300">
                                {product.quantity_unit} u/paq
                              </span>
                            )}
                            <span
                              className={`rounded-md px-2 py-1 text-[10px] font-medium sm:text-[11px] ${quotesCount > 0
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                }`}
                            >
                              {quotesCount} cotización(es)
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-[#1e2229]"
                    triggerClassName="!h-auto min-h-[64px] sm:min-h-[72px] !items-center !px-2.5 !py-3 sm:!px-4 sm:!py-3.5 dark:!bg-[#1e2229] hover:dark:!bg-[#232830] [&_svg]:!h-5 [&_svg]:!w-5 sm:[&_svg]:!h-6 sm:[&_svg]:!w-6"
                    contentClassName="border-t border-slate-200 dark:border-slate-700/50"
                  >
                    <div className="flex min-w-0 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
                      {product.justification && (
                        <div className="break-words rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 sm:px-3.5 sm:py-3 dark:border-slate-700/50 dark:bg-[#272b34] dark:text-slate-300">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Justificación:{" "}
                          </span>
                          {product.justification}
                        </div>
                      )}

                      <QuoteProductComparison
                        itemId={productKey}
                        quotations={quotations}
                        selectedQuotationId={selectedQuotes[productKey]}
                        onRequestAccept={handleRequestAccept}
                        isAccepting={AcceptQuotationToPurchase.isPending}
                      />
                    </div>
                  </Accordion>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SendReviewModal
        isOpen={isSendReviewOpen}
        pendingLabel={
          purchase_request.code?.trim() ||
          sent_by_user_information?.fullname?.trim() ||
          "esta solicitud"
        }
        isSubmitting={SendReviewToManagement.isPending}
        onClose={handleCloseSendModal}
        onConfirm={handleConfirmSendToReview}
      />

      <Modal
        isOpen={Boolean(pendingAccept)}
        onClose={handleCloseAcceptModal}
        variant="warning"
        size="md"
        title="Confirmar oferta"
        description={`¿Desea aceptar la oferta de ${pendingSupplierName}? Esta acción no se puede deshacer.`}
      >
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseAcceptModal}
            disabled={AcceptQuotationToPurchase.isPending}
            className="w-full! rounded-md! border! border-slate-400! bg-transparent! text-[15px]! text-slate-700! hover:bg-slate-100! dark:border-slate-500! dark:text-slate-200! dark:hover:bg-slate-700/40! sm:w-auto!"
          />
          <Button
            type="button"
            size="giant"
            label="Aceptar oferta"
            onClick={handleConfirmAccept}
            isLoading={AcceptQuotationToPurchase.isPending}
            className="w-full! rounded-md! bg-alpac-primary-500! text-[15px]! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
          />
        </div>
      </Modal>

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </m.div>
  );
}
