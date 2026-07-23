import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { s } from "@app/modules/purchasing/ui/pages/materiales/styles/request.materiales.styles";
import type {
  MaterialRequestData,
  MaterialRequestItem,
  MaterialRequestPeriod,
} from "@app/modules/purchasing/ui/pages/materiales/types/request.materiales.props";
import {
  EMPTY_MATERIAL_ROWS,
  MOCK_MATERIAL_REQUEST,
} from "@app/modules/purchasing/ui/pages/materiales/mock/mock-request-materiales";

interface RequestMaterialesDocumentProps {
  data?: MaterialRequestData;
  period?: MaterialRequestPeriod;
}

const emptyItem = (): MaterialRequestItem => ({
  code: "",
  name: "",
  unit: "",
  requestedQuantity: "",
  deliveredOrPending: "",
  requesterStock: "",
  observations: "",
});

function buildRows(items: MaterialRequestItem[]): MaterialRequestItem[] {
  const rows = [...items];
  while (rows.length < EMPTY_MATERIAL_ROWS) {
    rows.push(emptyItem());
  }
  return rows;
}

export function RequestMaterialesDocument({
  data = MOCK_MATERIAL_REQUEST,
  period,
}: RequestMaterialesDocumentProps) {
  const { urlImage } = useCompanyStore();
  const resolvedPeriod = period ?? data.period;
  const rows = buildRows(data.items);

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={s.page}>
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            {urlImage ? <Image src={urlImage} style={s.logo} /> : null}
          </View>
          <View style={s.headerCenter}>
            <Text style={s.companyName}>{data.companyName}</Text>
            <Text style={s.documentTitle}>
              SOLICITUD DE MATERIALES DE OFICINA Y OTROS
            </Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.formCode}>{data.formCode}</Text>
          </View>
        </View>

        <View style={s.metaBox}>
          <View style={s.metaCol}>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Solicitante:</Text>
              <Text style={s.metaValue}>{data.requester}</Text>
            </View>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Periodo:</Text>
              <Text style={s.metaValue}>{resolvedPeriod}</Text>
            </View>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Categoria:</Text>
              <Text style={s.metaValue}>{data.category}</Text>
            </View>
          </View>
          <View style={s.metaCol}>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Solicitud:</Text>
              <Text style={s.metaValue}>{data.requestNumber}</Text>
            </View>
            <View style={s.metaLine}>
              <Text style={s.metaLabel}>Fecha:</Text>
              <Text style={s.metaValue}>{data.date}</Text>
            </View>
          </View>
        </View>

        <View style={s.table}>
          <View style={s.tableRow}>
            <Text style={[s.cell, s.colCode, s.headerText]}>Código</Text>
            <Text style={[s.cell, s.colName, s.headerText]}>
              Nombre Del Articulo
            </Text>
            <Text style={[s.cell, s.colUnit, s.headerText]}>Unidad</Text>
            <Text style={[s.cell, s.colQty, s.headerText]}>
              Cantidad Solicitada
            </Text>
            <Text style={[s.cell, s.colDelivered, s.headerText]}>
              Cant. Ent./ Prod. Pend.
            </Text>
            <Text style={[s.cell, s.colStock, s.headerText]}>
              Stock Emp solicitante
            </Text>
            <Text style={[s.cell, s.colObs, s.headerText, s.cellLast]}>
              Observaciones
            </Text>
          </View>

          {rows.map((item, index) => {
            const isLast = index === rows.length - 1;
            return (
              <View
                key={`row-${index}-${item.code}`}
                style={[s.tableRow, isLast ? s.tableRowLast : {}]}
              >
                <Text style={[s.cell, s.colCode, s.center]}>{item.code}</Text>
                <Text style={[s.cell, s.colName]}>{item.name}</Text>
                <Text style={[s.cell, s.colUnit, s.center]}>{item.unit}</Text>
                <Text style={[s.cell, s.colQty, s.center]}>
                  {item.requestedQuantity}
                </Text>
                <Text style={[s.cell, s.colDelivered, s.center]}>
                  {item.deliveredOrPending}
                </Text>
                <Text style={[s.cell, s.colStock, s.center]}>
                  {item.requesterStock}
                </Text>
                <Text style={[s.cell, s.colObs, s.cellLast]}>
                  {item.observations}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={s.footerSection}>
          <View style={s.footerLeft}>
            <View style={s.footerLine}>
              <Text style={s.footerLabel}>
                Jefe de Area Solicitante: {data.areaManager}
              </Text>
              <View style={s.underline} />
            </View>
            <View style={s.footerLine}>
              <Text style={s.footerLabel}>
                Autorizado Por: {data.authorizedBy}
              </Text>
              <View style={s.underline} />
            </View>
            <View style={s.footerLine}>
              <Text style={s.footerLabel}>
                Modificado Por: {data.modifiedBy}
              </Text>
              <View style={s.underline} />
            </View>
          </View>
          <View style={s.footerRight}>
            <View style={s.footerLine}>
              <Text style={s.footerLabel}>
                Fecha de Entrega: {data.deliveryDate}
              </Text>
              <View style={s.underline} />
            </View>
            <View style={s.footerLine}>
              <Text style={s.footerLabel}>Recibido por: {data.receivedBy}</Text>
              <View style={s.underline} />
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
