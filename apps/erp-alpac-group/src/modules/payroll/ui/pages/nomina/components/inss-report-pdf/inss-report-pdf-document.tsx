import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "./utils/styles.inss-report";
import type { InssReportPdfProps } from "./types/inss-report.types";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export function InssReportPdfDocument({
  data,
  startDate,
  endDate,
  branchName,
  isFortnightly,
}: InssReportPdfProps) {
  const { urlImage } = useCompanyStore();
  
  const periodLabel =
    startDate && endDate
      ? `Fecha de: ${startDate} al ${formatDateToSpanishWords(endDate.trim())}`
      : undefined;

  const totalIncome = data.reduce((acc, item) => acc + (item.income ?? 0), 0);
  const totalAbsences = data.reduce(
    (acc, item) => acc + (item.absences ?? 0),
    0,
  );
  const totalInssLab = data.reduce((acc, item) => acc + (item.inss_lab ?? 0), 0);
  const totalInssPatronal = data.reduce(
    (acc, item) => acc + (item.inss_patronal ?? 0),
    0,
  );
  const totalInatec = data.reduce((acc, item) => acc + (item.inatec ?? 0), 0);
  const totalAmount = data.reduce((acc, item) => acc + (item.total ?? 0), 0);

  const reportTitle = isFortnightly
    ? "Reporte INSS Quincenal"
    : "Reporte INSS Mensual";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
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
              Codigo
            </Text>
          </View>
          <View style={styles.cellName}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Nombre
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Ingreso
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Ausencias
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              INSS Laboral
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              INSS Patronal
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              INATEC
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Total
            </Text>
          </View>
        </View>

        {data.map((item, index) => (
          <View wrap={false} key={`inss-${item.collaborator_code}-${index}`}>
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
                  {formatCurrency(item.income)}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.absences)}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.inss_lab)}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.inss_patronal)}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.inatec)}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.total)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={[styles.tableRow, styles.totalsRow]} wrap={false}>
          <View style={styles.cellCode}>
            <Text style={styles.totalsText}>Totales</Text>
          </View>
          <View style={styles.cellName}>
            <Text style={styles.totalsText}></Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.totalsText, { textAlign: "right" }]}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.totalsText, { textAlign: "right" }]}>
              {formatCurrency(totalAbsences)}
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.totalsText, { textAlign: "right" }]}>
              {formatCurrency(totalInssLab)}
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.totalsText, { textAlign: "right" }]}>
              {formatCurrency(totalInssPatronal)}
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.totalsText, { textAlign: "right" }]}>
              {formatCurrency(totalInatec)}
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.totalsText, { textAlign: "right" }]}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
