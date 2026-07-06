import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "./utils/styles.ir-report";
import type { IrReportPdfProps } from "./types/ir-report.types";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export function IrReportPdfDocument({
  data,
  startDate,
  endDate,
  branchName,
  isFortnightly,
}: IrReportPdfProps) {
  const { urlImage } = useCompanyStore();
  
  const periodLabel =
    startDate && endDate
      ? `Fecha de: ${startDate} al ${formatDateToSpanishWords(endDate.trim())}`
      : undefined;

  const totalIr = data.reduce(
    (acc, item) => acc + (isFortnightly ? (item.ir_fortnightly ?? 0) : (item.ir_monthly ?? 0)),
    0,
  );
  
  const totalSalary = data.reduce(
    (acc, item) => acc + (isFortnightly ? (item.salary_earned_fortnightly ?? 0) : (item.salary_earned_monthly ?? 0)),
    0,
  );

  const reportTitle = isFortnightly
    ? "Reporte IR Quincenal"
    : "Reporte IR Mensual";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer} fixed>
          {urlImage ? (
            <Image src={urlImage} style={styles.logo} />
          ) : (
            <View style={styles.logo} />
          )}
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>{reportTitle}</Text>
            <Text style={styles.branchName}>{branchName}</Text>
            {periodLabel ? (
              <Text style={styles.periodText}>{periodLabel}</Text>
            ) : null}
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
              Nombre
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Salario Devengado
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Retención IR
            </Text>
          </View>
        </View>

        {data.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No hay datos de IR para este período.
          </Text>
        ) : (
          data.map((item, index) => {
            const salary = isFortnightly ? (item.salary_earned_fortnightly ?? 0) : (item.salary_earned_monthly ?? 0);
            const ir = isFortnightly ? (item.ir_fortnightly ?? 0) : (item.ir_monthly ?? 0);

            return (
              <View wrap={false} key={`ir-${item.collaborator_code}-${index}`}>
                <View style={[styles.tableRow, styles.bodyRow]}>
                  <View style={styles.cellCode}>
                    <Text style={styles.cellText} wrap>
                      {withSoftLineBreaks(item.collaborator_code || "—")}
                    </Text>
                  </View>
                  <View style={styles.cellName}>
                    <Text style={styles.cellText} wrap>
                      {item.collaborator_fullname || "—"}
                    </Text>
                  </View>
                  <View style={styles.cellAmount}>
                    <Text style={styles.cellTextRight} wrap>
                      {formatCurrency(salary)}
                    </Text>
                  </View>
                  <View style={styles.cellAmount}>
                    <Text style={styles.cellTextRight} wrap>
                      {formatCurrency(ir)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {data.length > 0 && (
          <View style={[styles.tableRow, styles.totalsRow]} wrap={false}>
            <View style={styles.totalsLabelCell}>
              <Text style={styles.totalsLabelText}>TOTAL GENERAL</Text>
            </View>
            <View style={styles.totalsAmountCell}>
              <Text style={styles.totalsAmountText}>
                {formatCurrency(totalSalary)}
              </Text>
            </View>
            <View style={styles.totalsAmountCell}>
              <Text style={styles.totalsAmountText}>
                {formatCurrency(totalIr)}
              </Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
