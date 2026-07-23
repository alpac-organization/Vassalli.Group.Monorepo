import type { MaterialRequestData } from "@app/modules/purchasing/ui/pages/materiales/types/request.materiales.props";

export const MOCK_MATERIAL_REQUEST: MaterialRequestData = {
  companyName: "ALPAC",
  formCode: "RC-SEG-02",
  requester: "Informatica",
  period: "Eventual",
  category: "Oficina/Otros",
  requestNumber: "ALP-EVE-0790",
  date: "29-junio-2026",
  items: [
    {
      code: "004",
      name: "CANALETA DLP 1 COMPARTIMIENTO BTICINO:50X20MM",
      unit: "Unidad",
      requestedQuantity: 3,
      deliveredOrPending: "",
      requesterStock: "",
      observations:
        "para ser utilizado en modulo de Almacen y organizar cables de red",
    },
  ],
  areaManager: "Gabriel Morales",
  authorizedBy: "Sergio Alvarado",
  modifiedBy: "",
  deliveryDate: "",
  receivedBy: "",
  requestedAt: "29/06/2026 11:37 a.m.",
  authorizedAt: "29/06/2026 11:37 a.m.",
  reviewedAt: "",
};
export const EMPTY_MATERIAL_ROWS = 12;
