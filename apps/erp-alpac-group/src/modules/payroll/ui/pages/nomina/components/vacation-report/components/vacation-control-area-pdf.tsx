import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import {
  styles,
  LEGAL_LANDSCAPE_SIZE,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { VacationControlAreaPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-control-area.types";
import type { VacationControlAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-control-area.types";
import {
  VACATION_CONTROL_AREA_COLUMNS,
  calcVacationControlAreaTotals,
  countUniqueCollaboratorsInAreaRows,
  getVacationControlAreaTotalForColumn,
  groupVacationControlAreaByWorkArea,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control-area.utils";
import type { VacationControlAreaColumnDef } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control-area.utils";
import {
  vacationControlAreaColStyle,
  vacationControlAreaHeaderTextStyle,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control-area.styles";

function DataRow({
  row,
  columns,
}: {
  row: VacationControlAreaRow;
  columns: VacationControlAreaColumnDef[];
}) {
  return (
    <View style={styles.tableRow} wrap={false}>
      {columns.map((col) => (
        <View style={vacationControlAreaColStyle(col.key)} key={col.key}>
          <Text style={styles.tableCell} wrap={false}>
            {col.render(row)}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function VacationControlAreaPdfDocument({
  rows,
  branchName,
  startDate,
  endDate,
}: VacationControlAreaPdfProps) {
  const { urlImage } = useCompanyStore();
  const columns = VACATION_CONTROL_AREA_COLUMNS;
  const grouped = groupVacationControlAreaByWorkArea(rows);
  const globalTotals = calcVacationControlAreaTotals(rows);
  const totalCollaborators = countUniqueCollaboratorsInAreaRows(rows);

  return (
    <Document>
      <Page size={LEGAL_LANDSCAPE_SIZE} style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Control de Vacaciones por Área - {branchName}
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
            <View style={vacationControlAreaColStyle(col.key)} key={col.key}>
              <Text style={vacationControlAreaHeaderTextStyle} wrap={false}>
                {col.label}
              </Text>
            </View>
          ))}
        </View>

        {[...grouped.entries()].map(([areaName, areaRows]) => {
          const totals = calcVacationControlAreaTotals(areaRows);
          const areaCollaborators = countUniqueCollaboratorsInAreaRows(areaRows);
          const [firstRow, ...restRows] = areaRows;

          return (
            <View key={areaName}>
              <View wrap={false}>
                <View style={styles.areaHeaderRow}>
                  <Text style={styles.areaHeaderText}>{areaName}</Text>
                </View>
                {firstRow ? <DataRow row={firstRow} columns={columns} /> : null}
              </View>

              {restRows.map((row) => (
                <DataRow key={row.rowId} row={row} columns={columns} />
              ))}

              <View style={styles.areaTotalsRow} wrap={false}>
                {columns.map((col, colIndex) => {
                  const rawTotal =
                    colIndex === 0
                      ? `Total ${areaName} (${areaCollaborators} colab.)`
                      : getVacationControlAreaTotalForColumn(totals, col.key);
                  return (
                    <View
                      style={vacationControlAreaColStyle(col.key)}
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
                : getVacationControlAreaTotalForColumn(globalTotals, col.key);
            return (
              <View style={vacationControlAreaColStyle(col.key)} key={col.key}>
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
