import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/utils/styles.accumulated";
import type { VacationAccrualPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-accrual.types";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";

export function VacationAccrualPdfDocument({
  data,
  reviewedBy,
  reviewedSignatureImageSrc,
  startDate,
  endDate,
}: VacationAccrualPdfProps) {
  const companyName = useUserStore.getState().companyName || "Alpac Group";
  const { urlImage } = useCompanyStore();
  const signatures = getSignatures(companyName);
  const reviewedName = reviewedBy?.name ?? signatures.revisado.name;
  const reviewedRole = reviewedBy?.role ?? signatures.revisado.role;
  const showSignatures = !!(reviewedBy || signatures.revisado);

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

        <Text style={styles.subtitle}>Acumulado de vacaciones</Text>
        <Text style={styles.period}>
          {formatDateToSpanishWords(startDate)} al{" "}
          {formatDateToSpanishWords(endDate)}
        </Text>

        <View style={[styles.tableRow, styles.headerRow]} wrap={false}>
          <Text style={[styles.cellCode, styles.headerCell]}>Codigo</Text>
          <Text style={[styles.cellName, styles.headerCell]}>Nombre</Text>
          <Text style={[styles.cellAmount, styles.headerCell]}>
            Saldo de vacaciones
          </Text>
          <Text style={[styles.cellAmount, styles.headerCell]}>
            Cantidad equivalente
          </Text>
          <Text style={[styles.cellAmount, styles.headerCell]}>
            Cantidad equivalente en dolares
          </Text>
        </View>

        {data.map((item) => (
          <View
            style={[styles.tableRow, styles.bodyRow]}
            key={`${item.collaborator_code}`}
          >
            <Text style={styles.cellCode}>{item.collaborator_code || "—"}</Text>
            <Text style={styles.cellName}>
              {item.collaborator_fullname || "—"}
            </Text>
            <Text style={styles.cellAmount}>
              {formatCurrency(item.vacation_balance)}
            </Text>
            <Text style={styles.cellAmount}>
              {formatCurrency(item.equivales_quantity)}
            </Text>
            <Text style={styles.cellAmount}>
              {formatCurrency(item.equivales_quantity_in_dollars)}
            </Text>
          </View>
        ))}

        {showSignatures ? (
          <View style={styles.signaturesContainer} wrap={false}>
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
        ) : null}
      </Page>
    </Document>
  );
}
