import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  styles,
  LETTER_PORTRAIT_SIZE,
} from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/check.utils";
import type { CheckPdfProps } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/types/check-pdf-types";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { topFieldStyles } from "@app/modules/payroll/ui/pages/nomina/components/check-pdf/utils/check.utils";
export function CheckPdfDocument({ data, startDate, endDate }: CheckPdfProps) {
  const { urlImage } = useCompanyStore();
  const companyName = useUserStore.getState().companyName || "Alpac Group";
  const currentDate = new Date()
    .toLocaleDateString("es-NI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const formattedStart = startDate
    ? formatDateToSpanishWords(startDate.trim())
    : "";
  const formattedEnd = endDate ? formatDateToSpanishWords(endDate.trim()) : "";

  return (
    <Document>
      {data.map((item, index) => {
        const amount = item.total_to_pay || 0;
        const formattedAmount = formatCurrency(amount);
        const fullName = item.collaborator?.full_name || "—";
        const workArea = item.collaborator?.work_area || "Talento Humano";
        const jobPosition = item.collaborator?.job_position || "";

        return (
          <Page
            key={item.ordinary_payroll_id || index}
            size={LETTER_PORTRAIT_SIZE}
            style={styles.page}
          >
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                {urlImage ? <Image src={urlImage} style={styles.logo} /> : null}
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.companyName}>{companyName}</Text>
                <Text style={styles.documentTitle}>Solicitud de pago</Text>
              </View>
            </View>

            <View style={styles.mainBox}>
              <View style={[styles.topSectionRow, topFieldStyles.rowSpaced]}>
                <Text style={topFieldStyles.labelLeft}>Fecha:</Text>
                <View style={topFieldStyles.lineLeft}>
                  <Text>{currentDate}</Text>
                </View>
                <View style={topFieldStyles.middleGap}></View>
                <Text style={topFieldStyles.labelRightAmount}>Monto</Text>
                <Text style={topFieldStyles.currencyLabel}>C$</Text>
                <View style={topFieldStyles.lineRight}>
                  <Text>{formattedAmount}</Text>
                </View>
              </View>

              <View style={styles.topSectionRow}>
                <Text style={topFieldStyles.labelLeft}></Text>
                <View style={topFieldStyles.lineSpacer}></View>
                <View style={topFieldStyles.middleGap}></View>
                <Text style={topFieldStyles.labelRightAmount}></Text>
                <Text style={topFieldStyles.currencyLabel}>$</Text>
                <View style={topFieldStyles.lineRight}></View>
              </View>

              <View style={[styles.topSectionRow, topFieldStyles.rowSpaced]}>
                <Text style={topFieldStyles.labelLeft}>Beneficiario:</Text>
                <View style={topFieldStyles.lineLeft}>
                  <Text>{fullName}</Text>
                </View>
                <View style={topFieldStyles.middleGap}></View>
                <Text style={topFieldStyles.labelRight}>Retención IR</Text>
                <View style={topFieldStyles.lineRight}></View>
              </View>

              <View style={[styles.topSectionRow, topFieldStyles.rowSpaced]}>
                <Text style={topFieldStyles.labelLeft}>Área solicitante:</Text>
                <View style={topFieldStyles.lineLeft}>
                  <Text>{workArea}</Text>
                </View>
                <View style={topFieldStyles.middleGap}></View>
                <Text style={topFieldStyles.labelRight}>Retención IMI</Text>
                <View style={topFieldStyles.lineRight}></View>
              </View>

              <View style={[styles.topSectionRow, topFieldStyles.rowSpaced]}>
                <Text style={topFieldStyles.labelLeft}>N° Orden compra:</Text>
                <View style={topFieldStyles.lineLeft}></View>
                <View style={topFieldStyles.middleGap}></View>
                <Text style={topFieldStyles.labelRight}>Otros</Text>
                <View style={topFieldStyles.lineRight}></View>
              </View>

              <View
                style={[
                  styles.topSectionRow,
                  { marginTop: 12, marginBottom: 6 },
                ]}
              >
                <Text style={{ width: "15%", fontSize: 9 }}>Trámite:</Text>
                <Text style={{ width: "40%" }}>
                  Ordinario ( x ) Urgente ( )
                </Text>
                <Text style={{ width: "15%" }}>Neto a pagar:</Text>
                <View
                  style={{
                    width: "5%",
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#000",
                    padding: 2,
                  }}
                >
                  <Text>C$</Text>
                  <Text>$</Text>
                </View>
                <View
                  style={{
                    width: "20%",
                    borderTopWidth: 1,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#000",
                    padding: 2,
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <Text>{formattedAmount}</Text>
                  <Text> </Text>
                </View>
              </View>
            </View>

            <View style={styles.conceptBox}>
              <View style={styles.conceptTitle}>
                <Text>Concepto del pago:</Text>
              </View>
              <View style={styles.conceptContent}>
                <Text>
                  Pago de salario correspondiente del {formattedStart} al{" "}
                  {formattedEnd} - {jobPosition}.
                </Text>
              </View>
              <View style={styles.accountContent}>
                <Text>Pago por cuenta de:</Text>
              </View>
            </View>

            <View style={styles.checkListBox}>
              <View style={styles.checkListHeaderRow}>
                <Text style={styles.checkListHeaderCell1}>Check List</Text>
                <Text style={styles.checkListHeaderCell2}>
                  Descripción del documento
                </Text>
                <Text style={styles.checkListHeaderCell3}>
                  Verificado por contabilidad
                </Text>
              </View>

              <View style={styles.checkListSubHeader}>
                <Text>DOCUMENTOS GENERALES</Text>
              </View>

              {[
                "Solicitud de cheque firmada por personal del departamento solicitante.",
                "Copia (   ) u original (   ) de orden de compra del proveedor.",
                "Copia (   ) u original (   ) de la factura, ND, NC, documento del proveedor.",
                "Análisis de cotizaciones debidamente firmada.",
                "Cotizaciones efectuadas, agregar la cantidad de cotizaciones (        ).",
                "Requisiciones de compras con firma de recibido del solicitante.",
                "Carta de exoneración de la DGI (        ), ALMA (        ).",
                "Comunicaciones, correo e instrucciones relacionadas con el pago.",
                "",
                "",
              ].map((text, i) => (
                <View style={styles.checkListItemRow} key={`gen-${i}`}>
                  <View style={styles.checkListItemBox}>
                    <View style={styles.square}></View>
                  </View>
                  <Text style={styles.checkListItemText}>{text}</Text>
                  <View style={styles.checkListItemVerification}></View>
                </View>
              ))}

              <View
                style={[
                  styles.checkListSubHeader,
                  { borderTopWidth: 1, borderTopColor: "#000" },
                ]}
              >
                <Text>SERVICIOS</Text>
              </View>

              {[
                "Contrato original debidamente firmado.",
                "Presupuesto del servicio (si aplica)",
                "Finiquito de servicio",
              ].map((text, i) => (
                <View style={styles.checkListItemRow} key={`srv-${i}`}>
                  <View style={styles.checkListItemBox}>
                    <View style={styles.square}></View>
                  </View>
                  <Text style={styles.checkListItemText}>{text}</Text>
                  <View style={styles.checkListItemVerification}></View>
                </View>
              ))}
            </View>

            <View style={styles.signaturesContainer}>
              <Text style={{ marginBottom: 12 }}>Firma:</Text>

              <View style={styles.signaturesRow}>
                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine}></View>
                  <Text style={styles.signatureTitle}>Solicitado:</Text>
                  <Text style={styles.signatureName}>Auxiliar</Text>
                  <Text style={styles.signatureRole}>Talento Humano</Text>
                </View>

                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine}></View>
                  <Text style={styles.signatureTitle}>Revisado:</Text>
                  <Text style={styles.signatureName}>Jackson Treminio</Text>
                  <Text style={styles.signatureRole}>Contador General</Text>
                </View>

                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine}></View>
                  <Text style={styles.signatureTitle}>Autorizado:</Text>
                  <Text style={styles.signatureName}>Aracelly Guillen</Text>
                  <Text style={styles.signatureRole}>Gerente General</Text>
                </View>
              </View>
            </View>

            <View style={styles.receiptBox}>
              <View style={styles.receiptCell}>
                <Text style={styles.receiptLabel}>Banco:</Text>
              </View>
              <View style={styles.receiptCell}>
                <Text style={styles.receiptLabel}>Recibido:</Text>
              </View>
              <View style={styles.receiptCell}>
                <Text style={styles.receiptLabel}>Cédula:</Text>
              </View>
              <View style={styles.receiptCellLast}>
                <Text style={styles.receiptLabel}>Fecha:</Text>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
