import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";
import { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";
import { inventoryOutputPdfStyles as styles } from "./inventory-output-pdf.styles";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { getEquipmentTypeLabel } from "@app/modules/warehouse/domain/enums/equipment.enum";

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

  const kardexMovements = detail?.kardex_movements ?? [];

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
  const isApproved = rawStatus === "Dispatched";
  const isPendingOutput = rawStatus === "OutputPending";
  const code = output?.output_code ?? "—";
  const requestDate = output?.request_date ? new Date(output.request_date).toLocaleString() : (createdAt ? new Date(createdAt).toLocaleString() : "—");
  const area = output?.work_area_name ?? supplyDetail?.work_area_name ?? fuelDetail?.work_area_information?.work_area_name ?? "—";
  const costCenter = output?.cost_center_name ?? supplyDetail?.cost_center_information?.cost_center_name ?? "—";
  const warehouse =
    supplyDetail?.warehouse_information?.code ??
    supplyDetail?.warehouse_code ??
    fuelDetail?.warehouse_information?.code ??
    "—";
  const reasonRemoval = output?.reasons_inventory_removal_description ?? "—";
  const dispatchedBy = detail?.dispatched_by_user_name ?? "—";
  const dispatchedAt = detail?.dispatched_at ? new Date(detail.dispatched_at).toLocaleString() : "—";
  const observations = output?.observations ?? "—";

  const equipment =
    resolvedRequestType === "Supply"
      ? supplyDetail?.equipment_information
      : fuelDetail?.equipment_information ?? null;

  const supplyFuelTypes = [
    equipment?.gasoline ? "Gasolina" : null,
    equipment?.diesel ? "Diésel" : null,
    equipment?.electric ? "Eléctrico" : null,
    equipment?.lpg ? "GLP" : null,
  ]
    .filter(Boolean)
    .join(", ") || "—";

  const machineryCode =
    fuelDetail?.machinery_code ?? fuelDetail?.equipment_information?.code ?? "—";
  const machineryBrand =
    fuelDetail?.machinery_brand ?? fuelDetail?.equipment_information?.brand ?? "—";
  const machineryModel =
    fuelDetail?.machinery_model ?? fuelDetail?.equipment_information?.model ?? "—";
  const machinerySerial =
    fuelDetail?.equipment_information?.serial_number ?? "—";
  const machineryType =
    getEquipmentTypeLabel(fuelDetail?.equipment_information?.type) ?? "—";

  const fuelTypes = [
    fuelDetail?.equipment_information?.gasoline ? "Gasolina" : null,
    fuelDetail?.equipment_information?.diesel ? "Diésel" : null,
    fuelDetail?.equipment_information?.electric ? "Eléctrico" : null,
    fuelDetail?.equipment_information?.lpg ? "GLP" : null,
  ]
    .filter(Boolean)
    .join(", ") || "—";

  return (
    <Document title={`Salida ${output?.output_code ?? "inventario"}.pdf`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          {urlImage ? <Image src={urlImage} style={styles.logo} /> : <View />}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>ALPAC</Text>
            <Text style={styles.title}>BOLETA DE SALIDA DE INVENTARIO</Text>
          </View>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Información general</Text>
        <View style={styles.grid}>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Código de salida</Text>
            <Text style={styles.value}>{code}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Estado</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Tipo de solicitud</Text>
            <Text style={styles.value}>
              {resolvedRequestType === "Supply" ? "Insumos" : resolvedRequestType === "Fuel" ? "Combustibles" : "—"}
            </Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Código de solicitud</Text>
            <Text style={styles.value}>
              {resolvedRequestType === "Supply"
                ? supplyDetail?.supply_request_code ?? "—"
                : fuelDetail?.fuel_request_code ?? "—"}
            </Text>
          </View>
          {resolvedRequestType === "Supply" && (supplyDetail?.operational_order_information?.po_code ?? supplyDetail?.po_code) ? (
            <View style={styles.fieldThird}>
              <Text style={styles.label}>Código PO</Text>
              <Text style={styles.value}>
                {supplyDetail?.operational_order_information?.po_code ?? supplyDetail?.po_code ?? "—"}
              </Text>
            </View>
          ) : null}
          {resolvedRequestType === "Supply" ? (
            <View style={styles.fieldThird}>
              <Text style={styles.label}>Razón de uso</Text>
              <Text style={styles.value}>{reasonUseLabel}</Text>
            </View>
          ) : null}
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Solicitante</Text>
            <Text style={styles.value}>{requester ?? "—"}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Fecha de solicitud</Text>
            <Text style={styles.value}>{requestDate}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Aprobado por</Text>
            <Text style={styles.value}>{approvedBy ?? "—"}</Text>
          </View>
          {annulledBy ? (
            <View style={styles.fieldThird}>
              <Text style={styles.label}>Anulado por</Text>
              <Text style={styles.value}>{annulledBy}</Text>
            </View>
          ) : null}
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Área</Text>
            <Text style={styles.value}>{area}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Centro de costo</Text>
            <Text style={styles.value}>{costCenter}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Almacén</Text>
            <Text style={styles.value}>{warehouse}</Text>
          </View>
          <View style={styles.fieldThird}>
            <Text style={styles.label}>Motivo de salida</Text>
            <Text style={styles.value}>{reasonRemoval}</Text>
          </View>
          {resolvedRequestType === "Supply" && supplyDetail?.customer_information?.legal_name ? (
            <View style={styles.fieldThird}>
              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.value}>{supplyDetail.customer_information.legal_name}</Text>
            </View>
          ) : null}
          {resolvedRequestType === "Supply" && supplyDetail?.duca_or_transport_order ? (
            <View style={styles.fieldThird}>
              <Text style={styles.label}>DUCA / Orden de transporte</Text>
              <Text style={styles.value}>{supplyDetail.duca_or_transport_order}</Text>
            </View>
          ) : null}
          {resolvedRequestType === "Fuel" && isCorinto && fuelDetail?.customer_information?.legal_name ? (
            <View style={styles.fieldThird}>
              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.value}>{fuelDetail.customer_information.legal_name}</Text>
            </View>
          ) : null}
        </View>

        {(resolvedRequestType === "Supply" && equipment) || (resolvedRequestType === "Fuel") ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Información de activo fijo</Text>
            <View style={styles.grid}>
              {resolvedRequestType === "Supply" ? (
                <>
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Código de activo</Text>
                    <Text style={styles.value}>{equipment?.code ?? "—"}</Text>
                  </View>
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Marca</Text>
                    <Text style={styles.value}>{equipment?.brand ?? "—"}</Text>
                  </View>
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Modelo</Text>
                    <Text style={styles.value}>{equipment?.model ?? "—"}</Text>
                  </View>
                  {equipment?.serial_number ? (
                    <View style={styles.fieldThird}>
                      <Text style={styles.label}>Número de serie</Text>
                      <Text style={styles.value}>{equipment.serial_number}</Text>
                    </View>
                  ) : null}
                  {equipment?.type ? (
                    <View style={styles.fieldThird}>
                      <Text style={styles.label}>Tipo</Text>
                      <Text style={styles.value}>{equipment.type}</Text>
                    </View>
                  ) : null}
                  {supplyFuelTypes !== "—" ? (
                    <View style={styles.fieldThird}>
                      <Text style={styles.label}>Combustible</Text>
                      <Text style={styles.value}>{supplyFuelTypes}</Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <>
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Código de activo</Text>
                    <Text style={styles.value}>{machineryCode}</Text>
                  </View>
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Marca</Text>
                    <Text style={styles.value}>{machineryBrand}</Text>
                  </View>
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Modelo</Text>
                    <Text style={styles.value}>{machineryModel}</Text>
                  </View>
                  {machinerySerial !== "—" ? (
                    <View style={styles.fieldThird}>
                      <Text style={styles.label}>Número de serie</Text>
                      <Text style={styles.value}>{machinerySerial}</Text>
                    </View>
                  ) : null}
                  {machineryType !== "—" ? (
                    <View style={styles.fieldThird}>
                      <Text style={styles.label}>Tipo</Text>
                      <Text style={styles.value}>{machineryType}</Text>
                    </View>
                  ) : null}
                  <View style={styles.fieldThird}>
                    <Text style={styles.label}>Combustible</Text>
                    <Text style={styles.value}>{fuelTypes}</Text>
                  </View>
                </>
              )}
            </View>
          </>
        ) : null}

        {resolvedRequestType === "Fuel" && fuelDetail ? (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Detalle de combustible</Text>
            <View style={styles.grid}>
              {isCorinto && fuelDetail?.customer_information?.legal_name ? (
                <View style={styles.fieldThird}>
                  <Text style={styles.label}>Cliente</Text>
                  <Text style={styles.value}>{fuelDetail.customer_information.legal_name}</Text>
                </View>
              ) : null}
              <View style={styles.fieldThird}>
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
              {fuelDetail.engine_hours != null || fuelDetail.previous_engine_hours != null ? (
                <View style={styles.fieldThird}>
                  <Text style={styles.label}>Horas motor</Text>
                  <Text style={styles.value}>
                    Anterior: {fuelDetail.previous_engine_hours != null ? `${fuelDetail.previous_engine_hours} hrs` : "—"}{"\n"}
                    Actual: {fuelDetail.engine_hours != null ? `${fuelDetail.engine_hours} hrs` : "—"}
                  </Text>
                </View>
              ) : fuelDetail.mileage != null ? (
                <View style={styles.fieldThird}>
                  <Text style={styles.label}>Kilometraje</Text>
                  <Text style={styles.value}>{fuelDetail.mileage} km</Text>
                </View>
              ) : null}
            </View>
          </>
        ) : null}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>
          {isApproved && kardexMovements.length ? "Movimiento de Kardex" : "Artículos"}
        </Text>
        {isApproved && kardexMovements.length ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.colProduct]}>N°Item</Text>
              <Text style={[styles.tableCell, styles.colProduct]}>Código de inventario</Text>
              <Text style={[styles.tableCell, styles.colProduct]}>Nombre de producto</Text>
              <Text style={[styles.tableCell, styles.colQty]}>Cantidad Solicitada</Text>
              <Text style={[styles.tableCell, styles.colQty]}>Costo</Text>
              <Text style={[styles.tableCell, styles.colQty]}>Costo Total</Text>
            </View>
            {kardexMovements.map((movement: any, index: number) => (
              <View key={movement.kardex_id ?? index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colProduct]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.colProduct]}>
                  {movement.product_information?.product_code ?? "—"}
                </Text>
                <Text style={[styles.tableCell, styles.colProduct]}>
                  {movement.product_information?.product_name ?? "—"}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {movement.units != null
                    ? `${movement.units} ${movement.unit_measure_information?.symbol ?? ""}`.trim()
                    : "—"}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {movement.unit_cost != null ? formatCurrency(movement.unit_cost) : "—"}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {movement.total_output != null ? formatCurrency(movement.total_output) : "—"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
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
        )}

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