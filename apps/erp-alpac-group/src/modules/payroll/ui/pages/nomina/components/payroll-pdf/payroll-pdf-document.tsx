import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import {
  styles,
  LEGAL_LANDSCAPE_SIZE,
  type PayrollPdfProps,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/payroll-pdf-types";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import { payrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const WIDE_COLUMN_KEYS = new Set(["full_name", "branch_name"]);
const COMPACT_COLUMN_KEYS = new Set([
  "collaborator_code",
  "identification_number",
]);

function colStyle(key: string) {
  if (COMPACT_COLUMN_KEYS.has(key)) return styles.tableColCompact;
  if (WIDE_COLUMN_KEYS.has(key)) return styles.tableColWide;
  return styles.tableCol;
}

/** Permite saltos de línea dentro de celdas angostas facilitando el wrap de react-pdf. */
function withSoftLineBreaks(value: string): string {
  // Reemplazar caracteres clave por "caracter + espacio" ayuda a que el motor Yoga (react-pdf)
  // quiebre el texto en varias líneas sin estirar o desbordar la celda.
  return value
    .replace(/C\$/g, "C$ ")
    .replace(/,/g, ", ")
    .replace(/-/g, "- ")
    .replace(/\//g, "/ ");
}

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
              {`Reporte de Nómina ${PAYROLL_TYPE_LABELS[typePayroll ?? "None"]}`} -{" "}
              {branchName}
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
                  {col.label}
                </Text>
              </View>
            ))}
          </View>
          {data.map((item, i) => (
            <View style={styles.tableRow} wrap={false} key={item.ordinary_payroll_id || i}>
              {activeColumns.map((col) => {
                const cellValue = col.render ? col.render(item) : (item as any)[col.key] || "—";
                const raw =
                  typeof cellValue === "string" || typeof cellValue === "number"
                    ? String(cellValue)
                    : "—";

                return (
                  <View style={colStyle(col.key as string)} key={col.key as string}>
                    <Text style={styles.tableCell} wrap>
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
