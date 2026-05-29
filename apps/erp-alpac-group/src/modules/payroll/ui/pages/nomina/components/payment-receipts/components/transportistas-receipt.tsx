import type { TransportistasPageProps } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/types/payment.receipts.types";
import { Page, Text, View } from "@react-pdf/renderer";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { receiptStyles as s } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/styles.receipt";
import { getTransportistasPageSize } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/page-size.utils";
import { Image } from "@react-pdf/renderer";
import {
  IR_PERCENTAGE,
  INSS_PERCENTAGE,
} from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/constants/payment-receipts.constants";
import { TravelRouteRow } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/payment-receipt";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
export function TransportistasPage({
  item,
  startDate,
  endDate,
  branchName,
}: TransportistasPageProps) {
  const { urlImage } = useCompanyStore();
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
      pct: `${(((item.antique ?? 0) / (item.gross_salary || 1)) * 100).toFixed(2)}%`,
      value: item.antique ?? 0,
    },
    {
      label: "SALARIO",
      pct: `${(100).toFixed(2)}%`,
      value: item.gross_salary,
    },
  ].filter((l) => l.value > 0);

  const deductionLines: { label: string; value: number }[] = [
    {
      label: "Total de deducciones legales",
      value: item.total_legal_deductions ?? 0,
    },
    { label: "Ausencias", value: item.Absences ?? 0 },
    { label: "Préstamos", value: item.Loans ?? 0 },
    { label: "Embargos judiciales", value: item.JudicialSeizures ?? 0 },
    { label: "Llegadas tardes", value: item.LateArrivals ?? 0 },
    { label: "Purísima", value: item.Purisima ?? 0 },
    { label: "Deducción por uniforme", value: item.UniformDeduction ?? 0 },
    { label: "Otras deducciones", value: item.OtherDeductions ?? 0 },
  ].filter((l) => l.value > 0);
  const totalIngresos = item.total_income ?? item.gross_salary ?? 0;
  const totalEgresos = deductionLines.reduce(
    (acc, line) => acc + line.value,
    0,
  );
  const otrasDeductions = totalEgresos - (item.ir ?? 0) - (item.inss ?? 0);

  const pageSize = getTransportistasPageSize(
    incomeLinesPct.length,
    routes.length,
  );

  return (
    <Page size={pageSize} style={s.page}>
      <View style={s.headerContainer}>
        <View style={s.logoContainer}>
          {urlImage ? <Image src={urlImage} style={s.logo} /> : null}
        </View>
        <Text style={s.branchName}>{branchName}</Text>
        <Text style={s.title}>RECIBO DE PAGO</Text>
        <Text style={s.period}>
          Periodo del:{"  "}
          {formatDateToSpanishWords(startDate)}
          {"   "}al{"   "}
          {formatDateToSpanishWords(endDate)}
        </Text>
      </View>

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
            <Text style={s.infoLabel}>Cargo:</Text>
            <Text style={s.infoValue}>{collaborator?.job_position ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Salario Quincenal:</Text>
            <Text style={s.infoValue}>
              {formatCurrency(item.biweekly_salary)}
            </Text>
          </View>
        </View>
      </View>

      <View style={s.transportTable}>
        <View style={s.tableHeader}>
          <Text style={s.headerCell}>INGRESOS</Text>
          <Text style={s.headerCellLast}>EGRESOS</Text>
        </View>

        <View style={s.transportTableBody}>
          <View style={s.transportIncomeCol}>
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
                  <View style={s.routeColOrigin}>
                    <Text style={s.routeHeaderTextOrigin}>
                      ORIGEN | DESTINO
                    </Text>
                  </View>
                  <View style={s.routeColValue}>
                    <Text style={s.routeHeaderText}>VALOR VIAJE</Text>
                  </View>
                  <View style={s.routeColValue}>
                    <Text style={s.routeHeaderText}>VIAJE $ 11%</Text>
                  </View>
                  <View style={s.routeColValueLast}>
                    <Text style={s.routeHeaderText}>VIAJE C$</Text>
                  </View>
                </View>
                {routes.map((route, idx) => (
                  <TravelRouteRow
                    key={`route-${idx}`}
                    route={route}
                    isLast={idx === routes.length - 1}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={s.transportDeductCol}>
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
            <View style={s.lineItem}>
              <Text style={s.lineLabelPct}>OTRAS DEDUCCIONES</Text>
              <Text style={s.linePct}></Text>
              <Text style={s.lineValuePct}>
                {otrasDeductions > 0 ? formatCurrency(otrasDeductions) : "-"}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.totalsRow}>
          <View style={s.totalsIncomeCell}>
            <Text style={s.totalsLabel}>TOTAL INGRESOS</Text>
            <Text style={s.totalsValue}>{formatCurrency(totalIngresos)}</Text>
          </View>
          <View style={s.totalsDeductCell}>
            <Text style={s.totalsLabel}>TOTAL EGRESOS</Text>
            <Text style={s.totalsValue}>{formatCurrency(totalEgresos)}</Text>
          </View>
        </View>

        <View style={s.transportNetRow}>
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
