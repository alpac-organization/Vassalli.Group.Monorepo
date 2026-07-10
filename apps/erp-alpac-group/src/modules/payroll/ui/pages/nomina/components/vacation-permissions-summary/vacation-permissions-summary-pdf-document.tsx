import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { VacationPermissionsSummaryPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/types/vacation-permissions-summary.types";
import { formatVacationDaysValue } from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/utils/build-vacation-permissions-summary.utils";
import {
  LANDSCAPE_PAGE_SIZE,
  styles,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-permissions-summary/utils/vacation-permissions-summary.styles";

const TABLE_HEADERS = [
  { label: "Item", cellStyle: styles.headerCellItem },
  { label: "Cod Colaborador", cellStyle: styles.headerCellCode },
  { label: "Nombre", cellStyle: styles.headerCellName },
  { label: "Fecha Inicio", cellStyle: styles.headerCellDate },
  { label: "Fecha Fin", cellStyle: styles.headerCellEndDate },
  { label: "Dia", cellStyle: styles.headerCellDays },
  { label: "Tipo", cellStyle: styles.headerCellType },
] as const;

export function VacationPermissionsSummaryPdfDocument({
  header,
  rows,
  branchName,
}: VacationPermissionsSummaryPdfProps) {
  const companyName = useUserStore.getState().companyName || "Vasalli Group";
  const { urlImage } = useCompanyStore();

  return (
    <Document>
      <Page size={LANDSCAPE_PAGE_SIZE} style={styles.page}>
        <View style={styles.headerContainer}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
          <Text style={styles.companyName}>
            {branchName?.trim() || companyName}
          </Text>
        </View>

        <Text style={styles.title}>Cargue y Descargue de Vacaciones</Text>

        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Fecha:</Text>
            <Text style={styles.metaValue}>{header.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Concepto:</Text>
            <Text style={styles.metaValue}>{header.concept}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Observacion:</Text>
            <Text style={styles.metaValue}>{header.observation}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]} wrap={false}>
            {TABLE_HEADERS.map((column) => (
              <View key={column.label} style={column.cellStyle}>
                <Text style={styles.headerText}>{column.label}</Text>
              </View>
            ))}
          </View>

          {rows.length === 0 ? (
            <Text style={styles.emptyMessage}>
              Sin permisos de vacaciones aprobados para esta quincena
            </Text>
          ) : (
            rows.map((row) => (
              <View
                key={`${row.collaboratorCode}-${row.item}`}
                style={styles.tableRow}
                wrap={false}
              >
                <View style={styles.cellItem}>
                  <Text style={styles.cellTextCenter}>{row.item}</Text>
                </View>
                <View style={styles.cellCode}>
                  <Text style={styles.cellText} wrap>
                    {row.collaboratorCode}
                  </Text>
                </View>
                <View style={styles.cellName}>
                  <Text style={styles.cellText} wrap>
                    {row.employeeName}
                  </Text>
                </View>
                <View style={styles.cellDate}>
                  <Text style={styles.cellTextCenter}>{row.startDate}</Text>
                </View>
                <View style={styles.cellEndDate}>
                  <Text style={styles.cellTextCenter}>{row.endDate}</Text>
                </View>
                <View style={styles.cellDays}>
                  <Text style={styles.cellTextCenter}>
                    {formatVacationDaysValue(row.days)}
                  </Text>
                </View>
                <View style={styles.cellType}>
                  <Text style={styles.cellTextCenter}>{row.type}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </Page>
    </Document>
  );
}
