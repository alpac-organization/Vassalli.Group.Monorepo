export interface ServiceOrderItem {
  quantity: number;
  unit: string;
  code: string;
  description: string;
  flag?: string;
  unitPrice: number;
  totalAmount: number;
}

export interface ServiceOrderData {
  companyName: string;
  city: string;
  supplierName: string;
  date: string;
  orderNumber: string;
  paymentCondition: string;
  materialRequest: string;
  requestingDepartment: string;
  proforma: string;
  notes: string;
  items: ServiceOrderItem[];
  subTotal: number;
  discount: number;
  iva: number;
  exo: number;
  total: number;
  requisitionNumber: string;
  preparedBy: string;
  authorizedBy: string;
}
