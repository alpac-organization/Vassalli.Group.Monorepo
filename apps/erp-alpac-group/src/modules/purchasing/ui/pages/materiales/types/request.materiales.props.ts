export type MaterialRequestPeriod = "Eventual" | "Mensual";

export interface MaterialRequestItem {
  code: string;
  name: string;
  unit: string;
  requestedQuantity: number | string;
  deliveredOrPending: string;
  requesterStock: string;
  observations: string;
}

export interface MaterialRequestData {
  companyName: string;
  formCode: string;
  requester: string;
  period: MaterialRequestPeriod;
  category: string;
  requestNumber: string;
  date: string;
  items: MaterialRequestItem[];
  areaManager: string;
  authorizedBy: string;
  modifiedBy: string;
  deliveryDate: string;
  receivedBy: string;
  requestedAt: string;
  authorizedAt: string;
  reviewedAt: string;
}
