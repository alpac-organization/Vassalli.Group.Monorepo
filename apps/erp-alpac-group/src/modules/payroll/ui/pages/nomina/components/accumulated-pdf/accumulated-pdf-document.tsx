import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { styles } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/utils/styles.accumulated";
import type { AccumulatedHistoryPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/accumulated-pdf/types/accumulated.types";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";
import { withSoftLineBreaks } from "@app/modules/payroll/ui/pages/nomina/components/payroll-pdf/utils/payroll-utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
export function AccumulatedPdfDocument({
  data,
  reviewedBy,
  reviewedSignatureImageSrc,
  startDate,
  endDate,
  branchName,
}: AccumulatedHistoryPdfProps) {
  const { urlImage } = useCompanyStore();
  const companyName = useUserStore.getState().companyName || "Alpac Group";
  const signatures = getSignatures(companyName);
  const reviewedName = reviewedBy?.name ?? signatures.revisado.name;
  const reviewedRole = reviewedBy?.role ?? signatures.revisado.role;
  const showSignatures = !!(reviewedBy || signatures.revisado);
  const periodLabel =
    startDate && endDate
      ? `Fecha de: ${startDate} al ${formatDateToSpanishWords(endDate.trim())}`
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
            <Text style={styles.title}>Historial de Acumulados</Text>
            <Text style={styles.branchName}>{branchName}</Text>
            {periodLabel ? (
              <Text style={styles.periodText}>{periodLabel}</Text>
            ) : null}
          </View>
        </View>

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
