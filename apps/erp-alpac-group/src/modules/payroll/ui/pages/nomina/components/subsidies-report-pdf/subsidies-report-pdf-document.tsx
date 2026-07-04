import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "./utils/styles.subsidies-report";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { SubsidyHistoryDto } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";

export interface SubsidiesReportPdfProps {
  data: SubsidyHistoryDto[];
  startDate?: string;
  endDate?: string;
  branchName: string;
}

export function SubsidiesReportPdfDocument({
  data,
  startDate,
  endDate,
  branchName,
}: SubsidiesReportPdfProps) {
  const { urlImage } = useCompanyStore();

  const periodLabel =
    startDate && endDate
      ? `Periodo del ${formatDateToSpanishWords(startDate)} al ${formatDateToSpanishWords(endDate)}`
      : "";

  const totalCompanyAssumed = data.reduce(
    (acc, item) => acc + (item.company_assumed_amount ?? 0),
    0,
  );
  const totalInssReimbursement = data.reduce(
    (acc, item) => acc + (item.inss_reimbursement_amount ?? 0),
    0,
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerInner}>
            {urlImage ? (
              <Image src={urlImage} style={styles.logo} />
            ) : (
              <View style={styles.logo} />
            )}
            <View style={styles.headerTextBlock}>
              <Text style={styles.title}>Reporte de Subsidios</Text>
              <Text style={styles.branchName}>{branchName}</Text>
              {periodLabel ? (
                <Text style={styles.periodText}>{periodLabel}</Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={[styles.tableRow, styles.headerRow]} wrap={false} fixed>
          <View style={styles.cellCode}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Código
            </Text>
          </View>
          <View style={styles.cellName}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Empleado
            </Text>
          </View>
          <View style={styles.cellAmountDays}>
            <Text style={[styles.cellTextCenter, styles.headerCell]} wrap>
              Día
            </Text>
          </View>
          <View style={styles.cellBoleta}>
            <Text style={[styles.cellTextCenter, styles.headerCell]} wrap>
              Boleta
            </Text>
          </View>
          <View style={styles.cellTypeSubsidy}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Tipo Subsidio
            </Text>
          </View>
          <View style={styles.cellDate}>
            <Text style={[styles.cellTextCenter, styles.headerCell]} wrap>
              Fecha
            </Text>
          </View>
          <View style={styles.cellDate}>
            <Text style={[styles.cellTextCenter, styles.headerCell]} wrap>
              Fecha Fin
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Asume la Emp
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              % Reembolsa INSS
            </Text>
          </View>
        </View>

        {data.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No hay datos de subsidios para este período.
          </Text>
        ) : (
          data.map((item, index) => (
            <View
              wrap={false}
              key={`subsidy-${item.collaborator_code}-${index}`}
            >
              <View style={[styles.tableRow, styles.bodyRow]}>
                <View style={styles.cellCode}>
                  <Text style={styles.cellText} wrap>
                    {withSoftLineBreaks(item.collaborator_code || "—")}
                  </Text>
                </View>
                <View style={styles.cellName}>
                  <Text style={styles.cellText} wrap>
                    {item.collaborator_full_name || "—"}
                  </Text>
                </View>
                <View style={styles.cellAmountDays}>
                  <Text style={styles.cellTextCenter} wrap>
                    {item.amount_days}
                  </Text>
                </View>
                <View style={styles.cellBoleta}>
                  <Text style={styles.cellTextCenter} wrap>
                    {item.reference_number || "—"}
                  </Text>
                </View>
                <View style={styles.cellTypeSubsidy}>
                  <Text style={styles.cellText} wrap>
                    {item.type_subsidy_name || "—"}
                  </Text>
                </View>
                <View style={styles.cellDate}>
                  <Text style={styles.cellTextCenter} wrap>
                    {item.start_date || "—"}
                  </Text>
                </View>
                <View style={styles.cellDate}>
                  <Text style={styles.cellTextCenter} wrap>
                    {item.end_date || "—"}
                  </Text>
                </View>
                <View style={styles.cellAmount}>
                  <Text style={styles.cellTextRight} wrap>
                    {formatCurrency(item.company_assumed_amount)}
                  </Text>
                </View>
                <View style={styles.cellAmount}>
                  <Text style={styles.cellTextRight} wrap>
                    {formatCurrency(item.inss_reimbursement_amount)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

        {data.length > 0 && (
          <View style={[styles.tableRow, styles.totalsRow]} wrap={false}>
            <View style={styles.cellCode}>
              <Text style={styles.totalsText}>Total</Text>
            </View>
            <View style={styles.cellName}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellAmountDays}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellBoleta}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellTypeSubsidy}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellDate}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellDate}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellAmount}>
              <Text style={[styles.totalsText, styles.cellTextRight]}>
                {formatCurrency(totalCompanyAssumed)}
              </Text>
            </View>
            <View style={styles.cellAmount}>
              <Text style={[styles.totalsText, styles.cellTextRight]}>
                {formatCurrency(totalInssReimbursement)}
              </Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
