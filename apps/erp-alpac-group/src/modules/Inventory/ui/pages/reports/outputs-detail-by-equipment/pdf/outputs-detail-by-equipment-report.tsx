import { memo } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";

import { EquipmentReportPdfHeader } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf-header";
import { formatDate, formatNumber } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.utils";

import type { OutputsDetailByEquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/pdf/outputs-detail-by-equipment-report.types";
import { outputsDetailByEquipmentReportStyles as styles } from "@app/modules/Inventory/ui/pages/reports/outputs-detail-by-equipment/pdf/outputs-detail-by-equipment-report.styles";

function OutputsDetailByEquipmentReportPdfComponent({ report, logoUrl }: OutputsDetailByEquipmentReportPdfProps) {
   return (
      <Document>
         <Page size="A4" orientation="landscape" style={styles.page} wrap>
            <EquipmentReportPdfHeader
               title="REPORTE DE SALIDAS A DETALLE POR EQUIPO"
               report={report}
               logoUrl={logoUrl}
            />

            <View style={styles.divider} />

            {report.items.length === 0 ? (
               <Text style={styles.empty}>No hay datos para los filtros seleccionados.</Text>
            ) : (
               <View style={styles.table}>
                  <View style={styles.tableHeader} wrap={false}>
                     <Text style={[styles.cell, styles.headerCell, styles.colCode]}>Salida</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colRequest]}>Solicitud</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colEquipment]}>Equipo</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colCategory]}>Categoría</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colStockCode]}>Cód. stock</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colDate]}>Fecha salida</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colSupply]}>Insumo</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colQty]}>Cantidad</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colCost]}>Costo unit.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colTotal]}>Costo total</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colCenter]}>Centro costo</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colService]}>Orden serv.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colCustomer]}>Cliente</Text>
                  </View>

                  {report.items.map((item, index) => (
                     <View
                        key={`item-${index}`}
                        style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                        wrap={false}
                     >
                        <Text style={[styles.cell, styles.colCode]}>{item.output_code || "—"}</Text>
                        <Text style={[styles.cell, styles.colRequest]}>{item.request_code || "—"}</Text>
                        <Text style={[styles.cell, styles.colEquipment]}>{item.equipment || "—"}</Text>
                        <Text style={[styles.cell, styles.colCategory]}>{item.category || "—"}</Text>
                        <Text style={[styles.cell, styles.colStockCode]}>{item.stock_code || "—"}</Text>
                        <Text style={[styles.cell, styles.colDate]}>{formatDate(item.output_date)}</Text>
                        <Text style={[styles.cell, styles.colSupply]}>{item.supply || "—"}</Text>
                        <Text style={[styles.cell, styles.colQty]}>{formatNumber(item.quantity)}</Text>
                        <Text style={[styles.cell, styles.colCost]}>{formatNumber(item.cost)}</Text>
                        <Text style={[styles.cell, styles.colTotal]}>{formatNumber(item.total_cost)}</Text>
                        <Text style={[styles.cell, styles.colCenter]}>{item.cost_center || "—"}</Text>
                        <Text style={[styles.cell, styles.colService]}>{item.service_order_code || "—"}</Text>
                        <Text style={[styles.cell, styles.colCustomer]}>{item.customer || "—"}</Text>
                     </View>
                  ))}

                  <View style={styles.totalsRow} wrap={false}>
                     <Text style={[styles.totalsLabel, styles.colTotalsLabel]}>
                        Totales generales
                     </Text>
                     <Text style={[styles.totalsCell, styles.colQty]}>
                        {formatNumber(report.total_quantity)}
                     </Text>
                     <Text style={[styles.totalsCell, styles.colCost]}>
                        {formatNumber(report.total_cost)}
                     </Text>
                     <Text style={[styles.totalsCell, styles.colTotal]}>
                        {formatNumber(report.total_total_cost)}
                     </Text>
                     <Text style={[styles.totalsCell, styles.colCenter]}>{""}</Text>
                     <Text style={[styles.totalsCell, styles.colService]}>{""}</Text>
                     <Text style={[styles.totalsCell, styles.colCustomer]}>{""}</Text>
                  </View>
               </View>
            )}

            <Text style={styles.footer}>Documento generado para impresión</Text>
         </Page>
      </Document>
   );
}

export const OutputsDetailByEquipmentReportPdf = memo(OutputsDetailByEquipmentReportPdfComponent);
