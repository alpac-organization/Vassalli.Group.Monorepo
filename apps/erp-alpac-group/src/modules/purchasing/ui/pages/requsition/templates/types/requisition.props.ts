export interface RequisitionItem {
  quantity: number;
  description: string;
  justification: string;
}

export interface RequisitionData {
  companyName: string;
  formCode: string;
  requisitionNumber: string;
  items: RequisitionItem[];
  areaRequester: string;
  requestedDate: string;
  modifiedDate: string;
  authorizationName: string;
  receivedDate: string;
  receivedTime: string;
  requestedAt: string;
  authorizedAt: string;
  reviewedAt: string;
}
