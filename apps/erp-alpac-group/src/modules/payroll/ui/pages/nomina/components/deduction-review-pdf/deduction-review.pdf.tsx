import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/deduction-review-pdf/utils/styles-deduction";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { groupByWorkArea } from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDate } from "@app/shared/utils/string.utils";
import { parseAdditionalDeductions } from "../payroll-table/utils/parse-additional-deductions";
export type DeductionSummaryPdfProps = {
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  periodCode?: string;
};

type DeductionConcept = {
  key: string;
  label: string;
  render: (item: PayrollItemResponse) => string | number;
  getValue: (item: PayrollItemResponse) => number;
  unit?: string;
};

const DEDUCTION_CONCEPTS: DeductionConcept[] = [
  {
    key: "late_arrivals",
    label: "Llegadas Tardías",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.LateArrivals ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.LateArrivals ?? 0,
    unit: "Día",
  },
  {
    key: "Purísima",
    label: "Purísima",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Purisima ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Purisima ?? 0,
  },
  {
    key: "Ausencias",
    label: "Ausencias",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Absences ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Absences ?? 0,
    unit: "Dia",
  },
  {
    key: "Préstamos",
    label: "Préstamos",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.Loans ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)?.Loans ?? 0,
  },
  {
    key: "Otras deducciones",
    label: "Otras deducciones",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.OtherDeductions ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.OtherDeductions ?? 0,
  },
  {
    key: "Deducción por uniforme",
    label: "Deducción por uniforme",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.UniformDeduction ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.UniformDeduction ?? 0,
  },
  {
    key: "Embargos judiciales",
    label: "Embargos judiciales",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.JudicialSeizures ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.JudicialSeizures ?? 0,
  },
  {
    key: "Embargos alimenticios",
    label: "Embargo alimenticio",
    render: (item) => {
      const d = parseAdditionalDeductions(item.deductions_additional_data);
      return formatCurrency(d?.ChildSupportGarnishment ?? 0, "NIO") ?? "—";
    },
    getValue: (item) =>
      parseAdditionalDeductions(item.deductions_additional_data)
        ?.ChildSupportGarnishment ?? 0,
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
  concept: DeductionConcept;
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

export function DeductionSummaryPdfDocument({
  data,
  branchName,
  startDate,
  endDate,
  periodCode = "",
}: DeductionSummaryPdfProps) {
  const { urlImage } = useCompanyStore();

  const grandTotal = DEDUCTION_CONCEPTS.reduce((sum, concept) => {
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
            <Text style={styles.title}>Resumen de Deducciones</Text>
            <Text style={styles.branchName}>{branchName}</Text>
            {periodLabel ? (
              <Text style={styles.periodText}>{periodLabel}</Text>
            ) : null}
          </View>
        </View>

        <ColumnHeaders />
        {DEDUCTION_CONCEPTS.map((concept) => {
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
