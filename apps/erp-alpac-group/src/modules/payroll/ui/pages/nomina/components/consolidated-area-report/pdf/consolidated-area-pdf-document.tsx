import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import {
  CONSOLIDATED_AREA_COLUMNS,
  formatConsolidatedCellValue,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/constants/consolidated-area-columns";
import type { ConsolidatedAreaPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";
import type { ConsolidatedAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";
import { buildConsolidatedAreaRows } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/utils/build-consolidated-area-rows";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";
import {
  getPdfColumnStyle,
  getPdfHeaderLabel,
  LEGAL_LANDSCAPE_SIZE,
  styles,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/pdf/consolidated-area-pdf.styles";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

function DataRow({ row, isTotal = false }: { row: ConsolidatedAreaRow; isTotal?: boolean }) {
  return (
    <View style={isTotal ? styles.globalTotalsRow : styles.tableRow} wrap={false}>
      {CONSOLIDATED_AREA_COLUMNS.map((column) => {
        const value =
          column.key === "areaName"
            ? row.areaName
            : formatConsolidatedCellValue(row, column);
        const isArea = column.key === "areaName";
        return (
          <View style={getPdfColumnStyle(column.key)} key={column.key}>
            <Text
              style={
                isTotal
                  ? isArea
                    ? styles.globalTotalsCellArea
                    : styles.globalTotalsCell
                  : isArea
                    ? styles.tableCellArea
                    : styles.tableCell
              }
            >
              {String(value)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function ConsolidatedAreaPdfDocument({
  data,
  branchName,
  companyName,
  startDate,
  endDate,
  preparedBy,
  reviewedBy,
  preparedSignatureImageSrc,
  reviewedSignatureImageSrc,
}: ConsolidatedAreaPdfProps) {
  const { urlImage } = useCompanyStore();
  const signatures = getSignatures(companyName ?? "");
  const { rows, grandTotal } = buildConsolidatedAreaRows(data);

  const preparedName = preparedBy?.name ?? signatures.solicitado.name;
  const reviewedName = reviewedBy?.name ?? signatures.revisado.name;
  const reviewedRole = reviewedBy?.role ?? signatures.revisado.role;

  return (
    <Document>
      <Page size={LEGAL_LANDSCAPE_SIZE} style={styles.page}>
        <View style={styles.headerContainer} fixed>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Nomina Consolidada por Area - {branchName}
            </Text>
            <Text style={styles.subtitle}>
              Desde {formatDateToSpanishWords(startDate?.trim() ?? "—")} Hasta{" "}
              {formatDateToSpanishWords(endDate?.trim() ?? "—")}
            </Text>
          </View>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
        </View>

        <View style={[styles.tableRow, styles.tableHeader]} fixed>
          {CONSOLIDATED_AREA_COLUMNS.map((column) => (
            <View style={getPdfColumnStyle(column.key)} key={column.key}>
              <Text style={styles.tableCellHeader}>
                {getPdfHeaderLabel(column.label, column.subLabel)}
              </Text>
            </View>
          ))}
        </View>

        {rows.map((row) => (
          <DataRow key={row.areaName} row={row} />
        ))}

        <DataRow row={grandTotal} isTotal />

        <View style={styles.signaturesContainer} wrap={false}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureStampArea}>
              {preparedSignatureImageSrc ? (
                <Image
                  src={preparedSignatureImageSrc}
                  style={styles.signatureImage}
                />
              ) : null}
            </View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              Elaborado por: {preparedName}
            </Text>
            {signatures.solicitado.role ? (
              <Text style={styles.signatureRole}>
                {signatures.solicitado.role}
              </Text>
            ) : null}
          </View>

          <View style={styles.signatureBlock}>
            <View style={styles.signatureStampArea}>
              {reviewedSignatureImageSrc ? (
                <Image
                  src={reviewedSignatureImageSrc}
                  style={styles.signatureImage}
                />
              ) : null}
            </View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              Revisado por: {reviewedName}
            </Text>
            {reviewedRole ? (
              <Text style={styles.signatureRole}>{reviewedRole}</Text>
            ) : null}
          </View>
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
            `Pagina ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
