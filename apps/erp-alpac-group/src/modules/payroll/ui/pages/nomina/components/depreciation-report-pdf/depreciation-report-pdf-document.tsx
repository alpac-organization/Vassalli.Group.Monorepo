import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { styles } from "./utils/styles.depreciation-report";
import type { DepreciationReportPdfProps } from "./types/depreciation-report.types";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import {
  buildDepreciationReportPeriodLabel,
  formatDepreciationAmount,
} from "./utils/depreciation-report.utils";

export function DepreciationReportPdfDocument({
  data,
  startDate,
  endDate,
  branchName,
}: DepreciationReportPdfProps) {
  const { urlImage } = useCompanyStore();

  const periodLabel = buildDepreciationReportPeriodLabel(startDate, endDate);

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
              <Text style={styles.title}>Reporte de Depreciaciones</Text>
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
              Idemplea
            </Text>
          </View>
          <View style={styles.cellName}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Nombre
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Córdobas
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Dólares
            </Text>
          </View>
          <View style={styles.cellObservation}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Observación
            </Text>
          </View>
        </View>

        {data.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No hay datos de depreciaciones para este período.
          </Text>
        ) : (
          data.map((item) => (
            <View wrap={false} key={item.collaborator_id}>
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
                    {formatDepreciationAmount(item.amount_in_local, "NIO")}
                  </Text>
                </View>
                <View style={styles.cellAmount}>
                  <Text style={styles.cellTextRight} wrap>
                    {formatDepreciationAmount(item.amount_in_dollars, "USD")}
                  </Text>
                </View>
                <View style={styles.cellObservation}>
                  <Text style={styles.cellText} wrap>
                    {item.description || "—"}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </Page>
    </Document>
  );
}
