import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import {
  styles,
  LEGAL_LANDSCAPE_SIZE,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { VacationAccrualAreaPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-accrual-area.types";
import type { VacationAccrualAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-accrual-area.types";
import {
  VACATION_ACCRUAL_AREA_COLUMNS,
  calcVacationAccrualAreaTotals,
  groupVacationAccrualAreaByWorkArea,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-accrual-area.utils";
import type { VacationAccrualAreaColumnDef } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-accrual-area.utils";
import {
  vacationAccrualAreaColStyle,
  vacationAccrualAreaHeaderTextStyle,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-accrual-area.styles";

function DataRow({
  row,
  columns,
  rowKey,
}: {
  row: VacationAccrualAreaRow;
  columns: VacationAccrualAreaColumnDef[];
  rowKey: string | number;
}) {
  return (
    <View style={styles.tableRow} wrap={false} key={rowKey}>
      {columns.map((col) => {
        const cellValue = col.render(row);
        const raw =
          typeof cellValue === "string" || typeof cellValue === "number"
            ? String(cellValue)
            : "—";

        return (
          <View style={vacationAccrualAreaColStyle(col.key)} key={col.key}>
            <Text style={styles.tableCell} wrap={false}>
              {raw}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function VacationAccrualAreaPdfDocument({
  rows,
  branchName,
  startDate,
  endDate,
}: VacationAccrualAreaPdfProps) {
  const { urlImage } = useCompanyStore();
  const columns = VACATION_ACCRUAL_AREA_COLUMNS;
  const grouped = groupVacationAccrualAreaByWorkArea(rows);
  const globalTotals = calcVacationAccrualAreaTotals(rows, columns);
  const totalCollaborators = rows.length;

  return (
    <Document>
      <Page size={LEGAL_LANDSCAPE_SIZE} style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Acumulado de Vacaciones aguinaldo - {branchName}
            </Text>
            <Text style={styles.subtitle}>
              Período: {formatDateToSpanishWords(startDate?.trim() ?? "—")} al{" "}
              {formatDateToSpanishWords(endDate?.trim() ?? "—")}
            </Text>
          </View>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
        </View>

        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          {columns.map((col) => (
            <View style={vacationAccrualAreaColStyle(col.key)} key={col.key}>
              <Text style={vacationAccrualAreaHeaderTextStyle} wrap={false}>
                {col.label}
              </Text>
            </View>
          ))}
        </View>

        {[...grouped.entries()].map(([areaName, areaRows]) => {
          const totals = calcVacationAccrualAreaTotals(areaRows, columns);
          const [firstRow, ...restRows] = areaRows;

          return (
            <View key={areaName}>
              <View wrap={false}>
                <View style={styles.areaHeaderRow}>
                  <Text style={styles.areaHeaderText}>{areaName}</Text>
                </View>
                {firstRow && (
                  <DataRow
                    row={firstRow}
                    columns={columns}
                    rowKey={
                      firstRow.payrollItem.ordinary_payroll_id ??
                      firstRow.payrollItem.professional_service_payroll_id ??
                      0
                    }
                  />
                )}
              </View>

              {restRows.map((row, i) => (
                <DataRow
                  key={
                    row.payrollItem.ordinary_payroll_id ??
                    row.payrollItem.professional_service_payroll_id ??
                    i + 1
                  }
                  row={row}
                  columns={columns}
                  rowKey={
                    row.payrollItem.ordinary_payroll_id ??
                    row.payrollItem.professional_service_payroll_id ??
                    i + 1
                  }
                />
              ))}

              <View style={styles.areaTotalsRow} wrap={false}>
                {columns.map((col, colIndex) => {
                  const rawTotal =
                    colIndex === 0
                      ? `Total ${areaName} (${areaRows.length} colab.)`
                      : (totals[col.key] ?? "");
                  return (
                    <View
                      style={vacationAccrualAreaColStyle(col.key)}
                      key={col.key}
                    >
                      <Text style={styles.areaTotalsCell} wrap={false}>
                        {rawTotal}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={styles.globalTotalsRow} wrap={false}>
          {columns.map((col, colIndex) => {
            const rawTotal =
              colIndex === 0
                ? `TOTAL GENERAL (${totalCollaborators} colaboradores)`
                : (globalTotals[col.key] ?? "");
            return (
              <View style={vacationAccrualAreaColStyle(col.key)} key={col.key}>
                <Text style={styles.globalTotalsCell} wrap={false}>
                  {rawTotal}
                </Text>
              </View>
            );
          })}
        </View>

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
