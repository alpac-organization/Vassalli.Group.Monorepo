import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { type PayrollPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/types/payroll-pdf-types";
import {
  styles,
  LEGAL_LANDSCAPE_SIZE,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import { payrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  colStyle,
  withSoftLineBreaks,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";

export function PayrollPdfDocument({
  data,
  branchName,
  startDate,
  endDate,
  visibleKeys,
  logoSrc,
  typePayroll,
}: PayrollPdfProps) {
  const activeColumns = payrollColumns.filter((col) =>
    visibleKeys.includes(col.key as string),
  );

  return (
    <Document>
      <Page size={LEGAL_LANDSCAPE_SIZE} style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              {`Reporte de Nómina ${PAYROLL_TYPE_LABELS[typePayroll ?? "None"]}`}{" "}
              - {branchName}
            </Text>
            <Text style={styles.subtitle}>
              Período: {formatDateToSpanishWords(startDate?.trim() ?? "—")} al{" "}
              {formatDateToSpanishWords(endDate?.trim() ?? "—")}
            </Text>
            <Text style={styles.subtitle}>
              Total de registros: {data.length}
            </Text>
          </View>
          {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {activeColumns.map((col) => (
              <View style={colStyle(col.key as string)} key={col.key as string}>
                <Text style={styles.tableCellHeader} wrap>
                  {withSoftLineBreaks(col.label)}
                </Text>
              </View>
            ))}
          </View>
          {data.map((item, i) => (
            <View
              style={styles.tableRow}
              wrap={false}
              key={item.ordinary_payroll_id || i}
            >
              {activeColumns.map((col) => {
                const cellValue = col.render
                  ? col.render(item)
                  : (item as any)[col.key] || "—";
                const raw =
                  typeof cellValue === "string" || typeof cellValue === "number"
                    ? String(cellValue)
                    : "—";

                return (
                  <View
                    style={colStyle(col.key as string)}
                    key={col.key as string}
                  >
                    <Text
                      style={
                        col.key === "inss_number"
                          ? styles.tableCellInss
                          : styles.tableCell
                      }
                      wrap
                    >
                      {withSoftLineBreaks(raw)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
