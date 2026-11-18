import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";
import { getEquipmentTypeLabel } from "@app/modules/warehouse/domain/enums/equipment.enum";
import { supplyRequestPdfStyles as styles } from "./supply-request-pdf.styles";

export function SupplyRequestPDF({ data }: { data: any }) {
  const { urlImage } = useCompanyStore();

  const createdAt = data?.created_at ? new Date(data.created_at).toLocaleString() : "—";

  const equipmentCode = data?.equipment_information?.code ?? data?.equipment_code ?? "—";
  const equipmentBrand = data?.equipment_information?.brand ?? data?.equipment_brand ?? "—";
  const equipmentModel = data?.equipment_information?.model ?? data?.equipment_model ?? "—";
  const equipmentSerial = data?.equipment_information?.serial_number ?? "—";
  const equipmentTypeRaw = data?.equipment_information?.type ?? "—";
  const equipmentType = getEquipmentTypeLabel(equipmentTypeRaw);

  const reasonUseLabel =
    ReasonUseValues[data?.reason_use as keyof typeof ReasonUseValues]?.label ??
    data?.reason_use ??
    "—";

  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <Document title={`solicitud ${data?.supply_request_code ?? "insumos"}.pdf`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : <View />}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>ALPAC</Text>
            <Text style={styles.title}>BOLETA DE SOLICITUD DE INSUMOS</Text>
          </View>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Información general</Text>
        <View style={styles.grid}>
          <View style={styles.field}>
            <Text style={styles.label}>Código de Solicitud</Text>
            <Text style={styles.value}>{data?.supply_request_code ?? "—"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Estado de Solicitud</Text>
            <Text style={styles.value}>{data?.outflow_status ?? "—"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Solicitante</Text>
            <Text style={styles.value}>{data?.requested_by_user_name ?? "—"}</Text>
          </View>
          {data?.customer_information?.legal_name ? (
            <View style={styles.field}>
              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.value}>{data.customer_information.legal_name}</Text>
            </View>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>Fecha de solicitud</Text>
            <Text style={styles.value}>{createdAt}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Aprobado por</Text>
            <Text style={styles.value}>{data?.approved_by_user_chief_name ?? "—"}</Text>
          </View>
          {data?.warehouse_information?.code || data?.warehouse_code ? (
            <View style={styles.field}>
              <Text style={styles.label}>Almacén</Text>
              <Text style={styles.value}>
                {data?.warehouse_information?.code ?? data?.warehouse_code ?? "—"}
              </Text>
            </View>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>Motivo de uso</Text>
            <Text style={styles.value}>{reasonUseLabel}</Text>
          </View>
          {data?.cost_center_information?.cost_center_name || data?.cost_center_information?.cost_center_code ? (
            <View style={styles.field}>
              <Text style={styles.label}>Centro de costo</Text>
              <Text style={styles.value}>
                {data?.cost_center_information?.cost_center_name ??
                  data?.cost_center_information?.cost_center_code ??
                  "—"}
              </Text>
            </View>
          ) : null}
          {data?.duca_or_transport_order ? (
            <View style={styles.field}>
              <Text style={styles.label}>DUCA / Orden de transporte</Text>
              <Text style={styles.value}>{data.duca_or_transport_order}</Text>
            </View>
          ) : null}
          {data?.work_area_information?.work_area_name || data?.work_area_name ? (
            <View style={styles.field}>
              <Text style={styles.label}>Área de trabajo</Text>
              <Text style={styles.value}>
                {data?.work_area_information?.work_area_name ?? data?.work_area_name ?? "—"}
              </Text>
            </View>
          ) : null}
          {data?.po_code || data?.operational_order_information?.po_code ? (
            <View style={styles.field}>
              <Text style={styles.label}>Código PO</Text>
              <Text style={styles.value}>
                {data?.operational_order_information?.po_code ?? data?.po_code ?? "—"}
              </Text>
            </View>
          ) : null}
        </View>

        {data?.equipment_information ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Información de activo fijo</Text>
            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={styles.label}>Código de activo</Text>
                <Text style={styles.value}>{equipmentCode}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Marca</Text>
                <Text style={styles.value}>{equipmentBrand}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Modelo</Text>
                <Text style={styles.value}>{equipmentModel}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Número de serie</Text>
                <Text style={styles.value}>{equipmentSerial}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Tipo</Text>
                <Text style={styles.value}>{equipmentType}</Text>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Ítems solicitados</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.colProduct]}>Insumo</Text>
            <Text style={[styles.tableCell, styles.colQty]}>Cantidad</Text>
          </View>
          {items.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colProduct]}>Sin ítems registrados</Text>
            </View>
          ) : (
            items.map((item: any) => (
              <View key={item.supply_request_item_id ?? item.product_stock_id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colProduct]}>
                  {item.product_stock_name ?? "Producto"}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.amount ?? "—"}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Justificación</Text>
        <View style={styles.justificationBox}>
          <Text style={styles.value}>{data?.justification ?? "—"}</Text>
        </View>

        <View style={styles.signaturesRow}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data?.requested_by_user_name ?? "—"}</Text>
            <Text style={styles.signatureLabel}>Solicitante</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data?.approved_by_user_chief_name ?? "—"}</Text>
            <Text style={styles.signatureLabel}>Jefe directo</Text>
          </View>
        </View>

        <Text style={styles.footer}>Documento generado para impresión</Text>
      </Page>
    </Document>
  );
}