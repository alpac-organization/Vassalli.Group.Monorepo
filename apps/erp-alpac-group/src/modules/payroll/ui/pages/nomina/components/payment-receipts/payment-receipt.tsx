import { Document, Text, View } from "@react-pdf/renderer";

import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { TMN_TRANSPORT_NAME } from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import type { PaymentReceiptProps } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/types/payment.receipts.types";
import {
  formatCordoba,
  formatUsd,
} from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/format-receipt.utils";
import { StandardPage } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/components/standard-receipt";
import { receiptStyles as s } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/styles.receipt";
import { TransportistasPage } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/components/transportistas-receipt";
import type { TravelRoute } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/types/payment.receipts.types";

export type PaymentReceiptItem = PayrollItemResponse & {
  feriado?: number;
  travel_routes?: TravelRoute[];
  quantity_of_trips?: number;
};

export function TravelRouteRow({
  route,
  isLast,
}: {
  route: TravelRoute;
  isLast: boolean;
}) {
  return (
    <View style={isLast ? s.routeRowLast : s.routeRow}>
      <View style={s.routeColOrigin}>
        <Text style={s.routeOriginText}>{route.origin_destination}</Text>
      </View>
      <View style={s.routeColValue}>
        <Text style={s.routeAmountText}>{formatUsd(route.trip_value_usd)}</Text>
      </View>
      <View style={s.routeColValue}>
        <Text style={s.routeAmountText}>
          {formatUsd(route.trip_value_usd_11pct)}
        </Text>
      </View>
      <View style={s.routeColValueLast}>
        <Text style={s.routeAmountText}>
          {formatCordoba(route.trip_value_cordoba)}
        </Text>
      </View>
    </View>
  );
}

export function PaymentReceiptDocument({
  data,
  companyName,
  startDate,
  endDate,
  branchName,
}: PaymentReceiptProps) {
  const isTransportista = branchName === TMN_TRANSPORT_NAME;

  return (
    <Document>
      {data.map((item, index) =>
        isTransportista ? (
          <TransportistasPage
            key={item.ordinary_payroll_id ?? index}
            item={item}
            companyName={companyName}
            startDate={startDate}
            endDate={endDate}
            branchName={branchName}
            index={index}
          />
        ) : (
          <StandardPage
            key={item.ordinary_payroll_id ?? index}
            item={item}
            companyName={companyName}
            startDate={startDate}
            endDate={endDate}
            branchName={branchName}
            index={index}
          />
        ),
      )}
    </Document>
  );
}
