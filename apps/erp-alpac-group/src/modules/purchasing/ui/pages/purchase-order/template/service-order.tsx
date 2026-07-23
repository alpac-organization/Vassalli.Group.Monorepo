import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { s } from "./utils/service-order.style";
import type { ServiceOrderData } from "@app/modules/purchasing/ui/pages/purchase-order/template/types/service-order.props";
import { MOCK_SERVICE_ORDER } from "@app/modules/purchasing/ui/pages/purchase-order/template/mock/mock-service-orders";

interface ServiceOrderDocumentProps {
  data?: ServiceOrderData;
}
export function ServiceOrderDocument({
  data = MOCK_SERVICE_ORDER,
}: ServiceOrderDocumentProps) {
  const { urlImage } = useCompanyStore();

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.headerContainer}>
          <View style={s.logoContainer}>
            {urlImage ? <Image src={urlImage} style={s.logo} /> : null}
          </View>
          <Text style={s.companyName}>{data.companyName}</Text>
          <Text style={s.companyCity}>{data.city}</Text>
          <Text style={s.documentTitle}>ORDEN DE COMPRA Y/O SERVICIO</Text>
        </View>

        <View style={s.infoSection}>
          <View style={s.infoRow}>
            <Text style={s.infoLeft}>
              <Text style={s.bold}>Nombre del Proveedor: </Text>
              {data.supplierName}
            </Text>
            <Text style={s.infoRight}>
              <Text style={s.bold}>Fecha: </Text>
              {data.date}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLeft}>
              <Text style={s.bold}>Orden de Compra No: </Text>
              {data.orderNumber}
            </Text>
            <Text style={s.infoRight}>
              <Text style={s.bold}>Condición de Pago: </Text>
              {data.paymentCondition}
            </Text>
          </View>
        </View>

        <View style={s.metaBox}>
          <View style={[s.metaCol, s.metaColBorder]}>
            <Text style={s.metaLabel}>Solicitud de Materiales</Text>
            <Text style={s.metaValue}>{data.materialRequest}</Text>
          </View>
          <View style={[s.metaCol, s.metaColBorder]}>
            <Text style={s.metaLabel}>
              Departamento Solicitante: {data.requestingDepartment}
            </Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>{data.proforma}</Text>
          </View>
        </View>

        <Text style={s.instruction}>
          Por este medio solicitamos el suministro de los siguientes:
        </Text>

        <View style={s.table}>
          <View style={[s.tableRow, s.tableHeader]}>
            <Text style={[s.cell, s.colQty, s.headerText]}>Cantidad</Text>
            <Text style={[s.cell, s.colUnit, s.headerText]}>U/M</Text>
            <Text style={[s.cell, s.colCode, s.headerText]}>Código</Text>
            <Text style={[s.cell, s.colDesc, s.headerText]}>DESCRIPCION</Text>
            <Text style={[s.cell, s.colPrice, s.headerText]}>
              Precio Unitario
            </Text>
            <Text style={[s.cell, s.colTotal, s.headerText, s.cellLast]}>
              Importe Total
            </Text>
          </View>

          {data.items.map((item) => (
            <View key={`${item.code}-${item.description}`} style={s.tableRow}>
              <Text style={[s.cell, s.colQty, s.center]}>{item.quantity}</Text>
              <Text style={[s.cell, s.colUnit, s.center]}>{item.unit}</Text>
              <Text style={[s.cell, s.colCode, s.center]}>{item.code}</Text>
              <View style={[s.cell, s.colDesc, s.descCell]}>
                <Text style={s.descText}>{item.description}</Text>
                {item.flag ? <Text style={s.flagText}>{item.flag}</Text> : null}
              </View>
              <Text style={[s.cell, s.colPrice, s.right]}>
                {formatCurrency(item.unitPrice, "NIO")}
              </Text>
              <Text style={[s.cell, s.colTotal, s.right, s.cellLast]}>
                {formatCurrency(item.totalAmount, "NIO")}
              </Text>
            </View>
          ))}

          <View style={s.summaryRow}>
            <View style={s.notesCell}>
              <Text style={s.notesText}>{data.notes}</Text>
            </View>
            <View style={s.totalsCell}>
              <View style={s.totalLine}>
                <Text style={s.totalLabel}>SubTotal:</Text>
                <Text style={s.totalValue}>
                  {formatCurrency(data.subTotal, "NIO")}
                </Text>
              </View>
              <View style={s.totalLine}>
                <Text style={s.totalLabel}>Descuento:</Text>
                <Text style={s.totalValue}>
                  {formatCurrency(data.discount, "NIO")}
                </Text>
              </View>
              <View style={s.totalLine}>
                <Text style={s.totalLabel}>IVA:</Text>
                <Text style={s.totalValue}>
                  {formatCurrency(data.iva, "NIO")}
                </Text>
              </View>
              <View style={s.totalLine}>
                <Text style={s.totalLabel}>EXO:</Text>
                <Text style={s.totalValue}>
                  {formatCurrency(data.exo, "NIO")}
                </Text>
              </View>
              <View style={[s.totalLine, s.totalLineFinal]}>
                <Text style={[s.totalLabel, s.bold]}>Total:</Text>
                <Text style={[s.totalValue, s.bold]}>
                  {formatCurrency(data.total, "NIO")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={s.paymentNote}>
          Para efecto de pago, adjunte el original de su factura a esta orden
        </Text>

        <View style={s.refRow}>
          <View style={s.refRightContainer}>
            <Text style={s.refLeft}>
              Proveedor{"  "}Requisicion {data.requisitionNumber}
            </Text>
          </View>
          <Text style={s.refRight}>OC Autorizado Por: {data.authorizedBy}</Text>
        </View>

        <View style={s.signatures}>
          <View style={s.signatureBlock}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>
              Elaborado por: {data.preparedBy}
            </Text>
          </View>
          <View style={s.signatureBlock}>
            <View style={s.signatureLine} />
            <Text style={s.signatureLabel}>Autorizado</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
