import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/income-review-pdf/utils/income-review.styles";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { groupByWorkArea } from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDate } from "@app/shared/utils/string.utils";
export type IncomeSummaryPdfProps = {
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  periodCode?: string;
};

type IncomeConcept = {
  key: string;
  label: string;
  render: (item: PayrollItemResponse) => string | number;
  getValue: (item: PayrollItemResponse) => number;
  unit?: string;
};

const INCOME_CONCEPTS: IncomeConcept[] = [
  {
    key: "transport",
    label: "TRANSPORTE",
    render: (item) => formatCurrency(item.transport ?? 0, "NIO") ?? "—",
    getValue: (item) => item.transport ?? 0,
    unit: "Día",
  },
  {
    key: "feeding",
    label: "ALIMENTACION",
    render: (item) => formatCurrency(item.feeding ?? 0, "NIO") ?? "—",
    getValue: (item) => item.feeding ?? 0,
    unit: "Día",
  },
  {
    key: "overtime",
    label: "HORAS EXTRAS",
    render: (item) => formatCurrency(item.overtime ?? 0, "NIO") ?? "—",
    getValue: (item) => item.overtime ?? 0,
    unit: "Hora",
  },
  {
    key: "vacations",
    label: "VACACIONES",
    render: (item) => formatCurrency(item.vacations ?? 0, "NIO") ?? "—",
    getValue: (item) => item.vacations ?? 0,
    unit: "Día",
  },
  {
    key: "bonus",
    label: "BONOS",
    render: (item) => formatCurrency(item.bonus ?? 0, "NIO") ?? "—",
    getValue: (item) => item.bonus ?? 0,
    // unit: "—",
  },
  {
    key: "commissions",
    label: "COMISIONES",
    render: (item) => formatCurrency(item.commissions ?? 0, "NIO") ?? "—",
    getValue: (item) => item.commissions ?? 0,
    // unit: "—",
  },
  {
    key: "antique",
    label: "ANTIGÜEDAD",
    render: (item) => formatCurrency(item.antique ?? 0, "NIO") ?? "—",
    getValue: (item) => item.antique ?? 0,
    // unit: "—",
  },
];

function ColumnHeaders() {
  return (
    <View style={styles.tableHeaderRow} fixed>
      <View style={styles.colCodEmp}>
        <Text style={styles.cellHeader} wrap>
          Cod Emp
        </Text>
      </View>
      <View style={styles.colNombre}>
        <Text style={styles.cellHeader} wrap>
          Nombre
        </Text>
      </View>
      {/* Valor column — reserved, currently hidden */}
      {/* <View style={styles.colValor}>
        <Text style={styles.cellHeaderRight}>Valor</Text>
      </View> */}
      {/* Unidad column — reserved, currently hidden */}
      {/* <View style={styles.colUnidad}>
        <Text style={styles.cellHeader}>Unidad</Text>
      </View> */}
      <View style={styles.colTotal}>
        <Text style={styles.cellHeaderRight} wrap>
          Total
        </Text>
      </View>
      <View style={styles.colPeriodo}>
        <Text style={styles.cellHeader} wrap>
          Periodo
        </Text>
      </View>
      <View style={styles.colArea}>
        <Text style={styles.cellHeader} wrap>
          Area
        </Text>
      </View>
    </View>
  );
}

function DataRow({
  item,
  periodCode,
  getValue,
}: {
  item: PayrollItemResponse;
  periodCode: string;
  getValue: (item: PayrollItemResponse) => number;
}) {
  const total = getValue(item);
  return (
    <View style={styles.tableRow} wrap={false}>
      <View style={styles.colCodEmp}>
        <Text style={styles.cell} wrap>
          {withSoftLineBreaks(item.collaborator?.collaborator_code ?? "—")}
        </Text>
      </View>
      <View style={styles.colNombre}>
        <Text style={styles.cell} wrap>
          {item.collaborator?.full_name ?? "—"}
        </Text>
      </View>
      {/* Valor column — reserved, currently hidden */}
      {/* <View style={styles.colValor}>
        <Text style={styles.cellRight}>—</Text>
      </View> */}
      {/* Unidad column — reserved, currently hidden */}
      {/* <View style={styles.colUnidad}>
        <Text style={styles.cell}>{concept.unit}</Text>
      </View> */}
      <View style={styles.colTotal}>
        <Text style={styles.cellRight} wrap>
          {formatCurrency(total, "NIO") ?? "—"}
        </Text>
      </View>
      <View style={styles.colPeriodo}>
        <Text style={styles.cellCenter} wrap>
          {periodCode}
        </Text>
      </View>
      <View style={styles.colArea}>
        <Text style={styles.cell} wrap>
          {item.collaborator?.work_area ?? "—"}
        </Text>
      </View>
    </View>
  );
}

