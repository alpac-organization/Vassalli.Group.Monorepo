import { Page, Text, View } from "@react-pdf/renderer";
import { receiptStyles as s } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/styles.receipt";
import { getStandardPageSize } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/utils/page-size.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { StandardPageProps } from "@app/modules/payroll/ui/pages/nomina/components/payment-receipts/types/payment.receipts.types";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { Image } from "@react-pdf/renderer";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";
export function StandardPage({
  item,
  startDate,
  endDate,
  branchName,
}: StandardPageProps) {
  const collaborator = item.collaborator;
  const { urlImage } = useCompanyStore();
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
    { label: "Bonos", value: item.bonus ?? 0 },
  ].filter((l) => l.value > 0);
  const deductions = parseAdditionalDeductions(item.deductions_additional_data);
  const deductionLines: { label: string; value: number }[] = [
    { label: "IR", value: item.ir ?? 0 },
    { label: "INSS", value: item.inss ?? 0 },
    { label: "Ausencias", value: deductions?.Absences ?? 0 },
    { label: "Préstamos", value: deductions?.Loans ?? 0 },
    { label: "Embargos judiciales", value: deductions?.JudicialSeizures ?? 0 },
    { label: "Llegadas tardes", value: deductions?.LateArrivals ?? 0 },
    { label: "Purísima", value: deductions?.Purisima ?? 0 },
    {
      label: "Deducción por uniforme",
      value: deductions?.UniformDeduction ?? 0,
    },
    { label: "Otras deducciones", value: deductions?.OtherDeductions ?? 0 },
    { label: "Adelanto de salario", value: deductions?.SalaryAdvance ?? 0 },
    {
      label: "Adelanto de aguinaldo",
      value: deductions?.ChristmasBonusAdvance ?? 0,
    },
  ].filter((l) => {
    return l.value > 0;
  });
  const monthlySalary = item.biweekly_salary * 2;
  const totalIngresos = item.total_income ?? item.gross_salary ?? 0;
  const totalEgresos = deductionLines.reduce(
    (acc, line) => acc + line.value,
    0,
  );

  const pageSize = getStandardPageSize(
    incomeLines.length,
    deductionLines.length,
    Boolean(item.DAEM),
    (item.number_overtime ?? 0) > 0,
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
          Periodo del: {formatDateToSpanishWords(startDate)}
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
          {item.DAEM ? (
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Dia Acumulados Vacaciones:</Text>
              <Text style={s.infoValue}>{item.DAEM}</Text>
            </View>
          ) : null}
        </View>

        <View style={s.infoRight}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Cargo:</Text>
            <Text style={s.infoValue}>{collaborator?.job_position ?? ""}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Sueldo Mensual:</Text>
            <Text style={s.infoValue}>
              {"  "}
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
