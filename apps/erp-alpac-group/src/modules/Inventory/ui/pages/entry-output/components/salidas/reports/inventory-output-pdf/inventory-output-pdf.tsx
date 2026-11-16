import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";
import { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";
import { inventoryOutputPdfStyles as styles } from "./inventory-output-pdf.styles";

export function InventoryOutputPDF({ data }: { data: any }) {
  const { urlImage } = useCompanyStore();
  const { branchCode } = useUserStore();

  const CORINTO_BRANCH_CODES = ["ALP-CTO"];
  const isCorinto = CORINTO_BRANCH_CODES.some((code) =>
    (branchCode ?? "").toUpperCase().includes(code),
  );

  const detail = data?.detailData ?? {};
  const output = data?.selectedOutput ?? {};

  const resolvedRequestType =
    detail?.supply_request_detail ? "Supply" : detail?.fuel_request_detail ? "Fuel" : output?.request_type ?? null;

  const supplyDetail = detail?.supply_request_detail ?? null;
  const fuelDetail = detail?.fuel_request_detail ?? null;

  const requester =
    resolvedRequestType === "Supply"
      ? supplyDetail?.requested_by_user_name
      : fuelDetail?.requested_by_user_name;

  const approvedBy =
    resolvedRequestType === "Supply"
      ? supplyDetail?.approved_by_user_chief_name
      : fuelDetail?.approved_by_user_chief_name;

  const annulledBy =
    resolvedRequestType === "Supply"
      ? supplyDetail?.annulled_by_user_chief_name
      : fuelDetail?.annulled_by_user_chief_name;

  const createdAt =
    resolvedRequestType === "Supply"
      ? supplyDetail?.created_at
      : fuelDetail?.created_at;

  const justification =
    resolvedRequestType === "Supply"
      ? supplyDetail?.justification
      : fuelDetail?.justification;

  const reasonUseLabel =
    resolvedRequestType === "Supply"
      ? ReasonUseValues[supplyDetail?.reason_use as keyof typeof ReasonUseValues]?.label ??
      supplyDetail?.reason_use ??
      "—"
      : "—";

  const items =
    resolvedRequestType === "Supply"
      ? (supplyDetail?.items ?? []).map((item: any) => ({
        key: item.supply_request_item_id,
        name: item.product_stock_name ?? "Producto",
        requested: item.amount,
        available:
          (detail?.inventory_stock_informations ?? []).find(
            (stock: any) => stock.inventory_stock_id === item.product_stock_id,
          )?.available_quantity ?? "—",
      }))
      : resolvedRequestType === "Fuel" && fuelDetail
        ? [
          {
            key: fuelDetail.fuel_request_id ?? "fuel",
            name: fuelDetail.product_stock_name ?? "Producto",
            requested: fuelDetail.requested_quantity ?? "—",
            available:
              (detail?.inventory_stock_informations ?? []).find(
                (stock: any) => stock.inventory_stock_id === fuelDetail?.product_stock_id,
              )?.available_quantity ?? "—",
          },
        ]
        : [];

  const rawStatus = output?.status ?? "—";
  const status = InventoryOutputsStatus[rawStatus as keyof typeof InventoryOutputsStatus]?.label ?? rawStatus;
  const isPendingOutput = rawStatus === "OutputPending";
  const code = output?.output_code ?? "—";
  const requestDate = output?.request_date ? new Date(output.request_date).toLocaleDateString() : (createdAt ? new Date(createdAt).toLocaleDateString() : "—");
  const area = output?.work_area_name ?? supplyDetail?.work_area_name ?? fuelDetail?.work_area_information?.work_area_name ?? "—";
  const costCenter = output?.cost_center_name ?? "—";
  const warehouse =
    supplyDetail?.warehouse_code ??
    supplyDetail?.warehouse_information?.code ??
    "—";
  const reasonRemoval = output?.reasons_inventory_removal_description ?? "—";
  const dispatchedBy = detail?.dispatched_by_user_name ?? "—";
  const dispatchedAt = detail?.dispatched_at ? new Date(detail.dispatched_at).toLocaleDateString() : "—";
  const observations = output?.observations ?? "—";

  return (
    <Document title={`Salida ${output?.output_code ?? "inventario"}.pdf`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : <View />}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>ALPAC</Text>
            <Text style={styles.title}>DETALLE DE SALIDA DE INVENTARIO</Text>
          </View>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Información general</Text>
        <View style={styles.grid}>
          <View style={styles.field}>
            <Text style={styles.label}>Código</Text>
            <Text style={styles.value}>{code}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Tipo de solicitud</Text>
            <Text style={styles.value}>
              {resolvedRequestType === "Supply" ? "Insumos" : resolvedRequestType === "Fuel" ? "Combustibles" : "—"}
            </Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Código de solicitud</Text>
            <Text style={styles.value}>
              {resolvedRequestType === "Supply"
                ? supplyDetail?.supply_request_code ?? "—"
                : fuelDetail?.fuel_request_code ?? "—"}
            </Text>
          </View>
          {resolvedRequestType === "Supply" ? (
            <View style={styles.field}>
              <Text style={styles.label}>Código PO</Text>
              <Text style={styles.value}>
                {supplyDetail?.operational_order_information?.po_code ?? supplyDetail?.po_code ?? "—"}
              </Text>
            </View>
          ) : null}
          {resolvedRequestType === "Supply" ? (
            <View style={styles.field}>
              <Text style={styles.label}>Razón de uso</Text>
              <Text style={styles.value}>{reasonUseLabel}</Text>
            </View>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>Solicitante</Text>
            <Text style={styles.value}>{requester ?? "—"}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fecha de solicitud</Text>
            <Text style={styles.value}>{requestDate}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Aprobado por</Text>
            <Text style={styles.value}>{approvedBy ?? "—"}</Text>
          </View>
          {annulledBy ? (
            <View style={styles.field}>
              <Text style={styles.label}>Anulado por</Text>
              <Text style={styles.value}>{annulledBy}</Text>
            </View>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>Área</Text>
            <Text style={styles.value}>{area}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Centro de costo</Text>
            <Text style={styles.value}>{costCenter}</Text>
          </View>
          {resolvedRequestType === "Supply" ? (
            <View style={styles.field}>
              <Text style={styles.label}>Almacén</Text>
              <Text style={styles.value}>{warehouse}</Text>
            </View>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>Motivo de salida</Text>
            <Text style={styles.value}>{reasonRemoval}</Text>
          </View>
        </View>

        {resolvedRequestType === "Fuel" && fuelDetail ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Detalle de combustible</Text>
            <View style={styles.grid}>
              {isCorinto && fuelDetail?.customer_information?.legal_name ? (
                <View style={styles.field}>
                  <Text style={styles.label}>Cliente</Text>
                  <Text style={styles.value}>{fuelDetail.customer_information.legal_name}</Text>
                </View>
              ) : null}
              <View style={styles.field}>
                <Text style={styles.label}>Máquina / Vehículo</Text>
                <Text style={styles.value}>
                  {[fuelDetail.machinery_code, fuelDetail.machinery_brand, fuelDetail.machinery_model]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Cantidad solicitada</Text>
                <Text style={styles.value}>
                  {Number(fuelDetail.requested_quantity ?? 0).toLocaleString("es-NI", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {fuelDetail.unit_measure_symbol ?? ""} (
                  {Number(fuelDetail.requested_quantity_litters ?? 0).toLocaleString("es-NI", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  L)
                </Text>
              </View>
              {fuelDetail.engine_hours != null ? (
                <View style={styles.field}>
                  <Text style={styles.label}>Horas motor</Text>
                  <Text style={styles.value}>{fuelDetail.engine_hours}</Text>
                </View>
              ) : fuelDetail.mileage != null ? (
                <View style={styles.field}>
                  <Text style={styles.label}>Kilometraje</Text>
                  <Text style={styles.value}>{fuelDetail.mileage}</Text>
                </View>
              ) : null}
            </View>
          </>
        ) : null}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Artículos</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, isPendingOutput ? styles.colProduct : styles.colProductWide]}>Insumo</Text>
            <Text style={[styles.tableCell, styles.colQty]}>Cantidad solicitada</Text>
            {isPendingOutput ? (
              <Text style={[styles.tableCell, styles.colStock]}>Stock disponible</Text>
            ) : null}
          </View>
          {items.map((item: any) => (
            <View key={item.key} style={styles.tableRow}>
              <Text style={[styles.tableCell, isPendingOutput ? styles.colProduct : styles.colProductWide]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.requested}</Text>
              {isPendingOutput ? (
                <Text style={[styles.tableCell, styles.colStock]}>{item.available}</Text>
              ) : null}
            </View>
          ))}
          {items.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colProduct]}>Sin artículos</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.justificationRow}>
          <View style={styles.justificationColumn}>
            <Text style={styles.justificationLabel}>JUSTIFICACIÓN DE SOLICITUD</Text>
            <Text style={styles.value}>{justification ?? "—"}</Text>
          </View>
          <View style={styles.justificationColumn}>
            <Text style={styles.justificationLabel}>OBSERVACIONES DE APROBADO</Text>
            <Text style={styles.value}>{observations}</Text>
          </View>
        </View>

        {detail?.dispatched_by_user_name ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Despacho</Text>
            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={styles.label}>Despachado por</Text>
                <Text style={styles.value}>{dispatchedBy}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Fecha de despacho</Text>
                <Text style={styles.value}>{dispatchedAt}</Text>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.signaturesRow}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{requester ?? "—"}</Text>
            <Text style={styles.signatureLabel}>Solicitante</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{approvedBy ?? "—"}</Text>
            <Text style={styles.signatureLabel}>Jefe directo</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{dispatchedBy ?? "—"}</Text>
            <Text style={styles.signatureLabel}>Despachador</Text>
          </View>
        </View>

        <Text style={styles.footer}>Documento generado para impresión</Text>
      </Page>
    </Document>
  );
}