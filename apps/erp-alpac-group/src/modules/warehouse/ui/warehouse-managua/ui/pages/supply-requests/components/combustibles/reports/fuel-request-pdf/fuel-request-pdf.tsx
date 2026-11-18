import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { fuelRequestPdfStyles as styles } from "./fuel-request-pdf.styles";
import { getEquipmentTypeLabel } from "@app/modules/warehouse/domain/enums/equipment.enum";

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

  const equipmentCode =
    data?.equipment_information?.code ?? data?.equipment_code ?? "—";
  const equipmentBrand =
    data?.equipment_information?.brand ?? data?.equipment_brand ?? "—";
  const equipmentModel =
    data?.equipment_information?.model ?? data?.equipment_model ?? "—";
  const equipmentSerial = data?.equipment_information?.serial_number ?? "—";
  const equipmentTypeRaw = data?.equipment_information?.type ?? "—";
  const equipmentType = getEquipmentTypeLabel(equipmentTypeRaw);

  const fuelTypes = [
    data?.equipment_information?.gasoline ? "Gasolina" : null,
    data?.equipment_information?.diesel ? "Diésel" : null,
    data?.equipment_information?.electric ? "Eléctrico" : null,
    data?.equipment_information?.lpg ? "GLP" : null,
  ]
    .filter(Boolean)
    .join(", ") || "—";

  const hasMileage =
    data?.mileage != null || data?.previous_mileage != null;
  const hasEngineHours =
    data?.engine_hours != null || data?.previous_engine_hours != null;

  return (
    <Document title={`solicitud ${data?.fuel_request_code ?? "combustible"}.pdf`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : <View />}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>ALPAC</Text>
            <Text style={styles.title}>BOLETA DE SOLICITUD DE COMBUSTIBLE</Text>
          </View>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Información general</Text>
        <View style={styles.grid}>
          <View style={styles.field}>
            <Text style={styles.label}>Código de Solicitud</Text>
            <Text style={styles.value}>{data?.fuel_request_code ?? "—"}</Text>
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
        </View>

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
          <View style={styles.field}>
            <Text style={styles.label}>Combustible</Text>
            <Text style={styles.value}>{fuelTypes}</Text>
          </View>
          {data?.warehouse_information?.code || data?.warehouse_information?.warehouse_id ? (
            <View style={styles.field}>
              <Text style={styles.label}>Almacén</Text>
              <Text style={styles.value}>
                {data?.warehouse_information?.code ?? data?.warehouse_information?.warehouse_id ?? "—"}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Detalle de combustible</Text>
        <View style={styles.grid}>
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
          {hasMileage ? (
            <View style={styles.field}>
              <Text style={styles.label}>Kilometraje</Text>
              <Text style={styles.value}>
                Anterior: {data?.previous_mileage != null ? `${data.previous_mileage} km` : "—"}{"\n"}
                Actual: {data?.mileage != null ? `${data.mileage} km` : "—"}
              </Text>
            </View>
          ) : null}
          {hasEngineHours ? (
            <View style={styles.field}>
              <Text style={styles.label}>Horas motor</Text>
              <Text style={styles.value}>
                Anterior: {data?.previous_engine_hours != null ? `${data.previous_engine_hours} hrs` : "—"}{"\n"}
                Actual: {data?.engine_hours != null ? `${data.engine_hours} hrs` : "—"}
              </Text>
            </View>
          ) : null}
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