import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { type PayrollPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/types/payroll-pdf-types";
import {
  styles,
  LEGAL_LANDSCAPE_SIZE,
  colStyle,
  withSoftLineBreaks,
  groupByWorkArea,
  calcAreaTotals,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { PAYROLL_TYPE_LABELS } from "@app/modules/payroll/domain/enums/payroll-enums/payroll-enum";
import { getPayrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PayrollColumnDef } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";

const NON_SOFT_WRAP_KEYS = new Set([
  "full_name",
  "inss_number",
  "work_area",
  "job_position",
]);

function DataRow({
  item,
  activeColumns,
  rowKey,
}: {
  item: PayrollItemResponse;
  activeColumns: PayrollColumnDef[];
  rowKey: string | number;
}) {
  return (
    <View style={styles.tableRow} wrap={false} key={rowKey}>
      {activeColumns.map((col) => {
        const cellValue = col.render(item);
        const raw =
          typeof cellValue === "string" || typeof cellValue === "number"
            ? String(cellValue)
            : "—";
        const displayValue = NON_SOFT_WRAP_KEYS.has(col.key)
          ? raw
          : withSoftLineBreaks(raw);

        return (
          <View style={colStyle(col.key)} key={col.key}>
            <Text
              style={
                col.key === "inss_number"
                  ? styles.tableCellInss
                  : styles.tableCell
              }
              wrap
            >
              {displayValue}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function PayrollPdfDocument({
  data,
  branchName,
  companyName,
  startDate,
  endDate,
  visibleKeys,
  typePayroll,
  preparedBy,
  reviewedBy,
}: PayrollPdfProps) {
  const { urlImage } = useCompanyStore();

  const activeColumns = getPayrollColumns(companyName).filter((col) =>
    visibleKeys.includes(col.key as string),
  );

  const grouped = groupByWorkArea(data);
  const showSignatures = !!(preparedBy || reviewedBy);

  const globalTotals = calcAreaTotals(data, activeColumns);
  const totalCollaborators = data.length;

  return (
    <Document>
      <Page size={LEGAL_LANDSCAPE_SIZE} style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              {`Reporte de Nómina ${PAYROLL_TYPE_LABELS[typePayroll ?? "None"]}`}
              {" - "}
              {branchName}
            </Text>
            <Text style={styles.subtitle}>
              Período: {formatDateToSpanishWords(startDate?.trim() ?? "—")} al{" "}
              {formatDateToSpanishWords(endDate?.trim() ?? "—")}
            </Text>
          </View>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
        </View>

        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          {activeColumns.map((col) => (
            <View style={colStyle(col.key)} key={col.key}>
              <Text style={styles.tableCellHeader} wrap>
                {withSoftLineBreaks(col.label)}
              </Text>
            </View>
          ))}
        </View>

        {[...grouped.entries()].map(([areaName, areaItems]) => {
          const totals = calcAreaTotals(areaItems, activeColumns);
          const [firstItem, ...restItems] = areaItems;

          return (
            <View key={areaName}>
              <View wrap={false}>
                <View style={styles.areaHeaderRow}>
                  <Text style={styles.areaHeaderText}>{areaName}</Text>
                </View>
                {firstItem && (
                  <DataRow
                    item={firstItem}
                    activeColumns={activeColumns}
                    rowKey={firstItem.ordinary_payroll_id || 0}
                  />
                )}
              </View>

              {restItems.map((item, i) => (
                <DataRow
                  key={item.ordinary_payroll_id || i + 1}
                  item={item}
                  activeColumns={activeColumns}
                  rowKey={item.ordinary_payroll_id || i + 1}
                />
              ))}

              <View style={styles.areaTotalsRow} wrap={false}>
                {activeColumns.map((col, colIndex) => {
                  const rawTotal =
                    colIndex === 0
                      ? `Total ${areaName} (${areaItems.length} colab.)`
                      : (totals[col.key] ?? "");
                  const displayTotal = withSoftLineBreaks(rawTotal);
                  return (
                    <View style={colStyle(col.key)} key={col.key}>
                      <Text style={styles.areaTotalsCell} wrap>
                        {displayTotal}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={styles.globalTotalsRow} wrap={false}>
          {activeColumns.map((col, colIndex) => {
            const rawTotal =
              colIndex === 0
                ? `TOTAL GENERAL (${totalCollaborators} colaboradores)`
                : (globalTotals[col.key] ?? "");
            const displayTotal = withSoftLineBreaks(rawTotal);
            return (
              <View style={colStyle(col.key)} key={col.key}>
                <Text style={styles.globalTotalsCell} wrap>
                  {displayTotal}
                </Text>
              </View>
            );
          })}
        </View>

        {showSignatures && (
          <View style={styles.signaturesContainer} wrap={false}>
            {preparedBy && (
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>
                  Elaborado por: {preparedBy.name}
                </Text>
                {/* <Text style={styles.signatureRole}>
                  Responsable de: {preparedBy.role}
                </Text> */}
              </View>
            )}
            {reviewedBy && (
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>
                  Revisado por: {reviewedBy.name}
                </Text>
                <Text style={styles.signatureRole}>{reviewedBy.role}</Text>
              </View>
            )}
          </View>
        )}

        <Text
          style={{
            position: "absolute",
            bottom: 10,
            left: 20,
            right: 20,
            textAlign: "right",
            fontSize: 8,
            color: "#555",
          }}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Página ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
