import type { RequisitionData } from "@app/modules/purchasing/ui/pages/requsition/templates/types/requisition.props";

export const MOCK_REQUISITION: RequisitionData = {
  companyName: "ALPAC",
  formCode: "RC-GEN-06",
  requisitionNumber: "REQ-ALPC-0733",
  items: [
    {
      quantity: 6,
      description: "camaras ip Bullet 4mp micro sd",
      justification:
        "para ser colocadas en circuito de vigilancia de Alpac cto",
    },
    {
      quantity: 50,
      description: "conectores rj45 cat6",
      justification:
        "para ser colocadas en circuito de vigilancia de Alpac cto",
    },
    {
      quantity: 1,
      description: "caja de cable cat 6 100% cobre exterior 305mts",
      justification:
        "para ser colocadas en circuito de vigilancia de Alpac cto",
    },
  ],
  areaRequester: "Gabriel Morales",
  requestedDate: "21/07/2026",
  modifiedDate: "21/07/2026",
  authorizationName: "Sergio Alvarado",
  receivedDate: "21/07/2026",
  receivedTime: "10:58 a.m.",
  requestedAt: "21/07/2026 10:53 a.m.",
  authorizedAt: "21/07/2026 10:58 a.m.",
  reviewedAt: "",
};
