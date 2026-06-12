import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/utils/styles.accumulated";
import type { AccumulatedHistoryPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/types/accumulated.types";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";

export function AccumulatedPdfDocument({
  data,
  reviewedBy,
  reviewedSignatureImageSrc,
}: AccumulatedHistoryPdfProps) {
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
            marginBottom: 2,
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

        <Text style={styles.subtitle}>Historial de Acumulados</Text>

        <View style={[styles.tableRow, styles.headerRow]} wrap={false} fixed>
          <View style={styles.cellCode}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Codigo
            </Text>
          </View>
          <View style={styles.cellName}>
            <Text style={[styles.cellText, styles.headerCell]} wrap>
              Nombre
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Acum IR
            </Text>
          </View>
          <View style={styles.cellAmount}>
            <Text style={[styles.cellTextRight, styles.headerCell]} wrap>
              Acum Devengado
            </Text>
          </View>
        </View>

        {data.map((item, index) => {
          const isLast = index === data.length - 1;
          const row = (
            <View
              style={[styles.tableRow, styles.bodyRow]}
              key={`row-${item.collaborator_id}`}
            >
              <View style={styles.cellCode}>
                <Text style={styles.cellText} wrap>
                  {withSoftLineBreaks(item.collaborator_code || "—")}
                </Text>
              </View>
              <View style={styles.cellName}>
                <Text style={styles.cellText} wrap>
                  {item.collaborator_fullname || "—"}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.accumulated_ir)}
                </Text>
              </View>
              <View style={styles.cellAmount}>
                <Text style={styles.cellTextRight} wrap>
                  {formatCurrency(item.salary_earned)}
                </Text>
              </View>
            </View>
          );

          if (isLast && showSignatures) {
            return (
              <View wrap={false} key={`last-group-${item.collaborator_id}`}>
                {row}
                <View style={styles.signaturesContainer}>
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
              </View>
            );
          }

          return (
            <View wrap={false} key={`wrap-${item.collaborator_id}`}>
              {row}
            </View>
          );
        })}

        {showSignatures && data.length === 0 ? (
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
