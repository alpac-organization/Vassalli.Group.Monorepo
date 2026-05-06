import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-history-pdf/utils/styles.accumulated";
import type { AccumulatedHistoryPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-history-pdf/types/accumulated-history.types";

export function AccumulatedHistoryPdfDocument({
  data,
}: AccumulatedHistoryPdfProps) {
  const companyName = useUserStore.getState().companyName || "Alpac Group";
  const { urlImage } = useCompanyStore();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            position: "relative" as const,
            width: "100%",
            minHeight: 52,
            justifyContent: "center" as const,
            marginBottom: 8,
          }}
        >
          {urlImage ? (
            <Image
              src={urlImage}
              style={{
                position: "absolute" as const,
                left: 0,
                top: 0,
                width: 52,
                height: 52,
                objectFit: "contain" as const,
              }}
            />
          ) : null}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold" as const,
              textAlign: "center" as const,
              width: "100%",
            }}
          >
            {companyName}
          </Text>
        </View>

        <Text style={styles.subtitle}>Acumulados</Text>
        <Text style={styles.period}>
          {formatDateToSpanishWords(data[0]?.start_date)} al{" "}
          {formatDateToSpanishWords(data[0]?.end_date)}
        </Text>

        <View style={[styles.tableRow, styles.headerRow]} wrap={false}>
          <Text style={[styles.cellCode, styles.headerCell]}>Codigo</Text>
          <Text style={[styles.cellName, styles.headerCell]}>Nombre</Text>
          <Text style={[styles.cellAmount, styles.headerCell]}>Acum IR</Text>
          <Text style={[styles.cellAmount, styles.headerCell]}>
            Acum Devengado
          </Text>
        </View>

        {data.map((item) => (
          <View
            style={[styles.tableRow, styles.bodyRow]}
            key={`${item.collaborator_id}`}
          >
            <Text style={styles.cellCode}>{item.collaborator_code || "—"}</Text>
            <Text style={styles.cellName}>
              {item.collaborator_fullname || "—"}
            </Text>
            <Text style={styles.cellAmount}>
              {formatCurrency(item.accumulated_ir)}
            </Text>
            <Text style={styles.cellAmount}>
              {formatCurrency(item.salary_earned)}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
