import { memo } from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";

import { getEquipmentTypeLabel } from "@app/modules/warehouse/domain/enums/equipment.enum";

import type { OutputLineEquipmentProduct } from "@app/modules/Inventory/domain/api-contract/responses/output-line-equipment-report.response";

import { EquipmentReportPdfHeader } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf-header";
import { formatDate, formatNumber } from "@app/modules/Inventory/ui/pages/reports/shared/equipment/pdf/equipment-report-pdf.utils";

import type { OutputsByEquipmentReportPdfProps } from "@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/pdf/outputs-by-equipment-report.types";
import { outputsByEquipmentReportStyles as styles } from "@app/modules/Inventory/ui/pages/reports/outputs-by-equipment/pdf/outputs-by-equipment-report.styles";

function sumEquipmentTotals(products: OutputLineEquipmentProduct[]) {
   return products.reduce(
      (totals, product) => ({
         total_quantity: totals.total_quantity + (product.total_quantity ?? 0),
         total_cost: totals.total_cost + (product.total_cost ?? 0),
         total_total_cost: totals.total_total_cost + (product.total_total_cost ?? 0),
      }),
      { total_quantity: 0, total_cost: 0, total_total_cost: 0 },
   );
}

function OutputsByEquipmentReportPdfComponent({ report, logoUrl }: OutputsByEquipmentReportPdfProps) {
   return (
      <Document>
         <Page size="A4" orientation="landscape" style={styles.page} wrap>
            <EquipmentReportPdfHeader
               title="REPORTE DE SALIDAS POR EQUIPO (LINEA-EQUIPO)"
               report={report}
               logoUrl={logoUrl}
            />

            <View style={styles.divider} />

            {report.categories.length === 0 ? (
               <Text style={styles.empty}>No hay datos para los filtros seleccionados.</Text>
            ) : (
               report.categories.map((category, ci) => (
                  <View key={`cat-${ci}`}>
                     <Text style={styles.categoryTitle} wrap={false}>
                        {category.category_name || "Sin categoria"}
                     </Text>
                     {category.equipments.map((equipment, ei) => {
                        const equipmentTotals = sumEquipmentTotals(equipment.products);

                        return (
                           <View key={`eq-${ci}-${ei}`} style={styles.equipmentBlock}>
                              <Text style={styles.equipmentTitle} wrap={false}>
                                 Equipo: {equipment.equipment_information?.code || "Sin equipo"} - {equipment.equipment_information?.brand || ""} {equipment.equipment_information?.model || ""} | Tipo: {getEquipmentTypeLabel(equipment.equipment_information?.type)}
                              </Text>

                              {equipment.products.length === 0 ? (
                                 <Text style={styles.empty}>No hay productos para este equipo.</Text>
                              ) : (
                                 equipment.products.map((product, pi) => (
                                    <View key={`product-${ci}-${ei}-${pi}`} style={styles.productBlock}>
                                       <Text style={styles.productTitle} wrap={false}>
                                          {product.supply || "—"} ({product.stock_code || "—"})
                                       </Text>
                                       <View style={styles.table}>
                                          <View style={styles.tableHeader} wrap={false}>
                                             <Text style={[styles.cell, styles.headerCell, styles.colCode]}>Salida</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colRequest]}>Solicitud</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colDate]}>Fecha</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colQty]}>Cant.</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colCost]}>Costo</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colTotal]}>Total Cost</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colCenter]}>Centro costo</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colService]}>Orden servicio</Text>
                                             <Text style={[styles.cell, styles.headerCell, styles.colCustomer]}>Cliente</Text>
                                          </View>

                                          {product.items.map((item, ii) => (
                                             <View
                                                key={`item-${ci}-${ei}-${pi}-${ii}`}
                                                style={ii % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                                                wrap={false}
                                             >
                                                <Text style={[styles.cell, styles.colCode]}>{item.output_code || "—"}</Text>
                                                <Text style={[styles.cell, styles.colRequest]}>{item.request_code || "—"}</Text>
                                                <Text style={[styles.cell, styles.colDate]}>{formatDate(item.output_date)}</Text>
                                                <Text style={[styles.cell, styles.colQty]}>{formatNumber(item.quantity)}</Text>
                                                <Text style={[styles.cell, styles.colCost]}>{formatNumber(item.cost)}</Text>
                                                <Text style={[styles.cell, styles.colTotal]}>{formatNumber(item.total_cost)}</Text>
                                                <Text style={[styles.cell, styles.colCenter]}>{item.cost_center || "—"}</Text>
                                                <Text style={[styles.cell, styles.colService]}>{item.service_order_code || "—"}</Text>
                                                <Text style={[styles.cell, styles.colCustomer]}>{item.customer || "—"}</Text>
                                             </View>
                                          ))}

                                          <View style={styles.totalsRow} wrap={false}>
                                             <Text style={[styles.totalsLabel, styles.colLabel]}>
                                                Totales utilizados por el producto
                                             </Text>
                                             <Text style={[styles.totalsCell, styles.colQty]}>
                                                {formatNumber(product.total_quantity)}
                                             </Text>
                                             <Text style={[styles.totalsCell, styles.colCost]}>
                                                {formatNumber(product.total_cost)}
                                             </Text>
                                             <Text style={[styles.totalsCell, styles.colTotal]}>
                                                {formatNumber(product.total_total_cost)}
                                             </Text>
                                             <Text style={[styles.totalsCell, styles.colCenter]}>{""}</Text>
                                             <Text style={[styles.totalsCell, styles.colService]}>{""}</Text>
                                             <Text style={[styles.totalsCell, styles.colCustomer]}>{""}</Text>
                                          </View>
                                       </View>
                                    </View>
                                 ))
                              )}

                              {equipment.products.length > 0 ? (
                                 <View style={[styles.totalsRow, styles.equipmentTotalsRow]} wrap={false}>
                                    <Text style={[styles.totalsLabel, styles.colLabel]}>
                                       Totales utilizados por el equipo
                                    </Text>
                                    <Text style={[styles.totalsCell, styles.colQty]}>
                                       {formatNumber(equipmentTotals.total_quantity)}
                                    </Text>
                                    <Text style={[styles.totalsCell, styles.colCost]}>
                                       {formatNumber(equipmentTotals.total_cost)}
                                    </Text>
                                    <Text style={[styles.totalsCell, styles.colTotal]}>
                                       {formatNumber(equipmentTotals.total_total_cost)}
                                    </Text>
                                    <Text style={[styles.totalsCell, styles.colCenter]}>{""}</Text>
                                    <Text style={[styles.totalsCell, styles.colService]}>{""}</Text>
                                    <Text style={[styles.totalsCell, styles.colCustomer]}>{""}</Text>
                                 </View>
                              ) : null}
                           </View>
                        );
                     })}
                  </View>
               ))
            )}

            <Text style={styles.footer}>Documento generado para impresión</Text>
         </Page>
      </Document>
   );
}

export const OutputsByEquipmentReportPdf = memo(OutputsByEquipmentReportPdfComponent);
