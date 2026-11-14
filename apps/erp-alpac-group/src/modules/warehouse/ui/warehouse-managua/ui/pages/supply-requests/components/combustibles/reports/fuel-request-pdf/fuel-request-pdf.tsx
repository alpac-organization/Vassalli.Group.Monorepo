import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { fuelRequestPdfStyles as styles } from "./fuel-request-pdf.styles";

export function FuelRequestPDF({ data }: { data: any }) {
  const { urlImage } = useCompanyStore();

  const quantity = Number(data?.requested_quantity ?? 0).toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const liters = Number(data?.requested_quantity_litters ?? 0).toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const createdAt = data?.created_at ? new Date(data.created_at).toLocaleString() : "—";

  const machinery = [data?.machinery_code, data?.machinery_brand, data?.machinery_model]
    .filter(Boolean)
    .join(" / ") || "—";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : <View />}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>ALPAC GROUP</Text>
            <Text style={styles.title}>BOLETA DE SOLICITUD DE COMBUSTIBLE</Text>
          </View>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Información general</Text>
        <View style={styles.grid}>
          <View style={styles.field}>
            <Text style={styles.label}>Código</Text>
            <Text style={styles.value}>{data?.fuel_request_code ?? "—"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Estado</Text>
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
          {data?.annulled_by_user_chief_name ? (
            <View style={styles.field}>
              <Text style={styles.label}>Anulado por</Text>
              <Text style={styles.value}>{data.annulled_by_user_chief_name}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Detalle de combustible</Text>
        <View style={styles.grid}>
          <View style={styles.field}>
            <Text style={styles.label}>Maquinaria</Text>
            <Text style={styles.value}>{machinery}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Producto solicitado</Text>
            <Text style={styles.value}>{data?.product_stock_name ?? "—"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Cantidad solicitada</Text>
            <Text style={styles.value}>
              {quantity} {data?.unit_measure_symbol ?? ""} ({liters} L)
            </Text>
          </View>
          {data?.mileage != null ? (
            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje</Text>
              <Text style={styles.value}>{data.mileage}</Text>
            </View>
          ) : data?.engine_hours != null ? (
            <View style={styles.field}>
              <Text style={styles.label}>Horas motor</Text>
              <Text style={styles.value}>{data.engine_hours}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Justificación</Text>
        <View style={styles.justificationBox}>
          <Text style={styles.value}>{data?.justification ?? "—"}</Text>
        </View>

        <Text style={styles.footer}>Documento generado para impresión</Text>
      </Page>
    </Document>
  );
}