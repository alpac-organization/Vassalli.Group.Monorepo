import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { s } from "./utils/requisition.style";
import type { RequisitionData } from "@app/modules/purchasing/ui/pages/requsition/templates/types/requisition.props";
import { MOCK_REQUISITION } from "@app/modules/purchasing/ui/pages/requsition/templates/mock/mock-requisition";

interface RequisitionDocumentProps {
  data?: RequisitionData;
}

export function RequisitionDocument({
  data = MOCK_REQUISITION,
}: RequisitionDocumentProps) {
  const { urlImage } = useCompanyStore();

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            {urlImage ? <Image src={urlImage} style={s.logo} /> : null}
            <Text style={s.requisitionNumber}>{data.requisitionNumber}</Text>
          </View>
          <View style={s.headerCenter}>
            <Text style={s.companyName}>{data.companyName}</Text>
            <Text style={s.documentTitle}>REQUISICION DE COMPRAS</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.formCode}>{data.formCode}</Text>
          </View>
        </View>

        <View style={s.table}>
          <View style={s.tableRow}>
            <Text style={[s.cell, s.colQty, s.headerText]}>CANTIDAD</Text>
            <Text style={[s.cell, s.colDesc, s.headerText]}>
              DESCRIPCION DEL ARTICULO
            </Text>
            <Text style={[s.cell, s.colJust, s.headerText, s.cellLast]}>
              JUSTIFICACION
            </Text>
          </View>

          {data.items.map((item, index) => {
            const isLast = index === data.items.length - 1;
            return (
              <View
                key={`${item.description}-${index}`}
                style={[s.tableRow, isLast ? s.tableRowLast : {}]}
              >
                <Text style={[s.cell, s.colQty, s.center]}>
                  {item.quantity}
                </Text>
                <Text style={[s.cell, s.colDesc]}>{item.description}</Text>
                <Text style={[s.cell, s.colJust, s.cellLast]}>
                  {item.justification}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={s.metaSection}>
          <View style={s.metaLeft}>
            <Text style={s.metaLine}>
              Solicitante del Area: {data.areaRequester}
            </Text>
            <View style={s.authLine} />
            <Text style={s.metaLine}>Solicitado: {data.requestedDate}</Text>
            <View style={s.authLine} />
            <Text style={s.metaLine}>Modificado: {data.modifiedDate}</Text>
            <View style={s.authLine} />
          </View>
          <View style={s.metaRight}>
            <Text style={s.authLabel}>
              Autorización: {data.authorizationName}
            </Text>
            <View style={s.authLine} />
          </View>
        </View>

        <View style={s.receiptBox}>
          <View style={s.receiptLeft}>
            <Text style={s.receiptLabel}>Recibi conforme:</Text>
            <View style={s.receiptSignatureLine} />
          </View>
          <View style={s.receiptRight}>
            <View style={s.receiptDateLine}>
              <Text style={s.receiptLabel}>Fecha:</Text>
              <Text style={s.receiptDateValue}>{data.receivedDate}</Text>
            </View>
            <View style={s.receiptDateLine}>
              <Text style={s.receiptLabel}>Hora:</Text>
              <Text style={s.receiptDateValue}>{data.receivedTime}</Text>
            </View>
          </View>
        </View>

        <View style={s.statusBar}>
          <Text style={s.statusItem}>Solicitado: {data.requestedAt}</Text>
          <Text style={s.statusItem}>Autorizado: {data.authorizedAt}</Text>
          <Text style={s.statusItem}>Revisado: {data.reviewedAt || ""}</Text>
        </View>
      </Page>
    </Document>
  );
}
