import type { ServiceOrderData } from "@app/modules/purchasing/ui/pages/purchase-order/template/types/service-order.props";

export const MOCK_SERVICE_ORDER: ServiceOrderData = {
  companyName: "ALPAC",
  city: "MANAGUA, NICARAGUA",
  supplierName: "INDITEC",
  date: "21/07/2026",
  orderNumber: "OC-VIG-0947",
  paymentCondition: "Contado",
  materialRequest: "",
  requestingDepartment: "ALPAC",
  proforma: "PROFORMA",
  notes:
    "Por compra de cámaras de seguridad que serán ubicadas en el circuito de vigilancia ubicado en Alpac cto. Correspondiente al mes de julio 2026",
  items: [
    {
      quantity: 1,
      unit: "Unidad",
      code: "1479",
      description: "Cable CAT 6",
      flag: "SI",
      unitPrice: 6330.51,
      totalAmount: 6330.51,
    },
    {
      quantity: 6,
      unit: "Unidad",
      code: "1150",
      description: "Camara digital",
      flag: "SI",
      unitPrice: 3137.22,
      totalAmount: 18823.32,
    },
  ],
  subTotal: 25153.83,
  discount: 0,
  iva: 0,
  exo: 25153.83,
  total: 25153.83,
  requisitionNumber: "REQ-VIG-0733",
  preparedBy: "Alison Cruz",
  authorizedBy: "",
};
