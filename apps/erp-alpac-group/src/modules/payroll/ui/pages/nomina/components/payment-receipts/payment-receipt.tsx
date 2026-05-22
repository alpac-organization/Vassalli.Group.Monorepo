import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { TMN_TRANSPORT_NAME } from "@app/modules/payroll/ui/pages/nomina/constants/payroll.constants";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import {
  LETTER_PORTRAIT_SIZE,
  receiptStyles as s,
} from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/styles.receipt";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export type TravelRoute = {
  origin_destination: string;
  trip_value_usd: number;
  trip_value_usd_11pct: number;
  trip_value_cordoba: number;
};

export type PaymentReceiptItem = PayrollItemResponse & {
  feriado?: number;
  travel_routes?: TravelRoute[];
  quantity_of_trips?: number;
};

export type PaymentReceiptProps = {
  data: PaymentReceiptItem[];
  companyName: string;
  startDate?: string;
  endDate?: string;
  branchName?: string;
};

type StandardPageProps = {
  item: PaymentReceiptItem;
  companyName: string;
  startDate?: string;
  endDate?: string;
  branchName?: string;
  index: number;
};

function StandardPage({
  item,
  companyName,
  startDate,
  endDate,
}: StandardPageProps) {
  const collaborator = item.collaborator;

  const incomeLines: { label: string; value: number }[] = [
    { label: "ORDINARIO", value: item.biweekly_salary },
    { label: "ANTIGUEDAD", value: item.antique ?? 0 },
    { label: "HORAS EXTRAS", value: item.overtime ?? 0 },
    { label: "FERIADO", value: item.feriado ?? 0 },
    { label: "COMISIONES", value: item.commissions ?? 0 },
    { label: "VACACIONES", value: item.vacations ?? 0 },
    { label: "TRANSPORTE", value: item.transport ?? 0 },
    { label: "ALIMENTACION", value: item.feeding ?? 0 },
    { label: "HOSPEDAJE", value: item.lodging ?? 0 },
  ].filter((l) => l.value > 0);

  const deductionLines: { label: string; value: number }[] = [
    { label: "IR", value: item.ir },
    { label: "INSS", value: item.inss },
  ].filter((l) => l.value > 0);

  const monthlySalary = item.biweekly_salary * 2;
  const totalIngresos = item.total_income ?? item.gross_salary ?? 0;
  const totalEgresos = item.total_legal_deductions ?? 0;

  return (
    <Page size={LETTER_PORTRAIT_SIZE} style={s.page}>
      <Text style={s.companyName}>{companyName}</Text>
      <Text style={s.title}>RECIBO DE PAGO</Text>
      <Text style={s.period}>
        PERIODO DEL {formatDateToSpanishWords(startDate)}
        {"   "}AL{"   "}
        {formatDateToSpanishWords(endDate)}
      </Text>

      <View style={s.infoBox}>
        <View style={s.infoLeft}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Area:</Text>
            <Text style={s.infoValue}>{collaborator?.work_area ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Nombre:</Text>
            <Text style={s.infoValue}>{collaborator?.full_name ?? ""}</Text>
          </View>
          {item.DAEM ? (
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Dia Acumulados Vacaciones:</Text>
              <Text style={s.infoValue}>{item.DAEM}</Text>
            </View>
          ) : null}
        </View>

        <View style={s.infoRight}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Ubicacion</Text>
            <Text style={s.infoValue}>{collaborator?.job_position ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Sueldo Mensual:</Text>
            <Text style={s.infoValue}>
              C${"  "}
              {formatCurrency(monthlySalary)}
            </Text>
          </View>
        </View>
      </View>

      <View style={s.table}>
        <View style={s.tableHeader}>
          <Text style={s.headerCell}>INGRESOS</Text>
          <Text style={s.headerCellLast}>EGRESOS</Text>
        </View>

        <View style={s.tableBody}>
          <View style={s.incomeCol}>
            {incomeLines.map((line) => (
              <View key={line.label} style={s.lineItem}>
                <Text style={s.lineLabel}>{line.label}</Text>
                <Text style={s.lineValue}>{formatCurrency(line.value)}</Text>
              </View>
            ))}
            {(item.number_overtime ?? 0) > 0 && (
              <Text style={s.extraInfoText}>
                Horas Extras:{"  "}
                {item.number_overtime?.toFixed(2)}
              </Text>
            )}
          </View>

          <View style={s.deductCol}>
            {deductionLines.map((line) => (
              <View key={line.label} style={s.lineItem}>
                <Text style={s.lineLabel}>{line.label}</Text>
                <Text style={s.lineValue}>{formatCurrency(line.value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.totalsRow}>
          <View style={s.totalsIncomeCell}>
            <Text style={s.totalsLabel}>TOTAL INGRESOS</Text>
            <Text style={s.totalsValue}>{formatCurrency(totalIngresos)}</Text>
          </View>
          <View style={s.totalsDeductCell}>
            <Text style={s.totalsLabel}>TOTAL EGRESOS:</Text>
            <Text style={s.totalsValue}>{formatCurrency(totalEgresos)}</Text>
          </View>
        </View>

        <View style={s.netRow}>
          <Text style={s.netLabel}>NETO A RECIBIR</Text>
          <Text style={s.netValue}>{formatCurrency(item.total_to_pay)}</Text>
        </View>
      </View>

      <View style={s.signatureArea}>
        <View style={s.signatureLine} />
        <Text style={s.signatureLabel}>RECIBI CONFORME</Text>
      </View>
    </Page>
  );
}

type TransportistasPageProps = {
  item: PaymentReceiptItem;
  companyName: string;
  startDate?: string;
  endDate?: string;
  branchName?: string;
  index: number;
};

const IR_PERCENTAGE = 7.14;
const INSS_PERCENTAGE = 7.14;

function TransportistasPage({
  item,
  companyName,
  startDate,
  endDate,
}: TransportistasPageProps) {
  const collaborator = item.collaborator;
  const routes = item.travel_routes ?? [];

  const incomeLinesPct: { label: string; pct: string; value: number }[] = [
    {
      label: "VACACIONES",
      pct: `${(((item.vacations ?? 0) / (item.biweekly_salary || 1)) * 100).toFixed(2)}%`,
      value: item.vacations ?? 0,
    },
    {
      label: "AGUINALDO",
      pct: `${(((item.antique ?? 0) / (item.biweekly_salary || 1)) * 100).toFixed(2)}%`,
      value: item.antique ?? 0,
    },
    {
      label: "SALARIO",
      pct: `${(100).toFixed(2)}%`,
      value: item.biweekly_salary,
    },
  ].filter((l) => l.value > 0);

  const totalIngresos = item.total_income ?? item.gross_salary ?? 0;
  const totalEgresos = item.total_legal_deductions ?? 0;
  const otrasDeductions = totalEgresos - (item.ir ?? 0) - (item.inss ?? 0);

  return (
    <Page size={LETTER_PORTRAIT_SIZE} style={s.page}>
      <Text style={s.companyName}>{companyName}</Text>
      <Text style={s.title}>RECIBO DE PAGO</Text>
      <Text style={s.period}>
        PERIODO DEL{"  "}
        {formatDateToSpanishWords(startDate)}
        {"   "}AL{"   "}
        {formatDateToSpanishWords(endDate)}
      </Text>

      <View style={s.infoBox}>
        <View style={s.infoLeft}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Area:</Text>
            <Text style={s.infoValue}>{collaborator?.work_area ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Nombre:</Text>
            <Text style={s.infoValue}>{collaborator?.full_name ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Cantidad de Viajes</Text>
            <Text style={s.infoValue}>
              {(item.quantity_of_trips ?? 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={s.infoRight}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Ubicacion:</Text>
            <Text style={s.infoValue}>{collaborator?.job_position ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Salario Quincenal:</Text>
            <Text style={s.infoValue}>
              C${"  "}
              {formatCurrency(item.biweekly_salary)}
            </Text>
          </View>
        </View>
      </View>

      <View style={s.table}>
        <View style={s.tableHeader}>
          <Text style={s.headerCell}>INGRESOS</Text>
          <Text style={s.headerCellLast}>EGRESOS</Text>
        </View>

        <View style={s.tableBody}>
          <View style={s.incomeCol}>
            {incomeLinesPct.map((line) => (
              <View key={line.label} style={s.lineItem}>
                <Text style={s.lineLabelPct}>{line.label}</Text>
                <Text style={s.linePct}>{line.pct}</Text>
                <Text style={s.lineValuePct}>{formatCurrency(line.value)}</Text>
              </View>
            ))}

            {routes.length > 0 && (
              <View style={s.routeTable}>
                <View style={s.routeHeaderRow}>
                  <Text style={s.routeHeaderCell}>ORIGEN | DESTINO</Text>
                  <Text style={s.routeHeaderCell}>Valor del Viaje</Text>
                  <Text style={s.routeHeaderCell}>
                    Valor del Viaje{"\n"}USS 11%
                  </Text>
                  <Text style={s.routeHeaderCellLast}>
                    Valor del Viaje{"\n"}C$
                  </Text>
                </View>
                {routes.map((route, idx) => {
                  const isLast = idx === routes.length - 1;
                  return (
                    <View
                      key={`route-${idx}`}
                      style={isLast ? s.routeRowLast : s.routeRow}
                    >
                      <Text style={s.routeCell}>
                        {route.origin_destination}
                      </Text>
                      <Text style={s.routeCellRight}>
                        {formatCurrency(route.trip_value_usd)}
                      </Text>
                      <Text style={s.routeCellRight}>
                        {formatCurrency(route.trip_value_usd_11pct)}
                      </Text>
                      <Text style={s.routeCellLast}>
                        {formatCurrency(route.trip_value_cordoba)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={s.deductCol}>
            <View style={s.lineItem}>
              <Text style={s.lineLabelPct}>IR</Text>
              <Text style={s.linePct}>{IR_PERCENTAGE.toFixed(2)}%</Text>
              <Text style={s.lineValuePct}>{formatCurrency(item.ir)}</Text>
            </View>
            <View style={s.lineItem}>
              <Text style={s.lineLabelPct}>INSS</Text>
              <Text style={s.linePct}>{INSS_PERCENTAGE.toFixed(2)}%</Text>
              <Text style={s.lineValuePct}>{formatCurrency(item.inss)}</Text>
            </View>
            {otrasDeductions > 0 && (
              <View style={s.lineItem}>
                <Text style={s.lineLabelPct}>OTRAS DEDUCCIONES</Text>
                <Text style={s.linePct}></Text>
                <Text style={s.lineValuePct}>
                  {formatCurrency(otrasDeductions)}
                </Text>
              </View>
            )}
            {otrasDeductions <= 0 && (
              <View style={s.lineItem}>
                <Text style={s.lineLabelPct}>OTRAS DEDUCCIONES</Text>
                <Text style={s.linePct}></Text>
                <Text style={s.lineValuePct}>-</Text>
              </View>
            )}
          </View>
        </View>

        <View style={s.totalsRow}>
          <View style={s.totalsIncomeCell}>
            <Text style={s.totalsLabel}>TOTAL INGRESOS: C$</Text>
            <Text style={s.totalsValue}>{formatCurrency(totalIngresos)}</Text>
          </View>
          <View style={s.totalsDeductCell}>
            <Text style={s.totalsLabel}>TOTAL EGRESO: C$</Text>
            <Text style={s.totalsValue}>{formatCurrency(totalEgresos)}</Text>
          </View>
        </View>

        <View style={s.netRow}>
          <Text style={s.netLabel}>NETO A RECIBIR</Text>
          <Text style={s.netValue}>
            C${"  "}
            {formatCurrency(item.total_to_pay)}
          </Text>
        </View>
      </View>

      <View style={s.signatureArea}>
        <View style={s.signatureLine} />
        <Text style={s.signatureLabel}>RECIBI CONFORME</Text>
      </View>
    </Page>
  );
}

export function PaymentReceiptDocument({
  data,
  companyName,
  startDate,
  endDate,
  branchName,
}: PaymentReceiptProps) {
  const isTransportista = companyName === TMN_TRANSPORT_NAME;

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
