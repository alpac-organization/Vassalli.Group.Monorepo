import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "./utils/styles.bac-report";
import type { BacReportPdfProps } from "./types/bac-report.types";
import { buildBacReportPeriodLabel } from "./utils/bac-report.utils";

export function BacReportPdfDocument({
  data,
  startDate,
  endDate,
  branchName,
}: BacReportPdfProps) {
  const { urlImage } = useCompanyStore();

  const periodLabel = buildBacReportPeriodLabel(startDate, endDate);
  const totalSalary = data.reduce(
    (acc, item) => acc + (item.biweekly_salary ?? 0),
    0,
  );

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerInner}>
            {urlImage ? (
              <Image src={urlImage} style={styles.logo} />
            ) : (
              <View style={styles.logo} />
            )}
            <View style={styles.headerTextBlock}>
              <Text style={styles.title}>Reporte BAC</Text>
              <Text style={styles.branchName}>{branchName}</Text>
              {periodLabel ? (
                <Text style={styles.periodText}>{periodLabel}</Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={[styles.tableRow, styles.headerRow]} wrap={false} fixed>
          <View style={styles.cellReference}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Referencia
            </Text>
          </View>
          <View style={styles.cellName}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Nombre del Empleado
            </Text>
          </View>
          <View style={styles.cellSalary}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Salario
            </Text>
          </View>
        </View>

        {data.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No hay colaboradores con cuenta bancaria registrada para este
            período.
          </Text>
        ) : (
          data.map((item, index) => (
            <View
              wrap={false}
              key={`bac-${item.identification_number}-${index}`}
            >
              <View style={[styles.tableRow, styles.bodyRow]}>
                <View style={styles.cellReference}>
                  <Text style={styles.cellTextReference} wrap={false}>
                    {item.identification_number || "—"}
                  </Text>
                </View>
                <View style={styles.cellName}>
                  <Text style={styles.cellText} wrap>
                    {item.full_name || "—"}
                  </Text>
                </View>
                <View style={styles.cellSalary}>
                  <Text style={styles.cellTextRight} wrap>
                    {formatCurrency(item.biweekly_salary)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

        {data.length > 0 && (
          <View style={[styles.tableRow, styles.totalsRow]} wrap={false}>
            <View style={styles.cellReference}>
              <Text style={styles.totalsText}>Totales</Text>
            </View>
            <View style={styles.cellName}>
              <Text style={styles.totalsText} />
            </View>
            <View style={styles.cellSalary}>
              <Text style={[styles.totalsText, styles.cellTextRight]}>
                {formatCurrency(totalSalary)}
              </Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
