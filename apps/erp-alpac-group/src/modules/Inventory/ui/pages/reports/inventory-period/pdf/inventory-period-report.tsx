import { memo } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { PeriodInventoryReport } from "@app/modules/Inventory/domain/api-contract/responses/period-inventory-report.response";
import { EquipmentReportPdfHeader } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf-header";
import { formatNumber } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.utils";

import { inventoryPeriodReportStyles as styles } from "@app/modules/Inventory/ui/pages/reports/inventory-period/pdf/inventory-period-report.styles";

export type InventoryPeriodReportPdfProps = {
   report: PeriodInventoryReport;
   logoUrl?: string | null;
};

function InventoryPeriodReportPdfComponent({ report, logoUrl }: InventoryPeriodReportPdfProps) {
   return (
      <Document>
         <Page size="A4" orientation="landscape" style={styles.page} wrap>
            <EquipmentReportPdfHeader
               title="REPORTE DE INVENTARIO POR PERIODO"
               report={report}
               logoUrl={logoUrl}
            />

            <View style={styles.divider} />

            {report.items.length === 0 ? (
               <Text style={styles.empty}>No hay datos para los filtros seleccionados.</Text>
            ) : (
               <View style={styles.table}>
                  <View style={styles.tableHeader} wrap={false}>
                     <Text style={[styles.cell, styles.headerCell, styles.colStockCode]}>Cód. stock</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colProduct]}>Producto</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colInitialQuantity]}>Cant. ini.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colInitialCost]}>Costo ini.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colInitialTotal]}>Total ini.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colEntryQuantity]}>Cant. ent.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colEntryTotal]}>Total ent.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colExitQuantity]}>Cant. sal.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colExitTotal]}>Total sal.</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colFinalQuantity]}>Cant. final</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colFinalCost]}>Costo final</Text>
                     <Text style={[styles.cell, styles.headerCell, styles.colFinalTotal]}>Total final</Text>
                  </View>

                  {report.items.map((item, index) => (
                     <View
                        key={`item-${index}`}
                        style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                        wrap={false}
                     >
                        <Text style={[styles.cell, styles.colStockCode]}>{item.stock_code || "—"}</Text>
                        <Text style={[styles.cell, styles.colProduct]}>{item.product_name || "—"}</Text>
                        <Text style={[styles.cell, styles.colInitialQuantity]}>{formatNumber(item.initial_quantity)}</Text>
                        <Text style={[styles.cell, styles.colInitialCost]}>{formatNumber(item.initial_cost)}</Text>
                        <Text style={[styles.cell, styles.colInitialTotal]}>{formatNumber(item.initial_total)}</Text>
                        <Text style={[styles.cell, styles.colEntryQuantity]}>{formatNumber(item.entry_quantity)}</Text>
                        <Text style={[styles.cell, styles.colEntryTotal]}>{formatNumber(item.entry_total_cost)}</Text>
                        <Text style={[styles.cell, styles.colExitQuantity]}>{formatNumber(item.exit_quantity)}</Text>
                        <Text style={[styles.cell, styles.colExitTotal]}>{formatNumber(item.exit_total_cost)}</Text>
                        <Text style={[styles.cell, styles.colFinalQuantity]}>{formatNumber(item.final_quantity)}</Text>
                        <Text style={[styles.cell, styles.colFinalCost]}>{formatNumber(item.final_cost)}</Text>
                        <Text style={[styles.cell, styles.colFinalTotal]}>{formatNumber(item.final_total)}</Text>
                     </View>
                  ))}

                  <View style={styles.totalsRow} wrap={false}>
                     <Text style={[styles.totalsLabel, styles.colTotalsLabel]}>Totales generales</Text>
                     <Text style={[styles.totalsCell, styles.colInitialTotal]}>
                        {formatNumber(report.total_initial_total)}
                     </Text>
                     <Text style={[styles.totalsCell, styles.colEntryQuantity]}>{""}</Text>
                     <Text style={[styles.totalsCell, styles.colEntryTotal]}>
                        {formatNumber(report.total_entry_total_cost)}
                     </Text>
                     <Text style={[styles.totalsCell, styles.colExitQuantity]}>{""}</Text>
                     <Text style={[styles.totalsCell, styles.colExitTotal]}>
                        {formatNumber(report.total_exit_total_cost)}
                     </Text>
                     <Text style={[styles.totalsCell, styles.colFinalQuantity]}>{""}</Text>
                     <Text style={[styles.totalsCell, styles.colFinalCost]}>{""}</Text>
                     <Text style={[styles.totalsCell, styles.colFinalTotal]}>
                        {formatNumber(report.total_final_total)}
                     </Text>
                  </View>
               </View>
            )}

            <Text style={styles.footer}>Documento generado para impresión</Text>
         </Page>
      </Document>
   );
}

export const InventoryPeriodReportPdf = memo(InventoryPeriodReportPdfComponent);
