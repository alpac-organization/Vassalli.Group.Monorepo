import type { PaymentReceiptItem } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/payment-receipt";

export type StandardPageProps = {
  item: PaymentReceiptItem;
  companyName: string;
  startDate?: string;
  endDate?: string;
  branchName?: string;
  index: number;
};

export type PaymentReceiptProps = {
  data: PaymentReceiptItem[];
  companyName: string;
  startDate?: string;
  endDate?: string;
  branchName?: string;
};

export type TravelRoute = {
  origin_destination: string;
  trip_value_usd: number;
  trip_value_usd_11pct: number;
  trip_value_cordoba: number;
};
export type TransportistasPageProps = {
  item: PaymentReceiptItem;
  companyName: string;
  startDate?: string;
  endDate?: string;
  branchName?: string;
  index: number;
};