function ConceptSection({
  concept,
  items,
  periodCode,
}: {
  concept: IncomeConcept;
  items: PayrollItemResponse[];
  periodCode: string;
}) {
  const grouped = groupByWorkArea(items);
  const conceptTotal = items.reduce(
    (sum, item) => sum + concept.getValue(item),
    0,
  );

  return (
    <View>
      <View style={styles.conceptHeaderRow} wrap={false}>
        <Text style={styles.conceptHeaderText}>Concepto: {concept.label}</Text>
      </View>

      {[...grouped.entries()].map(([areaName, areaItems]) => {
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
                  periodCode={periodCode}
                  getValue={concept.getValue}
                />
              )}
            </View>
            {restItems.map((item, i) => (
              <DataRow
                key={item.ordinary_payroll_id || i}
                item={item}
                periodCode={periodCode}
                getValue={concept.getValue}
              />
            ))}
          </View>
        );
      })}

      <View style={styles.conceptTotalRow} wrap={false}>
        <View style={styles.colCodEmp}>
          <Text style={styles.conceptTotalCell}> </Text>
        </View>
        <View style={styles.colNombre}>
          <Text style={styles.conceptTotalCell} wrap>
            Total {concept.label} ({items.length} colaboradores)
          </Text>
        </View>
        {/* <View style={styles.colValor}>
          <Text style={styles.conceptTotalCellRight}> </Text>
        </View> */}
        {/* <View style={styles.colUnidad}>
          <Text style={styles.conceptTotalCell}> </Text>
        </View> */}
        <View style={styles.colTotal}>
          <Text style={styles.conceptTotalCellRight} wrap>
            {formatCurrency(conceptTotal, "NIO") ?? "—"}
          </Text>
        </View>
        <View style={styles.colPeriodo}>
          <Text style={styles.conceptTotalCell}> </Text>
        </View>
        <View style={styles.colArea}>
          <Text style={styles.conceptTotalCell}> </Text>
        </View>
      </View>
    </View>
  );
}

export function IncomeSummaryPdfDocument({
  data,
  branchName,
  startDate,
  endDate,
  periodCode = "",
}: IncomeSummaryPdfProps) {
  const { urlImage } = useCompanyStore();

  const grandTotal = INCOME_CONCEPTS.reduce((sum, concept) => {
    return sum + data.reduce((s, item) => s + concept.getValue(item), 0);
  }, 0);

  const periodLabel =
    startDate && endDate
      ? `Período: ${formatDateToSpanishWords(startDate.trim())} al ${formatDateToSpanishWords(endDate.trim())}`
      : undefined;

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
            <Text style={styles.title}>Resumen de Ingresos</Text>
            <Text style={styles.branchName}>{branchName}</Text>
            {periodLabel ? (
              <Text style={styles.periodText}>{periodLabel}</Text>
            ) : null}
          </View>
        </View>

        <ColumnHeaders />
        {INCOME_CONCEPTS.map((concept) => {
          const conceptItems = data.filter(
            (item) => concept.getValue(item) > 0,
          );
          if (conceptItems.length === 0) return null;

          return (
            <ConceptSection
              key={concept.key}
              concept={concept}
              items={conceptItems}
              periodCode={formatDate(periodCode)}
            />
          );
        })}

        <View style={styles.globalTotalRow} wrap={false}>
          <View style={styles.colCodEmp}>
            <Text style={styles.globalTotalCell}> </Text>
          </View>
          <View style={styles.colNombre}>
            <Text style={styles.globalTotalCell} wrap>
              TOTAL GENERAL
            </Text>
          </View>
          {/* <View style={styles.colValor}>
            <Text style={styles.globalTotalCellRight}> </Text>
          </View> */}
          {/* <View style={styles.colUnidad}>
            <Text style={styles.globalTotalCell}> </Text>
          </View> */}
          <View style={styles.colTotal}>
            <Text style={styles.globalTotalCellRight} wrap>
              {formatCurrency(grandTotal, "NIO") ?? "—"}
            </Text>
          </View>
          <View style={styles.colPeriodo}>
            <Text style={styles.globalTotalCell}> </Text>
          </View>
          <View style={styles.colArea}>
            <Text style={styles.globalTotalCell}> </Text>
          </View>
        </View>

        <Text
          style={{
            position: "absolute",
            bottom: 10,
            left: 24,
            right: 24,
            textAlign: "right",
            fontSize: 7,
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
