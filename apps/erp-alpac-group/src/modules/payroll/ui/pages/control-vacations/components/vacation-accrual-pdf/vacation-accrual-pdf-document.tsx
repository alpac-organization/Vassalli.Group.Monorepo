import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDate } from "@app/shared/utils/string.utils";
import type { VacationAccrualPdfProps } from "./types/vacation-accrual.types";
import { styles } from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-accrual-pdf/utils/vacation-accrual.styles";
import {
  asNumber,
  getAccumulated,
  groupByArea,
  formatTotal,
} from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-accrual-pdf/utils/fn.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { getSignatures } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/getSignatures";

export function VacationAccrualPdfDocument({
  data,
  generatedAt,
  preparedBy,
  preparedSignatureImageSrc,
}: VacationAccrualPdfProps) {
  const companyName = useUserStore.getState().companyName || "Alpac Group";
  const { urlImage } = useCompanyStore();
  const signatures = getSignatures(companyName);
  const preparedName = preparedBy?.name ?? signatures.solicitado.name;
  const preparedRole = preparedBy?.role ?? "Talento Humano";
  const showSignatures = !!(preparedBy || signatures.solicitado);
  const grouped = groupByArea(data);
  const globalTotal = data.reduce(
    (sum, item) => sum + asNumber(item.vacation_balance),
    0,
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View fixed style={styles.headerFixed}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
          <Text style={styles.title}>Listado de Acumulado Vacaciones</Text>
          <Text style={styles.generatedAt}>{generatedAt}</Text>
          <Text style={styles.company}>{companyName}</Text>

          <View style={styles.tableHeader}>
            <Text style={[styles.colCode, styles.bold]}>Codigo</Text>
            <Text style={[styles.colName, styles.bold]}>Nombre Completo</Text>
            <Text style={[styles.colEntryDate, styles.bold]}>
              Fecha de Ingreso
            </Text>
            <Text style={[styles.colAccumulated, styles.bold]}>Acumulado</Text>
            <Text style={[styles.colEnjoyed, styles.bold]}>Descansado</Text>
            <Text style={[styles.colBalance, styles.bold]}>Saldo Final</Text>
          </View>
        </View>

        <View style={styles.contentWrap}>
          {[...grouped.entries()].map(([areaName, items]) => {
            const areaTotal = items.reduce(
              (sum, item) => sum + asNumber(item.vacation_balance),
              0,
            );

            return (
              <View key={areaName}>
                <Text style={styles.areaTitle} wrap>
                  {areaName}
                </Text>

                {items.map((item) => (
                  <View key={item.vacation_id} style={styles.row} wrap={false}>
                    <Text style={styles.colCode} wrap>
                      {item.collaborator_information?.code ?? "—"}
                    </Text>
                    <Text style={styles.colName} wrap>
                      {item.collaborator_information?.collaborator_fullname ??
                        "—"}
                    </Text>
                    <Text style={styles.colEntryDate}>
                      {formatDate(
                        item.collaborator_information?.entry_date ?? "",
                      )}
                    </Text>
                    <Text style={styles.colAccumulated}>
                      {getAccumulated(item)} dias
                    </Text>
                    <Text style={styles.colEnjoyed}>
                      {item.enjoyed_vacations} dias
                    </Text>
                    <Text style={styles.colBalance}>
                      {item.vacation_balance} dias
                    </Text>
                  </View>
                ))}

                <View style={styles.subtotalRow} wrap={false}>
                  <Text style={[styles.colLabelMerged, styles.bold]} wrap>
                    {`Total del dia`}
                  </Text>
                  <Text style={styles.colEntryDate} />
                  <Text style={styles.colAccumulated} />
                  <Text style={styles.colEnjoyed} />
                  <Text style={[styles.colBalance, styles.bold]}>
                    {formatTotal(areaTotal)} dias
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={styles.globalTotalRow} wrap={false}>
            <Text style={[styles.colLabelMerged, styles.bold]}>
              TOTAL GLOBAL
            </Text>
            <Text style={styles.colEntryDate} />
            <Text style={styles.colAccumulated} />
            <Text style={styles.colEnjoyed} />
            <Text style={[styles.colBalance, styles.bold]}>
              {formatTotal(globalTotal)} dias
            </Text>
          </View>
        </View>

        {showSignatures ? (
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
              {preparedRole ? (
                <Text style={styles.signatureRole}>
                  Responsable de {preparedRole}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
