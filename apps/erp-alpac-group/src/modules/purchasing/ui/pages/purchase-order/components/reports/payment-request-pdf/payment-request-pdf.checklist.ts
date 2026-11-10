import type {
  PaymentRequestChecklistItem,
  PaymentRequestChecklistSection,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/payment-request-pdf/payment-request-pdf.types";

const checklistItem = (
  id: string,
  description: string,
): PaymentRequestChecklistItem => ({
  id,
  description,
  checked: false,
});

export const DEFAULT_PAYMENT_REQUEST_CHECKLIST: readonly PaymentRequestChecklistSection[] =
  [
    {
      title: "DOCUMENTOS GENERALES",
      items: [
        checklistItem(
          "signed-request",
          "Solicitud firmada por el departamento solicitante.",
        ),
        checklistItem(
          "purchase-order",
          "Copia ( ) u original ( ) de orden de compra.",
        ),
        checklistItem(
          "invoice",
          "Copia ( ) u original ( ) de factura, ND, NC o retención.",
        ),
        checklistItem(
          "comparative",
          "Cuadro comparativo de cotizaciones y justificación.",
        ),
        checklistItem("quotes", "Cotizaciones efectuadas, cantidad (  )."),
        checklistItem(
          "requisition",
          "Solicitud mensual/eventual o requisición autorizada.",
        ),
        checklistItem("exemption", "Carta de exoneración DGI ( ), ALMA ( )."),
        checklistItem(
          "communications",
          "Comunicaciones relacionadas con el pago.",
        ),
        checklistItem("others", "Otros."),
      ],
    },
    {
      title: "SERVICIOS",
      items: [
        checklistItem("contract", "Contrato original debidamente firmado."),
        checklistItem("budget", "Presupuesto del servicio (si aplica)."),
        checklistItem("settlement", "Finiquito de servicio."),
      ],
    },
  ];

export function buildPaymentRequestChecklist(
  checkedIds: ReadonlySet<string>,
): PaymentRequestChecklistSection[] {
  return DEFAULT_PAYMENT_REQUEST_CHECKLIST.map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({
      ...item,
      checked: checkedIds.has(item.id),
    })),
  }));
}
