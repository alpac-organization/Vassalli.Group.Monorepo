import { memo } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";

import { EquipmentReportPdfHeader } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf-header";
import { formatNumber } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.utils";

import type { OutputsConsolidatedByEquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/pdf/outputs-consolidated-by-equipment-report.types";
import { outputsConsolidatedByEquipmentReportStyles as styles } from "@app/modules/Inventory/ui/pages/reports/outputs-consolidated-by-equipment/pdf/outputs-consolidated-by-equipment-report.styles";

function OutputsConsolidatedByEquipmentReportPdfComponent({ report, logoUrl }: OutputsConsolidatedByEquipmentReportPdfProps) {
   return (
      <Document>
         <Page size="A4" orientation="portrait" style={styles.page} wrap>
            <EquipmentReportPdfHeader
               title="REPORTE DE SALIDAS CONSOLIDADAS POR EQUIPO"
               report={report}
               logoUrl={logoUrl}
            />

            <View style={styles.divider} />

            {report.categories.length === 0 ? (
               <Text style={styles.empty}>No hay datos para los filtros seleccionados.</Text>
            ) : (
               report.categories.map((category, categoryIndex) => (
                  <View key={`category-${categoryIndex}`} style={styles.categoryBlock}>
                     <Text style={styles.categoryTitle} wrap={false}>
                        {category.category_name || "Sin categoria"}
                     </Text>

                     <View style={styles.table}>
                        <View style={styles.tableHeader} wrap={false}>
                           <Text style={[styles.cell, styles.headerCell, styles.colEquipment]}>Equipo</Text>
                           <Text style={[styles.cell, styles.headerCell, styles.colStockCode]}>Cód. stock</Text>
                           <Text style={[styles.cell, styles.headerCell, styles.colSupply]}>Insumo</Text>
                           <Text style={[styles.cell, styles.headerCell, styles.colQty]}>Cantidad</Text>
                           <Text style={[styles.cell, styles.headerCell, styles.colTotal]}>Costo total</Text>
                           <Text style={[styles.cell, styles.headerCell, styles.colCenter]}>Centro costo</Text>
                           <Text style={[styles.cell, styles.headerCell, styles.colCustomer]}>Cliente</Text>
                        </View>

                        {category.items.map((item, itemIndex) => (
                           <View
                              key={`item-${categoryIndex}-${itemIndex}`}
                              style={itemIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                              wrap={false}
                           >
                              <Text style={[styles.cell, styles.colEquipment]}>{item.equipment || "—"}</Text>
                              <Text style={[styles.cell, styles.colStockCode]}>{item.stock_code || "—"}</Text>
                              <Text style={[styles.cell, styles.colSupply]}>{item.supply || "—"}</Text>
                              <Text style={[styles.cell, styles.colQty]}>{formatNumber(item.quantity)}</Text>
                              <Text style={[styles.cell, styles.colTotal]}>{formatNumber(item.total_cost)}</Text>
                              <Text style={[styles.cell, styles.colCenter]}>{item.cost_center || "—"}</Text>
                              <Text style={[styles.cell, styles.colCustomer]}>{item.customer || "—"}</Text>
                           </View>
                        ))}

                        <View style={styles.totalsRow} wrap={false}>
                           <Text style={[styles.totalsLabel, styles.colTotalsLabel]}>
                              Totales de la categoría
                           </Text>
                           <Text style={[styles.totalsCell, styles.colQty]}>
                              {formatNumber(category.total_quantity)}
                           </Text>
                           <Text style={[styles.totalsCell, styles.colTotal]}>
                              {formatNumber(category.total_cost)}
                           </Text>
                           <Text style={[styles.totalsCell, styles.colCenter]}>{""}</Text>
                           <Text style={[styles.totalsCell, styles.colCustomer]}>{""}</Text>
                        </View>
                     </View>
                  </View>
               ))
            )}

            <Text style={styles.footer}>Documento generado para impresión</Text>
         </Page>
      </Document>
   );
}

export const OutputsConsolidatedByEquipmentReportPdf = memo(OutputsConsolidatedByEquipmentReportPdfComponent);
